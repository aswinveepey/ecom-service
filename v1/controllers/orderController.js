const mongoose = require("mongoose");
const orderModel = require("../models/order");
const customerModel = require("../models/customer");
const skuModel = require("../models/sku");

async function getAllOrders(req, res) {
  //diff between user & customer
  try {
    orders = await orderModel
      .find()
      .populate({ path: "orderitems.sku.product", select: "name" })
      .populate({
        path: "customer.customer.auth",
        select: "email mobilenumber",
      })
      .populate({
        path: "customer.customer.account",
        select: "name",
      })
      .lean()
      .limit(250);
    return res.json({ data: orders });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function getOneOrder(req, res) {
  try {
    const { orderId } = req.params;
    order = await orderModel
      .findById(orderId)
      .lean();
    return res.json({ data: order });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function createOrder(req, res) {
  try {
    var {
      customer,
      orderitems,
      amount,
      payment
    } = req.body;

    //get user from request
    user = req.user;
    if(!customer.customer) res.status(400).json({message:"Customer Required"})

    //check if customer id is valid
    if (!mongoose.Types.ObjectId.isValid(customer.customer._id)) res.status(400).json({ message: "Invalid customer ID" })

    //get current customer
    currentCustomer = await customerModel
      .findById(customer.customer._id)
      .populate("address")
      .catch((err) => console.log(err));

    //check if customer is valid
    if(!currentCustomer) res.status(400).json({ message: "Specified Customer could not be found" });
    !currentCustomer.address[0] && res.status(400).json({ message: "Ensure Customer address is valid" }); 

    //assign customer to customer.customer
    customer.customer = currentCustomer
    customer.deliveryaddress = currentCustomer.address[0];
    customer.billingaddress = currentCustomer.address[0];

    //ensure order items include atleast 1 sku
    if(orderitems.length  === 0){
      return res.status(400).json({message:"Atleast One Sku should be present"})
    }

    //loop through order items and perform operations
    processeditems = await Promise.all(
      orderitems.map(async (item, index) => {
        //check if sku id is valid
        if (!mongoose.Types.ObjectId.isValid(item.sku._id))
          res.status(400).json({ message: "Invalid customer ID" });
        //get sku
        sku = await skuModel
          .findById(item.sku._id)
          .populate("inventory")
          .lean()
          .catch((err) => console.log(err));
        //if invalid sku return error
        if (!sku) res.status(400).json({message: "Specified SKU could not be found",index: index,});
        //assign sku from query
        item.sku = sku;

        //Booked Quantity Validations
        //min qty rule
        if (!item.quantity.booked >= sku.quantityrules.minorderqty)
          res.status(400).json({
            message: `Quantity should be greater than or equal ${sku.quantityrules.minorderqty}`,
            index: index,
          });
        //min qty step rule
        if (
          sku.quantityrules.minorderqtystep &&
          !(item.quantity.booked % sku.quantityrules.minorderqty === 0)
        )
          res
            .status(400)
            .json({
              message: "Minimum order qty multiples rules violated",
              index: index,
            });
        // max qty rule
        if (
          (sku.quantityrules.maxorderqty != 0) &&
          (item.quantity.booked > sku.quantityrules.maxorderqty)
        )
          res
            .status(400)
            .json({
              message: `Quantity should be lesser than ${sku.quantityrules.maxorderqty}`,
            });
        //Inventory Operations
        //check if inventory for particular sku exists
        !sku.inventory[0]&&res.status(400).json({message:"No inventory for selected sku",index: index,});
        //check if inventory gte booked qty
        if (!sku.inventory[0] >= item.quantity.booked) res.status(400).json({message:"OOS for selected territory",index: index,});
        
        //capture territory information
        item.quantity.territory = sku.inventory[0].territory;
        
        //set default status
        item.status = "Booked";
      })
    );
    order = await orderModel
      .create({
        customer: customer,
        amount: amount,
        payment: payment,
        orderitems: orderitems,
      })
      .catch((err) => console.log(err));
    order = await order.calculateTotals();
    return res.json({ data: order });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function updateOrder(req, res) {
    try {
      
      //get variables from request body
      var { _id, customer, orderitems, amount, payment } = req.body;
      
      //get user from request
      user = req.user;
      
      //validate order id and order
      if (!mongoose.Types.ObjectId.isValid(_id))
        res.status(400).json({ message: "Invalid Order ID" });
      order = await orderModel.findById(_id).populate("customer").populate("orderitems").populate("payments").populate("amount")
      if(!order) res.status(400).json({message: "Order Not Found"})
      
      //change customer address
      order.customer.deliveryaddress = customer.deliveryaddress
      order.customer.billingaddress = customer.billingaddress
      
      //change order items
      orderitems.map((item, index)=>{
        //assign quantity items
        order.orderitems[index].quantity.confirmed = item.quantity.confirmed
        order.orderitems[index].quantity.shipped = item.quantity.shipped
        order.orderitems[index].quantity.delivered = item.quantity.delivered
        order.orderitems[index].quantity.returned = item.quantity.returned

        //manage statuses
        if(item.status === "Cancelled") res.status(400).json({message:"Cancellation Not Supported"})
        order.orderitems[index].status = item.status;

        //manage discount applied
        order.orderitems[index].amount.discount = item.amount.discount;
      });

      //manage order amount fields
      order.amount.discount = amount.discount
      order.amount.installation = amount.installation;
      order.amount.shipping = amount.shipping;

      order.payment = payment
      //save order & return
      await order.save()
      //calculate totals
      order = await order.calculateTotals();

      //return
      return res.json({ data: order });
    } catch (error) {

      //catch error & return
      console.log(error);
      return res.status(400).json({ message: error });
    }
}

async function searchOrder(req, res) {
  const { searchString } = req.body;
  if (!mongoose.Types.ObjectId.isValid(searchString)) {
    return res.status(400).json({ message: "Non Order Ids are not supported" });
  }
  try {
    orderModel
      .find({ _id: searchString })
      .limit(3)
      .populate({ path: "orderitems.sku.product", select: "name" })
      .lean()
      .exec(function (err, docs) {
        if (err) {
          return res.status(400).json({ message: err });
        }
        return res.json({ data: docs });
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  getOneOrder,
  updateOrder,
  searchOrder,
};

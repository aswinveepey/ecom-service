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

    //initialize order amounts
    amount.amount = 0
    amount.installation = 0
    amount.shipping = 0

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
        //check if quantity > 0
        if (!item.quantity.booked > 0) res.status(400).json({ message: "Quantity should be greater than 0" });
        //check if inventory for particular sku exists
        !sku.inventory[0]&&res.status(400).json({message:"No inventory for selected sku",index: index,});
        //check if inventory gte booked qty
        if (!sku.inventory[0] >= item.quantity.booked) res.status(400).json({message:"OOS for selected territory",index: index,});
        //check if booked quantity matches inventory
        item.quantity.territory = sku.inventory[0].territory;
        // handle amount operations
        itemamount = item.sku.price.sellingprice * item.quantity.delivered ||
          item.quantity.shipped || item.quantity.confirmed || item.quantity.booked;
        itemdiscount = item.sku.price.discount * item.quantity.delivered ||
          item.quantity.shipped || item.quantity.confirmed || item.quantity.booked;
        itemtotalamount = itemdiscount ? (itemamount - itemdiscount ): itemamount;
        itemshipping = item.sku.price.shippingcharges * item.quantity.shipped ||
          item.quantity.confirmed || item.quantity.booked;
        iteminstallation = item.sku.price.installationcharges * item.quantity.delivered ||
          item.quantity.shipped || item.quantity.confirmed || item.quantity.booked;
        item.amount = {};
        item.amount.amount = itemamount;
        item.amount.discount = itemdiscount || 0;
        item.amount.totalamount = itemtotalamount;
        //set default status
        item.status = "Booked";
        //increment order amounts
        amount.amount += itemtotalamount;
        amount.shipping += itemshipping;
        amount.installation += iteminstallation;
      })
    );

    //calculate order total amount post applying discount if any
    amount.totalamount = amount.amount - (amount.discount || 0)
    order = await orderModel
      .create({
        customer: customer,
        amount: amount,
        payment: payment,
        orderitems: orderitems,
      })
      .catch((err) => console.log(err));
    return res.json({ data: order });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

// async function updateOrder(req, res) {
//   try {
//     var {
//       _id,
//       name,
//       product,
//       inventory,
//       assets,
//       attributes,
//       dattributes,
//       price,
//       bulkdiscount,
//       quantityrules,
//     } = req.body;
//     user = req.user;

//     inventory.forEach((data) => {
//       if (!mongoose.Types.ObjectId.isValid(data.territory._id)) {
//         return res.status(400).json({ message: "Invalid Territory ID" });
//       }
//       data.territory = data.territory._id;
//     });
//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//       return res.status(400).json({ message: "Invalid SKU ID" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(product._id)) {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }
//     order = await orderModel.findByIdAndUpdate(
//       mongoose.Types.ObjectId(_id),
//       {
//         $set: {
//           name: name,
//           product: product._id,
//           inventory: inventory,
//           assets: assets,
//           attributes: attributes,
//           dattributes: dattributes,
//           price: price,
//           quantityrules: quantityrules,
//           bulkdiscount: bulkdiscount,
//         },
//         $push: {
//           updatelog: { updatedby: user._id },
//         },
//       },
//       { new: true }
//     );
//     return res.json(order);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json({ message: err });
//   }
// }

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
  // updateOrder,
  searchOrder,
};

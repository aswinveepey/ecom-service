const mongoose = require("mongoose");
const orderModel = require("../models/order");
const customerModel = require("../models/customer");
const skuModel = require("../models/sku");
const skuRules = require("../services/orderValidations");
const territoryMappingService = require("../services/territoryMappingService");

async function getAllOrders(req, res) {
  //diff between user & customer
  try {
    orders = await orderModel
      .find()
      .sort({createdat:-1})
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
    return res.status(400).json({ message: error.message });
  }
}

async function customerOrderhistory(req, res) {
  auth = req.auth._id
  customer = await customerModel.findOne({ auth: auth._id });
  !customer && res.status(400).json({ message: "Customer Not Found" });
  console.log(customer);
  try {
    orders = await orderModel
      .find({"customer.customer._id": customer._id})
      .populate({ path: "orderitems.sku.product", select: "name" })
      .lean()
      .limit(250);
    return res.json({ data: orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getOneOrder(req, res) {
  try {
    const { orderId } = req.params;
    order = await orderModel.findById(orderId).lean();
    return res.json({ data: order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function createOrder(req, res) {
  try {
    var { customer, orderitems, amount, payment } = req.body;

    //get user from request
    user = req.user;
    if (!customer.customer) {
      return res.status(400).json({ message: "Customer Required" });
    }

    //check if customer id is valid
    if (!mongoose.Types.ObjectId.isValid(customer.customer._id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    //get current customer
    currentCustomer = await customerModel
      .findById(customer.customer._id)
      .populate("address")
      .catch((err) => console.log(err.message));

    //check if customer is valid
    if (!currentCustomer) {
      return res
        .status(400)
        .json({ message: "Specified Customer could not be found" });
    }

    //assign customer to customer.customer
    customer.customer = currentCustomer;
    
    mappedTerritories = await territoryMappingService.mapTerritory(customer.deliveryaddress.pincode);

    //ensure order items include atleast 1 sku
    if (orderitems.length === 0) {
      return res
        .status(400)
        .json({ message: "Atleast One Sku should be present" });
    }
    //loop through order items and perform operations
    await Promise.all(
      orderitems.map(async (item) => {
        //check if sku id is valid
        if (!mongoose.Types.ObjectId.isValid(item.sku._id)) {
          throw new Error("Invalid SKU ID");
        }
        //get sku
        skus = await skuModel.aggregate([
          { $match: { _id: mongoose.Types.ObjectId(item.sku._id) } },
        ]);
        sku=skus[0]
        //if invalid sku return error
        if (!sku) {
          throw new Error("Invalid SKU - Servicability or SKU status could have changed");
        }
        //assign sku from query
        item.sku = sku;
        //get inventory based on customer territory - TODO
        item.selectedInventoryIndex=0;
        //Quantity Rule Validations
        await skuRules.validateSkuQuantityRules(sku, item.quantity.booked);
        //min qty rule
        if (!(item.quantity.booked >= sku.quantityrules.minorderqty)) {
          throw new Error(`Quantity should be greater than or equal ${sku.quantityrules.minorderqty}`);
        }
        //Inventory Operations
        //check if inventory for particular sku exists
        if (!sku.inventory[item.selectedInventoryIndex]) {
          throw new Error("No inventory for selected sku");
        }
        //check if inventory gte booked qty
        if (
          !sku.inventory[item.selectedInventoryIndex] >= item.quantity.booked
        ) {
          throw new Error("OOS for selected territory");
        }

        //capture territory information
        item.quantity.territory = sku.inventory[item.selectedInventoryIndex].territory;

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
      .catch((err) => {
        console.log(err)
        return res.status(400).json({ message: err.message });
      });
    order = await order.calculateTotals();
    return res.json({ data: order, message: "Succesfully created the order" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
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
    order = await orderModel
      .findById(_id)
      .populate("customer")
      .populate("orderitems")
      .populate("payments")
      .populate("amount");
    if (!order) res.status(400).json({ message: "Order Not Found" });

    //change customer address
    order.customer.deliveryaddress = customer.deliveryaddress;
    order.customer.billingaddress = customer.billingaddress;

    //change order items
    orderitems.map((item, index) => {
      if (order.orderitems[index].status!=="Cancelled"){
        //assign quantity items
        //if shipping qty not set, allow confirmed qty modification
        !item.quantity.shipped && (order.orderitems[index].quantity.confirmed = item.quantity.confirmed);
        //if delivered qty not set allow shipping qty modification
        !item.quantity.delivered && (order.orderitems[index].quantity.shipped = item.quantity.shipped);
        order.orderitems[index].quantity.delivered = item.quantity.delivered;
        order.orderitems[index].quantity.returned = item.quantity.returned;

        order.orderitems[index].status = item.status;
        //manage discount applied
        order.orderitems[index].amount.discount = item.amount.discount;
      }
    });

    //manage order amount fields
    order.amount.discount = amount.discount;
    order.amount.installation = amount.installation;
    order.amount.shipping = amount.shipping;

    order.payment = payment;
    //save order & return
    await order.save();
    //calculate totals
    order = await order.calculateTotals();

    //return
    return res.json({ data: order, message: "Succesfully updated the order" });
  } catch (error) {
    //catch error & return
    console.log(error);
    return res.status(400).json({ message: error.message });
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
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  getOneOrder,
  updateOrder,
  searchOrder,
  customerOrderhistory,
};

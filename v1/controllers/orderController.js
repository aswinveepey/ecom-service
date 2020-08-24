const mongoose = require("mongoose");
// const Order = require("../models/order");
// const Customer = require("../models/customer");
// const SKU = require("../models/sku");
const skuRules = require("../services/orderValidations");
const territoryMappingService = require("../services/territoryMappingService");
const inventoryService = require("../services/inventoryService");

async function getAllOrders(req, res) {
  //diff between user & customer
  try {
    const { startDate, endDate } = req.query;

    const db = req.db;
    const orderModel = await db.model("Order");

    let matchQuery = {};
    if(startDate && endDate){
      matchQuery = {
        createdat: { $gte: new Date(startDate), $lte: new Date(endDate) },
      };
    }
    orders = await orderModel.aggregate([
      //stage 1 - filter using query filters
      {
        $match: matchQuery,
      },
      //stage 2 - populate auth information
      {
        $lookup: {
          from: "auths",
          localField: "customer.customer.auth",
          foreignField: "_id",
          as: "customer.customer.auth",
        },
      },
      //stage 3 - unqind auth
      { $unwind: "$customer.customer.auth" },
      //stage 3 - populate account information
      {
        $lookup: {
          from: "accounts",
          localField: "customer.customer.account",
          foreignField: "_id",
          as: "customer.customer.account",
        },
      },
      //stage 4 - unqind auth
      {
        $unwind: {
          path: "$customer.customer.account",
          preserveNullAndEmptyArrays: true,
        },
      },
      //stage 5 unqind order items - pre populate
      { $unwind: "$orderitems" },
      //stage 6 populate product information
      {
        $lookup: {
          from: "products",
          localField: "orderitems.sku.product",
          foreignField: "_id",
          as: "orderitems.sku.product",
        },
      },
      //stage 7 unwind product information
      { $unwind: "$orderitems.sku.product" },
      //stage 8 - group items by order id
      {
        $group: {
          _id: "$_id",
          shortid: { $first: "$shortid" },
          customer: { $first: "$customer" },
          amount: { $first: "$amount" },
          createdat: { $first: "$createdat" },
          orderitems: { $push: "$orderitems" },
          payment: { $push: "$payment" },
        },
      },
      { $limit: 100 },
      { $sort: { createdat: -1 } },
    ]);
    //return orders
    return res.json({ data: orders });

  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message });
  }
}

async function customerOrderhistory(req, res) {
  try {
    const {db, customer} = req;

    const orderModel = await db.model("Order");

    if(!customer) throw new Error("Customer Not Found")

    orders = await orderModel
      .find({ "customer.customer._id": customer._id })
      .populate({ path: "orderitems.sku.product", select: "name" })
      .lean()
      .limit(250);
    return res.json({ data: orders });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getOneOrder(req, res) {
  try {
    const { orderId } = req.params;
    const {db} = req;

    const orderModel = await db.model("Order");

    order = await orderModel.findById(orderId).populate("orderitems.sku.product").lean();
    return res.json({ data: order });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createOrder(req, res) {
  try {
    var { customer, orderitems, amount, payment } = req.body;
    const db = req.db;
    const customerModel = await db.model("Customer");
    const orderModel = await db.model("Order");
    const skuModel = await db.model("Sku");

    let territoriesArray = [];
    let territoryQuery = {};

    //get user from request
    user = req.user;
    if (!customer.customer) {
      return res.status(400).json({ error: "Customer Required" });
    }

    //check if customer id is valid
    if (!mongoose.Types.ObjectId.isValid(customer.customer._id)) {
      return res.status(400).json({ error: "Invalid customer ID" });
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

    const territories = await territoryMappingService.mapPincodeToTerritory({
      db: db,
      pincode: customer.deliveryaddress.pincode,
    });

    territoriesArray = territories?.map((t) => mongoose.Types.ObjectId(t._id));

    //assign territory query if territories
    if (territoriesArray.length > 0) {
      territoryQuery = { "inventory.territory": { $in: territoriesArray } };
    }

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
          {
            $match: {
              $and: [
                { _id: mongoose.Types.ObjectId(item.sku._id) },
                territoryQuery,
              ],
            },
          },
        ]);
        //an array is returned so get the first object in array
        sku = skus[0];
        //if invalid sku return error
        if (!sku) {
          throw new Error(
            "SKU inactive or unservicable for selected territory"
          );
        }
        //assign sku from query
        item.sku = sku;
        //get inventory based on customer territory - TODO
        item.selectedInventoryImdex = 0;
        //Quantity Rule Validations
        await skuRules.validateSkuQuantityRules({sku:sku, quantity:item.quantity.booked});
        //min qty rule
        if (!(item.quantity.booked >= sku.quantityrules.minorderqty)) {
          throw new Error(
            `Quantity should be greater than or equal ${sku.quantityrules.minorderqty}`
          );
        }
        //Inventory Operations
        //check if inventory for particular sku exists
        if (!sku.inventory[0]) {
          throw new Error("No inventory for selected sku");
        }
        //check if inventory gte booked qty
        if (
          !sku.inventory[0] >= item.quantity.booked
        ) {
          throw new Error("OOS for selected territory");
        }
        //capture territory information
        item.sku.inventory = sku.inventory[0];
        item.quantity.territory =
          sku.inventory[0].territory;
        //set default status
        item.status = "Booked";
        //reduce inventory
        await inventoryService.reduceInventory({
          db: db,
          skuParam: dku,
          territory: item.quantity.territory,
          quantity: item.quantity.booked,
        });
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
        console.log(err);
        return res.status(400).json({ message: err.message });
      });
    order = await order.calculateTotals();

    return res.json({
      data: order,
      message: "Succesfully created the order",
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

async function updateOrder(req, res) {
  try {
    //get variables from request body
    var { _id, customer, orderitems, amount, payment } = req.body;
    const db = req.db;
    const orderModel = await db.model("Order");

    //get user from request
    user = req.user;

    //validate order id and order
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new Error("Invalid Order ID");
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
      if (order.orderitems[index].status !== "Cancelled") {
        //assign quantity items
        //if shipping qty not set, allow confirmed qty modification
        !item.quantity.shipped &&
          (order.orderitems[index].quantity.confirmed =
            item.quantity.confirmed);
        //if delivered qty not set allow shipping qty modification
        !item.quantity.delivered &&
          (order.orderitems[index].quantity.shipped = item.quantity.shipped);
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

    // order.payment = payment;
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
  try {

    const { searchString } = req.body;
    const db = req.db;

    const searchregex = new RegExp(searchString)

    const orderModel = await db.model("Order");

    const orders = await orderModel.aggregate([
      { $match: { shortid: { $regex: searchregex } } },
      { $limit: 5 },
      { $unwind: "$orderitems" },
      {
        $lookup: {
          from: "products",
          localField: "orderitems.sku.product",
          foreignField: "_id",
          as: "orderitems.sku.product",
        },
      },
      { $unwind: "$orderitems.sku.product" },
      {
        $group: {
          _id: "$_id",
          shortid: { $first: "$shortid" },
          orderitems: { $push: "$orderitems" },
          customer: { $first: "$customer" },
          amount: { $first: "$amount" },
          payment: { $first: "$payment" },
          createdat: { $first: "$createdat" },
        },
      },
    ]);

    return res.json({data:orders})

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
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

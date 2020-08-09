// const Customer = require("../models/customer")
// const Order = require("../models/order")

async function getCustomerCount(req, res){
  try {
    const db = req.db;
    const customerModel = await db.model("Customer");
    
    customerData = await customerModel.aggregate([
      //first stage join auth to get status
      {
        $lookup: {
          from: "auths",
          localField: "auth",
          foreignField: "_id",
          as: "auth",
        },
      },
      //second stage - unwind auth
      { $unwind: "$auth" },
      //third stage - group by auth status
      {
        $group: {
          _id: "$auth.status",
          count: { $sum: 1 },
        },
      },
    ]);
    
    res.json({ data: customerData });

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error.message})
  }
}

async function getGmvdata(req, res){
  try {
    const { filterBy } = req.query;
    const db = req.db;
    const orderModel = await db.model("Order");

    let startDate;
    let endDate;
    const today = new Date()
    today.setHours(0, 0, 0, 0);
    var tomorrow = new Date(today); //assigns todays date
    tomorrow.setDate(tomorrow.getDate()+1); //increment by 1 day

    switch (filterBy) {
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "quarter":
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      default: //default to today
        startDate = today;
        endDate = tomorrow;
        break;
    }

    gmvData = await orderModel.aggregate([
      // First Stage - match based on query params
      { $match: { createdat: { $gte: startDate, $lte: endDate } } },
      //second stage
      { $unwind: "$amount" },
      //third stage - get sum of amount for period and customer
      {
        $group: {
          _id: "$customer.customer",
          total: { $sum: "$amount.totalamount" },
        },
      },
      //third stage - get sum & count of amount for period
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          customers: { $sum: 1 },
        },
      },
    ]);
    
    res.json({data:gmvData})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error.message})
  }
}

async function getGmvTimeSeries(req, res){
  try {
    const db = req.db;
    const orderModel = await db.model("Order");
    
    monthGmv = await orderModel.aggregate([
      // FIrst Stage - Group based on created at
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdat",
              format: "%Y-%m-%d",
              timezone: "Asia/Kolkata",
            },
          },
          total: { $sum: "$amount.totalamount" },
        },
      },
      // Second Stage Stage - Sort by _id (created at)
      {
        $sort: { _id: 1 },
      },
    ]);
    
    res.json({data:monthGmv})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error.message})
  }
}
async function getOrderItemDump(req, res){
  try {
    const db = req.db;
    const orderModel = await db.model("Order");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const orderitems = await orderModel.aggregate([
      { $match: { createdat: { $gte: startDate, $lte: endDate } } },
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
        $project: {
          _id: 0,
          itemorderid: "$shortid",
          orderitemid: "$orderitems.shortid",
          customerid: "$customer.customer.shortid",
          customername: {
            $concat: [
              "$customer.customer.firstname",
              " ",
              "$customer.customer.lastname",
            ],
          },
          skuid: "$orderitems.sku.shortid",
          skuname: {
            $concat: [
              "$orderitems.sku.product.name",
              " - ",
              "$orderitems.sku.name",
            ],
          },
          skucategoryid: "$orderitems.sku.product.category",
          skubrandid: "$orderitems.sku.product.brand",
          skumrp: "$orderitems.sku.price.mrp",
          skudiscount: "$orderitems.sku.price.discount",
          skusellingprice: "$orderitems.sku.price.sellingprice",
          skupurchaseprice: "$orderitems.sku.price.purchaseprice",
          skushippingcharges: "$orderitems.sku.price.shippingcharges",
          skuinstallationcharges: "$orderitems.sku.price.installationcharges",
          skubulkthreshold: "$orderitems.sku.bulkdiscount.threshold",
          skubulkdiscount: "$orderitems.sku.bulkdiscount.discount",
          skuminorderqty: "$orderitems.sku.quantityrules.minorderqty",
          skuminorderqtymultiples: "$orderitems.sku.quantityrules.minorderqtystep",
          skumaxorderqty: "$orderitems.sku.quantityrules.maxorderqty",
          itemquantitybooked: "$orderitems.quantity.booked",
          itemquantityconfirmed: "$orderitems.quantity.confirmed",
          itemquantityshipped: "$orderitems.quantity.shipped",
          itemquantitydelivered: "$orderitems.quantity.delivered",
          itemquantityreturned: "$orderitems.quantity.returned",
          itemterritoryid: "$orderitems.quantity.territory",
          itemamount: "$orderitems.amount.amount",
          itemdiscount: "$orderitems.amount.discount",
          itemtotalamount: "$orderitems.amount.totalamount",
          itemstatus: "$orderitems.status",
          itemorderdate: "$orderitems.orderdate",
        },
      },
    ]);

    res.json({data:orderitems})

  } catch (error) {
    console.log(error);
    res.status(400).json({error:error.message})
  }
}
async function getCustomerDump(req, res){
  try {
    const db = req.db;
    const customerModel = await db.model("Customer");

    const customers = await customerModel.aggregate([
      {
        $lookup: {
          from: "auths",
          localField: "auth",
          foreignField: "_id",
          as: "auth",
        },
      },
      { $unwind: "$auth" },
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "account",
        },
      },
      { $unwind: "$account" },
      {
        $project: {
          _id: 0,
          customerid: "$shortid",
          accountid: "$account._id",
          firstname: "$firstname",
          lastname: "$lastname",
          accountname: "$account.name",
          username: "$auth.username",
          email: "$auth.email",
          mobilenumber: "$auth.mobilenumber",
          type: "$type",
          gender: "$gender",
          birthday: "$birthday",
          contactnumber: "$contactnumber",
          accounttype: "$account.type",
          gstin: "$account.gstin",
          status: "$auth.status",
          createdat: "$createdat",
        },
      },
    ]);

    res.json({ data: customers });

  } catch (error) {
    console.log(error);
    res.status(400).json({error:error.message})
  }
}

async function getInventoryDump(req, res) {
  try {
    const db = req.db;
    const skuModel = await db.model("Sku");

    const skus = await skuModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "product.category",
        },
      },
      { $unwind: "$product.category" },
      {
        $lookup: {
          from: "brands",
          localField: "product.brand",
          foreignField: "_id",
          as: "product.brand",
        },
      },
      {
        $unwind: { path: "$product.brand", preserveNullAndEmptyArrays: true },
      },
      { $unwind: "$inventory" },
      {
        $lookup: {
          from: "territories",
          localField: "inventory.territory",
          foreignField: "_id",
          as: "inventory.territory",
        },
      },
      { $unwind: "$inventory.territory" },
      {
        $group: {
          _id: "$inventory._id",
          productid: { $first: "$product.shortid" },
          productname: { $first: "$product.name" },
          skuid: { $first: "$shortid" },
          skuname: { $first: "$name" },
          categoryname: { $first: "$product.category.name" },
          brandname: { $first: "$product.brand.name" },
          territoryid: { $first: "$inventory.territory._id" },
          territoryname: { $first: "$inventory.territory.name" },
          quantity: { $first: "$inventory.quantity" },
          mrp: { $first: "$inventory.mrp" },
          purchaseprice: { $first: "$inventory.purchaseprice" },
          sellingprice: { $first: "$inventory.sellingprice" },
          discount: { $first: "$inventory.discount" },
          shippingcharges: { $first: "$inventory.shippingcharges" },
          installationcharges: { $first: "$inventory.installationcharges" },
          status: { $first: "$inventory.status" },
        },
      },
    ]);

    res.json({ data: skus });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getCustomerCount,
  getGmvdata,
  getGmvTimeSeries,
  getOrderItemDump,
  getCustomerDump,
  getInventoryDump,
};
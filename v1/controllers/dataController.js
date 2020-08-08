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
      // First Stage - match based on query params
      // {
      //   $match: {
      //     date: {
      //       $gte: new ISODate("2014-01-01"),
      //       $lt: new ISODate("2015-01-01"),
      //     },
      //   },
      // },
      // Second Stage - Group based on created at
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
      // Third Stage - Sort by _id (created at)
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
async function orderItemDataDump(req, res){
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
          orderid: "$shortid",
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
          categoryid: "$orderitems.sku.product.category",
          brandid: "$orderitems.sku.product.brand",
          mrp: "$orderitems.sku.price.mrp",
          discount: "$orderitems.sku.price.discount",
          sellingprice: "$orderitems.sku.price.sellingprice",
          purchaseprice: "$orderitems.sku.price.purchaseprice",
          shippingcharges: "$orderitems.sku.price.shippingcharges",
          installationcharges: "$orderitems.sku.price.installationcharges",
          bulkthreshold: "$orderitems.sku.bulkdiscount.threshold",
          bulkdiscount: "$orderitems.sku.bulkdiscount.discount",
          minorderqty: "$orderitems.sku.quantityrules.minorderqty",
          minorderqtymultiples: "$orderitems.sku.quantityrules.minorderqtystep",
          maxorderqty: "$orderitems.sku.quantityrules.maxorderqty",
          quantitybooked: "$orderitems.quantity.booked",
          quantityconfirmed: "$orderitems.quantity.confirmed",
          quantityshipped: "$orderitems.quantity.shipped",
          quantitydelivered: "$orderitems.quantity.delivered",
          quantityreturned: "$orderitems.quantity.returned",
          territoryid: "$orderitems.quantity.territory",
          amount: "$orderitems.amount.amount",
          discount: "$orderitems.amount.discount",
          totalamount: "$orderitems.amount.totalamount",
          status: "$orderitems.status",
          orderdate: "$orderitems.orderdate",
        },
      },
    ]);

    res.json({data:orderitems})

  } catch (error) {
    console.log(error);
    res.status(400).json({error:error.message})
  }
}
async function customerDataDump(req, res){
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
          customerid: "shortid",
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

module.exports = {
  getCustomerCount,
  getGmvdata,
  getGmvTimeSeries,
  orderItemDataDump,
  customerDataDump,
};
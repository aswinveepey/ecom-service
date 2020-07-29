const customerModel = require("../models/customer")
const orderModel = require("../models/order")
const authModel = require("../models/auth")

async function getCustomerCount(req, res){
  try {
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
    res.status(400).json({message:error})
  }
}

async function getGmvdata(req, res){
  try {
    const {filterBy} = req.query

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
    res.status(400).json({message:error})
  }
}

async function getGmvTimeSeries(req, res){
  try {
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
    res.status(400).json({message:error})
  }
}

module.exports = {
  getCustomerCount,
  getGmvdata,
  getGmvTimeSeries,
};
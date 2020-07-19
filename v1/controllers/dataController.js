const customerModel = require("../models/customer")
const orderModel = require("../models/order")
const authModel = require("../models/auth")

async function getCustomerCount(req, res){
  try {
    // customers = await customerModel.find().populate("auth", null, {status:true}, ).lean()
    // activeCustomers = customers.filter(customer=>customer.auth)
    customerData = await customerModel.aggregate([
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

async function getCurrentGMV(req, res){
  try {
    const date = new Date()
    const monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEndDate = new Date(date.getFullYear(), date.getMonth()+1, 0)
    monthGmv = await orderModel.aggregate([
      { $match: { createdat: { $gte: monthStartDate, $lte: monthEndDate } } },
      { $unwind: "$amount" },
      { $group: { _id: null, total: { $sum: "$amount.totalamount" } } },
    ]);
    res.json({data:monthGmv})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:error})
  }
}

async function getQuarterGMV(req, res){
  try {
    const date = new Date()
    const monthStartDate = new Date(date.getFullYear(), date.getMonth()-3, 1)
    const monthEndDate = new Date(date.getFullYear(), date.getMonth()+1, 0)
    console.log(monthStartDate+":"+monthEndDate)
    monthGmv = await orderModel.aggregate([
      {$match:{createdat:{$gte:monthStartDate, $lte:monthEndDate}}},
      { $unwind: "$amount" },
      { $group: { _id: null, total: { $sum: "$amount.totalamount" } } },
    ]);
    res.json({data:monthGmv})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:error})
  }
}
async function getMonthlyGMV(req, res){
  try {
    monthGmv = await orderModel.aggregate([
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
  getCurrentGMV,
  getQuarterGMV,
  getMonthlyGMV,
};
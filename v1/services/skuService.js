const orderModel = require("../models/order");

//return top 15 skus ids for the current month
async function getTopOrderedSkus(){
  let endDate = new Date();
  let startDate =  new Date()
  startDate.setDate(startDate.getDate()-30)
  skus = await orderModel.aggregate([
    //stage 1 - get order data for current month
    {
      $match: {
        createdat: { $gte: startDate, $lte: endDate },
      },
    },
    //stage 2 - unwind order items
    { $unwind: "$orderitems" },
    //stage 2 - group by ids & get total
    {
      $group: {
        _id: "$orderitems.sku._id",
        total: { $sum: 1 },
      },
    },
    //stage 2 - sort by total descending
    {
      $sort: {
        total: 1,
      },
    },
    //get top 15 skus
    {
      $limit: 15,
    },
    //select IDs
    {
      $project: {
        _id: 1,
      },
    },
  ]);
  //return ids as array
  return skus.map(item=>item._id)
}

module.exports = { getTopOrderedSkus };
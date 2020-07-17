const customerModel = require("../models/customer")

async function getCustomerData(req, res){
  try {
    customerData = {}
    customerData.customercount = await customerModel.count({
      'auth.status': true,
    });
    res.json({ data: customerData });
  } catch (error) {
    console.log(error)
    res.status(400).json({message:error})
  }
}

module.exports = { getCustomerData };
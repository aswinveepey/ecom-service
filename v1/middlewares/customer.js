// const Customer = require("../models/customer");

const customer = async (req, res, next) => {
  try {
    const auth_id = req.auth?._id;
    
    //get db connection object from req
    const db = req.db;
    const customerModel = await db.model("Customer");

    //get customer and append to req object
    const customer = await customerModel.findOne({ auth: auth_id });
    req.customer = customer;
    next();

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { customer };

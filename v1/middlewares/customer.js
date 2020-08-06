const Customer = require("../models/customer");

const customer = async (req, res, next) => {
  try {
    const auth_id = req.auth?._id;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const customerModel = await db.model("Customer");
    const customer = await customerModel.findOne({ auth: auth_id });
    req.customer = customer;
    next();
  } catch (error) {
    res.status(400).send({ message: "Error while retrieving customer" });
  }
};

module.exports = { customer };

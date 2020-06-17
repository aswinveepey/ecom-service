const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");

customerRouter.get("/", customerController.getAllCustomers);
customerRouter.get("/id/:customerId", customerController.getOneCustomers);
customerRouter.post("/", customerController.createCustomer);
// customerRouter.post("/id/:customerId", customerController.updateOneCustomer);

module.exports = { customerRouter };

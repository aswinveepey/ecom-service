const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");
const { user } = require("../middlewares/user");

customerRouter.get("/", user, customerController.getAllCustomers);
customerRouter.get("/id/:customerId", customerController.getOneCustomer);
customerRouter.post("/", customerController.createCustomer);
customerRouter.post("/id/:customerId", customerController.updateCustomer);

module.exports = { customerRouter };

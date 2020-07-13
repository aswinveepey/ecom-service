const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");
const { user } = require("../middlewares/user");

//user accessed routes
customerRouter.get("/", user, customerController.getAllCustomers);
customerRouter.get("/id/:customerId", user, customerController.getOneCustomer);
customerRouter.post("/", user, customerController.createCustomer);
customerRouter.post("/id/:customerId", user, customerController.updateCustomer);
customerRouter.post("/search", user, customerController.searchCustomer);

//self accessed routes
customerRouter.get("/self", customerController.getSelf);
customerRouter.post("/self", customerController.selfUpdateCustomer);
customerRouter.post("/register", customerController.registerCustomer);

module.exports = { customerRouter };

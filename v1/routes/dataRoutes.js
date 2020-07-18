const express = require("express");
const dataRouter = express.Router();
const dataController = require("../controllers/dataController");
const { user } = require("../middlewares/user");

dataRouter.get("/customer", user, dataController.getCustomerCount);
dataRouter.get("/currentGmv", user, dataController.getCurrentGMV);
dataRouter.get("/quarterGmv", user, dataController.getQuarterGMV);
dataRouter.get("/monthlyGmv", user, dataController.getMonthlyGMV);

module.exports = { dataRouter };
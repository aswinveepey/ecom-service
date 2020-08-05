const express = require("express");
const dataRouter = express.Router();
const dataController = require("../controllers/dataController");
const { user } = require("../middlewares/user");

dataRouter.get("/customer", user, dataController.getCustomerCount);
dataRouter.get("/gmvData", user, dataController.getGmvdata);
dataRouter.get("/gmvTimeSeries", user, dataController.getGmvTimeSeries);
dataRouter.get("/getOrderItemDump", user, dataController.orderItemDataDump);
dataRouter.get("/getCustomerDump", user, dataController.customerDataDump);

module.exports = { dataRouter };
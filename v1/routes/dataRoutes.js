const express = require("express");
const dataRouter = express.Router();
const dataController = require("../controllers/dataController");
const bulkuploadController = require("../controllers/bulkuploadController");
const { user } = require("../middlewares/user");

dataRouter.get("/customer", user, dataController.getCustomerCount);
dataRouter.get("/gmvData", user, dataController.getGmvdata);
dataRouter.get("/gmvTimeSeries", user, dataController.getGmvTimeSeries);
dataRouter.get("/getOrderItemDump", user, dataController.getOrderItemDump);
dataRouter.get("/getCustomerDump", user, dataController.getCustomerDump);
dataRouter.get("/getInventoryDump", user, dataController.getInventoryDump);
dataRouter.post("/bulkUploadInventory", user, bulkuploadController.bulkUploadInventory);

module.exports = { dataRouter };
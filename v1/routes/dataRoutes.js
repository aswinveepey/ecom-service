const express = require("express");
const dataRouter = express.Router();
const dataController = require("../controllers/dataController");
const bulkdownloadController = require("../controllers/bulkDownloadController");
const bulkuploadController = require("../controllers/bulkuploadController");
const { user } = require("../middlewares/user");
const {
  validateInventoryBulkUpload,
  validateSkuBulkUpload,
} = require("../validators/bulkUploadValidator");
const { validate } = require("../validators/validator");

dataRouter.get("/customer", user, dataController.getCustomerCount);
dataRouter.get("/gmvData", user, dataController.getGmvdata);
dataRouter.get("/gmvTimeSeries", user, dataController.getGmvTimeSeries);
dataRouter.get(
  "/getOrderItemDump",
  user,
  bulkdownloadController.getOrderItemDump
);
dataRouter.get(
  "/getCustomerDump",
  user,
  bulkdownloadController.getCustomerDump
);
dataRouter.get(
  "/getInventoryDump",
  user,
  bulkdownloadController.getInventoryDump
);
dataRouter.get("/getSkuDump", user, bulkdownloadController.getSkuDump);
dataRouter.get("/getProductDump", user, bulkdownloadController.getProductDump);
dataRouter.post(
  "/bulkUploadInventory",
  user,
  validate(validateInventoryBulkUpload),
  bulkuploadController.bulkUploadInventory
);
dataRouter.post(
  "/bulkUploadSku",
  user,
  validate(validateSkuBulkUpload),
  bulkuploadController.bulkUploadSku
);

module.exports = { dataRouter };

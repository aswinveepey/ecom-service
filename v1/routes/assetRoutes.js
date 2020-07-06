const express = require("express");
const assetRouter = express.Router();
const assetController = require("../controllers/assetController");

assetRouter.post("/generatePutUrl", assetController.generatePutUrl);

module.exports = { assetRouter };
const express = require("express");
const skuRouter = express.Router();
const skuController = require("../controllers/skuController");
const { user } = require("../middlewares/user");

skuRouter.get("/", skuController.getSkus);
skuRouter.get("/id/:skuId", skuController.getOneSku);
skuRouter.get("/id/web/:skuId", skuController.getSku);
skuRouter.post("/", user, skuController.createSku);
skuRouter.post("/id/:skuId", user, skuController.updateSku);
skuRouter.post("/search", skuController.searchSku);

module.exports = { skuRouter };

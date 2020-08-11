const express = require("express");
const skuRouter = express.Router();
const skuController = require("../controllers/skuController");
const { user } = require("../middlewares/user");
const { validateSku } = require("../validators/skuValidator");
const { validate } = require("../validators/validator");

skuRouter.get("/", skuController.getSkus);
skuRouter.get("/id/:skuId", skuController.getOneSku);
skuRouter.get("/id/web/:skuId", skuController.getSku);
skuRouter.post("/", user, validate(validateSku), skuController.createSku);
skuRouter.post("/id/:skuId", user, validate(validateSku), skuController.updateSku);
skuRouter.post("/search", skuController.searchSku);

module.exports = { skuRouter };

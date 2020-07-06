const express = require("express");
const brandRouter = express.Router();
const brandController = require("../controllers/brandController");
const { user } = require("../middlewares/user");

brandRouter.get("/", brandController.getAllBrands);
brandRouter.get("/id/:userId", brandController.getOneBrand);
brandRouter.post("/", user, brandController.createBrand);
brandRouter.post("/id/:userId", user, brandController.updateBrand);
brandRouter.post("/search", brandController.searchBrand);

module.exports = { brandRouter };

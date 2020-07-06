const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const { user } = require("../middlewares/user");

productRouter.get("/", productController.getAllProducts);
productRouter.get("/id/:userId", productController.getOneProduct);
productRouter.post("/", user, productController.createProduct);
productRouter.post("/id/:userId", user, productController.updateProduct);
productRouter.post("/search", productController.searchProduct);

module.exports = { productRouter };

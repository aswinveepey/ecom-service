const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const { user } = require("../middlewares/user");

productRouter.get("/", productController.getAllProducts);
productRouter.get("/id/:productId", productController.getOneProduct);
productRouter.post("/", user, productController.createProduct);
productRouter.post("/id/:productId", user, productController.updateProduct);
productRouter.post("/search", productController.searchProduct);

module.exports = { productRouter };

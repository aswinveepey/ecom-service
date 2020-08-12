const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const { user } = require("../middlewares/user");
const { validateProduct } = require("../validators/productValidator");
const { validate } = require("../validators/validator");

productRouter.get("/", productController.getAllProducts);
productRouter.get("/id/:productId", productController.getOneProduct);
productRouter.post(
  "/",
  user,
  validate(validateProduct),
  productController.createProduct
);
productRouter.post(
  "/id/:productId",
  user,
  validate(validateProduct),
  productController.updateProduct
);
productRouter.post("/search", productController.searchProduct);

module.exports = { productRouter };

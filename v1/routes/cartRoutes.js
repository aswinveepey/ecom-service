const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cartController");
const { validateAddToCart } = require("../validators/cartValidator");
const { validate } = require("../validators/validator");
// const { user } = require("../middlewares/user");

cartRouter.post("/addtoCart", validate(validateAddToCart), cartController.addtoCart);
cartRouter.post("/checkout", cartController.checkout);
cartRouter.get("/self", cartController.getSelfCart);

module.exports = { cartRouter };

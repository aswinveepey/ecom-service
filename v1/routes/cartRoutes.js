const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cartController");
// const { user } = require("../middlewares/user");

cartRouter.post("/addtoCart", cartController.addtoCart);
cartRouter.post("/checkout", cartController.checkout);
cartRouter.get("/self", cartController.getSelfCart);

module.exports = { cartRouter };

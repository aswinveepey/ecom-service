const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cartController");
// const { user } = require("../middlewares/user");

cartRouter.post("/addtoCart", cartController.addtoCart);

module.exports = { cartRouter };

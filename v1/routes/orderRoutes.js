const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controllers/orderController");
const { user } = require("../middlewares/user");

orderRouter.get("/", orderController.getAllOrders);
orderRouter.get("/id/:orderId", orderController.getOneOrder);
orderRouter.post("/", user, orderController.createOrder);
// orderRouter.post("/id/:orderId", user, orderController.updateOrder);
orderRouter.post("/search", orderController.searchOrder);

module.exports = { orderRouter };

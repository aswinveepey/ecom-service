const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controllers/orderController");
const { user } = require("../middlewares/user");

orderRouter.get("/", user, orderController.getAllOrders);
orderRouter.get("/id/:orderId", orderController.getOneOrder);
orderRouter.get("/getHistory", orderController.customerOrderhistory);
orderRouter.post("/", user, orderController.createOrder);
orderRouter.post("/id/:orderId", user, orderController.updateOrder);
orderRouter.post("/search", user, orderController.searchOrder);

module.exports = { orderRouter };
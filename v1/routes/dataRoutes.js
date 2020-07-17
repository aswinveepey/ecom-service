const express = require("express");
const dataRouter = express.Router();
const dataController = require("../controllers/dataController");
const { user } = require("../middlewares/user");

dataRouter.get("/customer", user, dataController.getCustomerData);

module.exports = { dataRouter };
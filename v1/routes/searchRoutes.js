const express = require("express");
const searchRouter = express.Router();
const userController = require("../controllers/userController");

searchRouter.post("/user", userController.searchUser);

module.exports = { searchRouter };

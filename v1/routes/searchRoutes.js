const express = require("express");
const searchRouter = express.Router();
const userController = require("../controllers/userController");
const searchController = require("../controllers/searchController");

searchRouter.post("/user", userController.searchUser);
searchRouter.post("/global", searchController.globalSearch);

module.exports = { searchRouter };

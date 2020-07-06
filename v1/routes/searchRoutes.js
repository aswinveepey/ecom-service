const express = require("express");
const searchRouter = express.Router();
const userController = require("../controllers/userController");
const searchController = require("../controllers/searchController");
const { user } = require("../middlewares/user");

searchRouter.post("/user", userController.searchUser);
searchRouter.post("/global", user, searchController.globalSearch);

module.exports = { searchRouter };

const express = require("express");
const searchRouter = express.Router();
const searchController = require("../controllers/searchController");
const { user } = require("../middlewares/user");

searchRouter.post("/", searchController.search);

module.exports = { searchRouter };

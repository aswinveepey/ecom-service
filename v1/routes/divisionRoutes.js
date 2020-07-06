const express = require("express");
const divisionRouter = express.Router();
const divisionController = require("../controllers/divisionController");
const { user } = require("../middlewares/user");

divisionRouter.get("/", user, divisionController.getDivisions);
divisionRouter.post("/", user, divisionController.createDivision);

module.exports = { divisionRouter };

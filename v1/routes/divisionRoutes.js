const express = require("express");
const divisionRouter = express.Router();
const divisionController = require("../controllers/divisionController");

divisionRouter.get("/", divisionController.getDivisions);
divisionRouter.post("/", divisionController.createDivision);

module.exports = { divisionRouter };

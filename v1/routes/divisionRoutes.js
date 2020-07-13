const express = require("express");
const divisionRouter = express.Router();
const divisionController = require("../controllers/divisionController");
const { user } = require("../middlewares/user");

divisionRouter.get("/", divisionController.getDivisions);
divisionRouter.get("/id/:divisionId", divisionController.getOneDivision);
divisionRouter.post("/", user, divisionController.createDivision);
divisionRouter.post("/id/:divisionId", user, divisionController.updateDivision);
divisionRouter.post("/search", divisionController.searchDivision);

module.exports = { divisionRouter };

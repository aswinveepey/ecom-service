const express = require("express");
const territoryRouter = express.Router();
const territoryController = require("../controllers/territoryController");

territoryRouter.get("/", territoryController.getTerritories);
territoryRouter.post("/", territoryController.createTerritory);

module.exports = { territoryRouter };

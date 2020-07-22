const express = require("express");
const territoryRouter = express.Router();
const territoryController = require("../controllers/territoryController");
const { user } = require("../middlewares/user");

territoryRouter.get("/", user, territoryController.getTerritories);
territoryRouter.post("/", user, territoryController.createTerritory);
territoryRouter.post("/id/:territoryId", user, territoryController.updateTerritory);
territoryRouter.post("/search", user, territoryController.searchTerritory);

module.exports = { territoryRouter };

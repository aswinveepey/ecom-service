const express = require("express");
const territoryRouter = express.Router();
const territoryController = require("../controllers/territoryController");
const { user } = require("../middlewares/user");
const { admin } = require("../middlewares/role");

territoryRouter.get("/", user, territoryController.getTerritories);
territoryRouter.get("/id/:territoryId", user, territoryController.getOneTerritory);
territoryRouter.post("/", user, admin, territoryController.createTerritory);
territoryRouter.post("/id/:territoryId", user, admin, territoryController.updateTerritory);
territoryRouter.post("/search", user, territoryController.searchTerritory);

module.exports = { territoryRouter };

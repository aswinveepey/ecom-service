const express = require("express");
const collectionRouter = express.Router();
const collectionController = require("../controllers/collectionController");
const { user } = require("../middlewares/user");

collectionRouter.get("/", collectionController.getCollections);
collectionRouter.get("/id/:collectionId", collectionController.getOneCollection);
collectionRouter.post("/", user, collectionController.createCollection);
collectionRouter.post("/id/:territoryId", user, collectionController.updateCollection);
collectionRouter.post("/search", user, collectionController.searchCollection);

module.exports = { collectionRouter };

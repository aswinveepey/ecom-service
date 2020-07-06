const express = require("express");
const accountRouter = express.Router();
const accountController = require("../controllers/accountController");
const { user } = require("../middlewares/user");

accountRouter.get("/", user, accountController.getAllAccounts);
accountRouter.get("/id/:accountId", user, accountController.getOneAccount);
accountRouter.post("/", user, accountController.createAccount);
accountRouter.post("/search", user, accountController.searchAccount);
accountRouter.post("/id/:accountId", user, accountController.updateAccount);

module.exports = { accountRouter };

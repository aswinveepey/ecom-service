const express = require("express");
const accountRouter = express.Router();
const accountController = require("../controllers/accountController");

accountRouter.get("/", accountController.getAllAccounts);
accountRouter.get("/id/:accountId", accountController.getOneAccount);
accountRouter.post("/", accountController.createAccount);
accountRouter.post("/search", accountController.searchAccount);
accountRouter.post("/id/:accountId", accountController.updateAccount);

module.exports = { accountRouter };

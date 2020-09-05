const express = require("express");
const leadRouter = express.Router();
const leadController = require("../controllers/leadController");
const { user } = require("../middlewares/user");

//user accessed routes
leadRouter.get("/", user, leadController.getAllLeads);
leadRouter.post("/", user, leadController.createLead);


module.exports = { leadRouter };

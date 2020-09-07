const express = require("express");
const leadRouter = express.Router();
const leadController = require("../controllers/leadController");
const { user } = require("../middlewares/user");

//user accessed routes
leadRouter.get("/", user, leadController.getAllLeads);
leadRouter.get("/id/:leadId", user, leadController.getOneLead);
leadRouter.post("/", user, leadController.createLead);
leadRouter.post("/id/:leadId", user, leadController.updateLead);
leadRouter.post("/search", user, leadController.searchLead);


module.exports = { leadRouter };

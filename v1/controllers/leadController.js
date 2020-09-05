// const Role = require('../models/roles')
// const permissionModel = require('../models/permission')

async function getAllLeads(req, res) {
  try {
    const db = req.db;
    const leadModel = await db.model("Lead");

    const leads = await leadModel.find().populate("account").lean();
    return res.json({ data: leads });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createLead(req, res) {
  try {

    //get variables from req body
    var {
      firstname,
      lastname,
      type,
      account,
      mobile,
      address,
      gst,
      score,
      source,
    } = req.body;

    //db model
    const db = req.db;
    const leadModel = await db.model("Lead");

    lead = await leadModel.create({
      firstname: firstname,
      lastname: lastname,
      type: type,
      account: account,
      mobile: mobile,
      address: address,
      gst: gst,
      score: score,
      source: source,
    });
    
    return res.json({ lead: lead, message: "Lead Added Succesfully" });

  } catch (error) {

    return res.status(400).json({ error: error.message });

  }
}

module.exports = { getAllLeads, createLead };

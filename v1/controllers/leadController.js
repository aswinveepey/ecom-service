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

async function getOneLead(req, res) {
  try {
    var { leadId } = req.params;
    const db = req.db;
    const leadModel = await db.model("Lead");

    if(!leadId) throw new Error("Lead ID is Required to carry out the operation");

    lead = await leadModel
      .findById(leadId)
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .lean();
    return res.json({ data: lead });
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

    if (account && !mongoose.Types.ObjectId.isValid(account._id)) {
      throw new Error("Invalid Account ID");
    }

    lead = await leadModel.create({
      firstname: firstname,
      lastname: lastname,
      type: type,
      account: account._id,
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

async function updateLead(req, res) {
  try {
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
    const db = req.db;
    const leadModel = await db.model("Lead");

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid Lead ID");
    }

    if (account && !mongoose.Types.ObjectId.isValid(account._id)) {
      throw new Error("Invalid Account ID");
    }

    lead = await leadModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          firstname: firstname,
          lastname: lastname,
          type: type,
          account: account._id,
          mobile: mobile,
          address: address,
          gst: gst,
          score: score,
          source: source,
          updatedat: Date.now(),
        },
      },
      { new: true }
    );

    return res.json({
      data: lead,
      message: "Lead Successfully Updated",
    });
  
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function searchLead(req, res) {
  try {
    const { searchString } = req.body;
    const db = req.db;
    const leadModel = await db.model("Lead");

    const leads = await leadModel.aggregate([
      { $match: { $text: { $search: searchString } } },
      { $limit: 5 },
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "account",
        },
      },
      { $unwind: { path: "$account", preserveNullAndEmptyArrays: true } },
    ]);
    return res.json({ data: leads });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { getAllLeads, createLead, getOneLead, updateLead, searchLead };

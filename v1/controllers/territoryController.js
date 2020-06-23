const territoryModel = require("../models/territory");
// const permissionModel = require('../models/permission')

async function getTerritories(req, res) {
  const territories = await territoryModel.find().populate("pincode").lean();
  res.json({ data: territories });
}

async function createTerritory(req, res) {
  try {
    const { name, pincodes } = req.body;
    territory = new territoryModel({ name: name });
    territory.save();
    pincodes.forEach((element) => {
      // permissionsObj = PermissionModel.findOne({ id: element.id });
      territory.pincodes.push(element.id);
      territory.save();
    });
    res.json({ message: "Territory Added Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
}

module.exports = { getTerritories, createTerritory };

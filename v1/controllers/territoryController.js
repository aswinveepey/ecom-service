const territoryModel = require("../models/territory");
// const permissionModel = require('../models/permission')

async function getTerritories(req, res) {
  const territories = await territoryModel.find().lean();
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

async function searchTerritory(req, res) {
  const { searchString } = req.body;
  try {
    territoryModel
      .find({ $text: { $search: searchString } })
      .select("name _id")
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
          console.log(err);
          return res.status(400).json({ message: err });
        }
        return res.json({ data: docs });
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

module.exports = { getTerritories, createTerritory, searchTerritory };

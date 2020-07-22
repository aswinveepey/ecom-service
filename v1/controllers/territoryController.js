const territoryModel = require("../models/territory");
const mongoose = require("mongoose");

async function getTerritories(req, res) {
  const territories = await territoryModel.find().lean();
  res.json({ data: territories });
}

async function getOneTerritory(req, res) {
  const { territoryId } = req.params;
  const territory = await territoryModel.findById(territoryId).lean();
  res.json({ data: territory });
}

async function createTerritory(req, res) {
  try {
    const { name, pincodes } = req.body;
    territory = new territoryModel({ name: name, status:true });
    await territory.save();
    await pincodes.forEach((element) => {
      // permissionsObj = PermissionModel.findOne({ id: element.id });
      territory.pincodes.push(element.id);
    });
    await territory.save();
    res.json({ message: "Territory Added Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
}
async function updateTerritory(req, res) {
  try {
    const { _id, name, pincodes, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Territory ID" });
    }
    territory = await territoryModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          status: status,
          updatedat: Date.now(),
        },
        $addToSet:{
          pincodes:pincodes
        }
      },
      { new: true }
    );
    // await pincodes?.forEach((element) => {
    //   // permissionsObj = PermissionModel.findOne({ id: element.id });
    //   (element.length>0) && territory.pincodes.push(element);
    // });
    // territory.save();
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

module.exports = {
  getTerritories,
  createTerritory,
  searchTerritory,
  getOneTerritory,
  updateTerritory,
};

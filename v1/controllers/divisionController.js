const mongoose = require("mongoose");
const divisionModel = require('../models/division')

async function getDivisions(req, res){
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const divModel = await db.model("Division");
    const divisions = await divModel
      .find()
      .populate("categories")
      .lean()
      .limit(100);
    return res.json({ data: divisions });
  } catch (error) {
    return res.status(400).json({error:error.message})
  }
}
async function getOneDivision(req, res){
  try {
    const { divisionId } = req.params;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const divModel = await db.model("Division");
    division = await divModel
      .findById(divisionId)
      .populate("categories")
      .lean();
    return res.json({ data: division });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function createDivision(req, res) {
  try {
    const { name, categories } = req.body;
    const { divisionId } = req.params;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const divModel = await db.model("Division");
    division = new divModel({ name: name });
    division.save();
    categories.forEach(category => {
      division.categories.push(category);
      division.save();
    });
    res.json({ message: "Division Added Succesfully" });
  } catch (error) {
    res.status(400).json({ error: error });
  }

}

async function updateDivision(req, res) {
  try {
    var { _id, name, categories, assets } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Division ID" });
    }
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const divModel = await db.model("Division");
    division = await divModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          categories: categories,
          assets: assets,
          updatedat: Date.now(),
        },
      },
      { new: true }
    );
    return res.json(division);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function searchDivision(req, res) {
  try {
    const { searchString } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const divModel = await db.model("Division");
    divModel
      .find({ $text: { $search: searchString } })
      .populate("categories")
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
  getDivisions,
  createDivision,
  getOneDivision,
  updateDivision,
  searchDivision,
};
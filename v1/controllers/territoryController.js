const Territory = require("../models/territory");
const mongoose = require("mongoose");

async function getTerritories(req, res) {
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const territoryModel = await db.model("Territory");
    const territories = await territoryModel.find().lean();
    return res.json({ data: territories }); 
  } catch (error) {
    return res.json({ error: error.message }); 
  }
}

async function getOneTerritory(req, res) {
  const { territoryId } = req.params;
  const { tenantId } = req.query;
  const dbConnection = await global.clientConnection;
  const db = await dbConnection.useDb(tenantId);
  const territoryModel = await db.model("Territory");
  const territory = await territoryModel.findById(territoryId).lean();
  res.json({ data: territory });
}

async function createTerritory(req, res) {
  try {
    const { name, pincodes } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const territoryModel = await db.model("Territory");
    territory = new territoryModel({ name: name, status: true });
    territory = await territory.save();
    territory = await territoryModel.update(
      { _id: territory._id },
      { $addToSet: { pincodes: pincodes } }
    );
    res.json({ message: "Territory Added Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
}
async function updateTerritory(req, res) {
  try {
    const { _id, name, pincodes, status } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const territoryModel = await db.model("Territory");
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
        $addToSet: {
          pincodes: pincodes,
        },
      },
      { new: true }
    );
    res.json({ message: "Territory Added Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
}

async function searchTerritory(req, res) {
  try {
    const { searchString } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const territoryModel = await db.model("Territory");

    const territories = await territoryModel.aggregate([
      { $match: { $text: { $search: searchString } } },
      { $limit: 5 },
    ]);

    return res.json({data:territories})
    
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

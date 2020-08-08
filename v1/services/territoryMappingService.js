// const territory = require("../models/territory")

//return territories corresponding to pincode. If not throw error
async function mapPincodeToTerritory({ db, pincode }) {
  //get model
  const territoryModel = await db.model("Territory");

  //get filtered territories
  territories = await territoryModel.aggregate([
    {
      $match: {
        $and: [
          { status: true },
          { $or: [{ name: "default" }, { pincodes: pincode }] },
        ],
      },
    },
    { $project: { _id: 1 } },
  ]);

  //validate servicability of territory
  if (territories.length === 0) {
    throw new Error("Selected Address is not servicable");
  } else {
    return territories;
  }
}

module.exports = { mapPincodeToTerritory };
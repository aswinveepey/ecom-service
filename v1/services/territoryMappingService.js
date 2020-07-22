const territory = require("../models/territory")

//return territories corresponding to pincode. If not throw error
async function mapPincodeToTerritory(pincode){
  territories = await territory.aggregate([
    { $match: { $or: [{ name: "Default" }, { pincodes: pincode }] } },
  ]);
  if (territories.length===0){
    throw new Error("Selected Address is not servicable");
  } else {
    return territories
  }
}

module.exports = { mapPincodeToTerritory };
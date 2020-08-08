// const Territory = require("../models/territory");
const territoryMappingService = require("../services/territoryMappingService")

//assumption is that with every 
const territory = async (req, res, next) => {
  try {
    const { pincode } = req.query;
    const db = req.db

    const territories = await territoryMappingService.mapPincodeToTerritory({db:db, pincode:pincode});
    req.territories = territories;

    next();

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { territory };

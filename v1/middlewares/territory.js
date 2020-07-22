const Territory = require("../models/territory");
const territoryMappingService = require("../services/territoryMappingService")

//assumption is that with every 
const territory = async (req, res, next) => {
  try {
    const { pincode } = req.query;
    const territories = await territoryMappingService.mapPincodeToTerritory(pincode);
    req.territories = territories;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error while retrieving territories" });
  }
};

module.exports = { territory };

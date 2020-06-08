const divisionModel = require('../models/division')

async function getDivisions(req, res){
  const divisions = await divisionModel.find().lean();
  res.send(divisions);
}

async function createDivision(req, res) {
  try {
    const { name, categories } = req.body;
    division = new divisionModel({name: name});
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

module.exports = { getDivisions, createDivision };
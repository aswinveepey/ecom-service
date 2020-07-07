const mongoose = require("mongoose");
const divisionModel = require('../models/division')

async function getDivisions(req, res){
  const divisions = await divisionModel.find().lean().limit(250);
  res.json({ data: divisions });
}
async function getOneDivision(req, res){
  try {
    const { divisionId } = req.params;
    division = await divisionModel.findById(divisionId).lean();
    return res.json({ data: division });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
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

async function updateDivision(req, res) {
  try {
    var { _id, name, categories, assets } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Division ID" });
    }
    division = await divisionModel.findByIdAndUpdate(
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
  const { searchString } = req.body;
  try {
    divisionModel
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

module.exports = {
  getDivisions,
  createDivision,
  getOneDivision,
  updateDivision,
  searchDivision,
};
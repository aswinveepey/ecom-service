const brandModel = require("../models/brand");
const mongoose = require("mongoose");

async function getAllBrands(req, res) {
  try {
    brands = await brandModel.find().lean().limit(250);
    return res.json({ data: brands });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function getOneBrand(req, res) {
  try {
    const { brandId } = req.params;
    brand = await categoryModel.findById(brandId).lean();
    return res.json({ data: brand });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function createBrand(req, res) {
  try {
    var { name, assets, manufacturer } = req.body;
    brand = await brandModel.create({
      name: name,
      manufacturer: manufacturer,
      assets: assets,
    });
    return res.json({ data: brand });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function updateBrand(req, res) {
  try {
    var { _id, name, manufacturer, assets } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Brand ID" });
    }
    brand = await brandModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          manufacturer: manufacturer,
          assets: assets,
          updatedat: Date.now(),
        },
      },
      { new: true }
    );
    return res.json({ data: brand });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function searchBrand(req, res) {
  const { searchString } = req.body;
  try {
    brandModel
      .find({ $text: { $search: searchString } })
      .select("name _id")
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
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
  getAllBrands,
  createBrand,
  getOneBrand,
  updateBrand,
  searchBrand,
};

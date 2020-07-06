const mongoose = require("mongoose");
const categoryModel = require("../models/category");

async function getAllCategories(req, res) {
  // console.log(req.user);
  try {
    categories = await categoryModel
      .find()
      .lean()
      .limit(250);
    return res.json({ data: categories });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function getOneCategory(req, res) {
  try {
    const { categoryId } = req.params;
    category = await categoryModel
      .findById(categoryId)
      .lean();
    return res.json({ data: category });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function createCategory(req, res) {
  try {
    var {
      name,
      filterattributes,
      assets,
    } = req.body;
    category = await categoryModel.create({
      name: name,
      filterattributes: filterattributes,
      assets: assets,
    });
    return res.json({ data: category });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function updateCategory(req, res) {
  try {
    var { _id, name, filterattributes, assets } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }
    category = await categoryModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          filterattributes: filterattributes,
          assets: assets,
          updatedat: Date.now()
        },
      },
      { new: true }
    );
    return res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function searchCategory(req, res) {
  const { searchString } = req.body;
  try {
    categoryModel
      .find({ $text: { $search: searchString } })
      .select("name _id")
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
          console.log(err)
          return res.status(400).json({ message: err });
        }
        return res.json({data: docs});
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  getOneCategory,
  updateCategory,
  searchCategory,
};

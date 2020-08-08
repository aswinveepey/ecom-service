const mongoose = require("mongoose");
// const Category = require("../models/category");

async function getAllCategories(req, res) {
  // console.log(req.user);
  try {
    const db = req.db;
    const categoryModel = await db.model("Category");

    categories = await categoryModel
      .find()
      .lean()
      .limit(250);
    return res.json({ data: categories });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getOneCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const db = req.db;
    const categoryModel = await db.model("Category");

    category = await categoryModel
      .findById(categoryId)
      .lean();
    return res.json({ data: category });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createCategory(req, res) {
  try {
    var {
      name,
      filterattributes,
      assets,
    } = req.body;
    const db = req.db;
    const categoryModel = await db.model("Category");

    category = await categoryModel.create({
      name: name,
      filterattributes: filterattributes,
      assets: assets,
    });
    return res.json({ data: category });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    var { _id, name, filterattributes, assets } = req.body;
    const db = req.db;
    const categoryModel = await db.model("Category");

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
    return res.json({data:category});

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function searchCategory(req, res) {
  try {
    const { searchString } = req.body;
    const db = req.db;
    const categoryModel = await db.model("Category");

    const categories = await categoryModel.aggregate([
      { $match: { $text: { $search: searchString } } },
      { $limit: 5 },
    ]);

    return res.json({ data: categories });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  getOneCategory,
  updateCategory,
  searchCategory,
};

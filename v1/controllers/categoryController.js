const mongoose = require("mongoose");
const Category = require("../models/category");

async function getAllCategories(req, res) {
  // console.log(req.user);
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const categoryModel = await db.model("Category");

    categoryModel
      .find({ $text: { $search: searchString } })
      .select("name _id")
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
          console.log(err)
          return res.status(400).json({ error: err.message });
        }
        return res.json({data: docs});
      });
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

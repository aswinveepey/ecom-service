const Brand = require("../models/brand");
const Category = require("../models/category");
const Product = require("../models/product");
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const brandModel = await db.model("Brand");
    const productModel = await db.model("Product");
    const categoryModel = await db.model("Category");

    brand = await brandModel.findById(brandId).lean();

    products = await productModel
      .find({ brand: brandId })
      .select("category")
      .lean();
    categoryIds = await products.map((item) => item.category);
    categories = await categoryModel
      .find({ '_id': { $in: [...new Set(categoryIds)] } })
      .lean();
    return res.json({ data: {brand:brand, categories: categories} });

  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message });
  }
}

async function createBrand(req, res) {
  try {
    var { name, assets, manufacturer } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const brandModel = await db.model("Brand");

    brand = await brandModel.create({
      name: name,
      manufacturer: manufacturer,
      assets: assets,
    });
    return res.json({ data: brand });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function updateBrand(req, res) {
  try {
    var { _id, name, manufacturer, assets } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const brandModel = await db.model("Brand");

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
    return res.status(400).json({ error: error.message });
  }
}

async function searchBrand(req, res) {
  try {
    const { searchString } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const brandModel = await db.model("Brand");

    brandModel
      .find({ $text: { $search: searchString } })
      .select("name _id")
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        return res.json({ data: docs });
      });
      
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllBrands,
  createBrand,
  getOneBrand,
  updateBrand,
  searchBrand,
};

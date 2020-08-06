const mongoose = require("mongoose");
const Product = require("../models/product");

async function getAllProducts(req, res) {
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const productModel = await db.model("Product");

    products = await productModel
      .find()
      .populate({ path: "category", select: "name" })
      .populate({ path: "brand", select: "name" })
      .populate("skus")
      .lean()
      .limit(80);
    return res.json({ data: products });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message });
  }
}

async function getOneProduct(req, res) {
  try {
    const { productId } = req.params;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const productModel = await db.model("Product");

    product = await productModel
      .findById(productId)
      .populate("category")
      .populate("brand")
      .populate("skus")
      .lean();
    return res.json({ data: product });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createProduct(req, res) {
  try {
    var {
      name,
      category,
      description,
      brand,
      assets,
      attributes,
      variantattributes,
      storage,
      logistics,
      gst,
    } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const productModel = await db.model("Product");

    if (!mongoose.Types.ObjectId.isValid(category._id)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(brand._id)) {
      return res.status(400).json({ message: "Invalid Brand ID" });
    }
    product = await productModel.create({
      name: name,
      description: description,
      category: category._id,
      brand: brand._id,
      assets: assets,
      attributes: attributes,
      variantattributes: variantattributes,
      storage: storage,
      logistics: logistics,
      gst: gst,
    });
    return res.json({ data: product, message:"Product Successfully Created" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    var {
      _id,
      name,
      category,
      description,
      brand,
      assets,
      attributes,
      variantattributes,
      storage,
      logistics,
      gst,
    } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const productModel = await db.model("Product");

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(category._id)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(brand._id)) {
      return res.status(400).json({ message: "Invalid Brand ID" });
    }
    product = await productModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          description: description,
          category: category._id,
          brand: brand._id,
          assets: assets,
          attributes: attributes,
          variantattributes: variantattributes,
          storage: storage,
          logistics: logistics,
          gst: gst,
          updatedat: Date.now(),
        },
      },
      { new: true }
    );
    return res.json({ data: product, message: "Product Successfully Updated" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function searchProduct(req, res) {
  try {
    const { searchString } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const productModel = await db.model("Product");

    const products = productModel
      .find({ $text: { $search: searchString } })
      .populate({ path: "category", select: "name" })
      .populate({ path: "brand", select: "name" })
      .populate("skus")
      .lean()
      .limit(3)
    return res.json({data:products})
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  getOneProduct,
  updateProduct,
  searchProduct,
};

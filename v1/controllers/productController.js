const mongoose = require("mongoose");
const productModel = require("../models/product");
const skuModel = require("../models/sku");
const { json } = require("body-parser");

async function getAllProducts(req, res) {
  try {
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
    return res.status(400).json({ message: error });
  }
}

async function getOneProduct(req, res) {
  try {
    const { productId } = req.params;
    product = await productModel.findById(productId).lean();
    return res.json({ data: product });
  } catch (error) {
    return res.status(400).json({ message: error });
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
    return res.json({ data: product });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
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
    return res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function searchProduct(req, res) {
  const { searchString } = req.body;
  try {
    productModel
      .find({ $text: { $search: searchString } })
      .populate({ path: "category", select: "name" })
      .populate({ path: "brand", select: "name" })
      .populate("skus")
      .lean()
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
  getAllProducts,
  createProduct,
  getOneProduct,
  updateProduct,
  searchProduct,
};

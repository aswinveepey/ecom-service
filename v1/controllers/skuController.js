const mongoose = require("mongoose");
const skuModel = require("../models/sku");

// Get all skus for listing skus, limited to a 100 records. Filterable using filterparms
// filterby - supports category, & brand
//filtervalue - supports ID fields
async function getAllSkus(req, res) {
  try {
    //get query params
    const { filterBy, filterValue } = req.query;
    skus = [];

    //validate Filter Value
    if (!mongoose.Types.ObjectId.isValid(filterValue))
      res.status(400).json({ message: "Invalid ID passed as filter value" });

    //validate query parms and assign conditional
    if (filterBy?.toLowerCase() === "category" && filterValue !== "") {
      //filter by category
      skus = await skuModel.findByCategory(filterValue);
    } else if (filterBy?.toLowerCase() === "brand" && filterValue !== "") {
      //filter by brand
      skus = await skuModel.findByCategory(filterValue);
    } else {
      //default - no filter
      skus = await skuModel.find().populate("product").lean().limit(100);
    }

    //return query results
    return res.json({ data: skus });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function getOneSku(req, res) {
  try {
    const { skuId } = req.params;
    sku = await skuModel
      .findById(skuId)
      .populate("product")
      .populate({ path: "inventory.territory", select: "name" })
      .lean();
    return res.json({ data: sku });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function createSku(req, res) {
  try {
    var {
      name,
      product,
      inventory,
      assets,
      attributes,
      dattributes,
      price,
      bulkdiscount,
      quantityrules,
    } = req.body;
    user = req.user;
    price.sellingprice = price.mrp - price.discount;
    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    sku = await skuModel.create({
      name: name,
      product: product,
      inventory: inventory,
      assets: assets,
      attributes: attributes,
      dattributes: dattributes,
      price: price,
      quantityrules: quantityrules,
      bulkdiscount: bulkdiscount,
    });
    return res.json({ data: sku });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function updateSku(req, res) {
  try {
    var {
      _id,
      name,
      product,
      inventory,
      assets,
      attributes,
      dattributes,
      price,
      bulkdiscount,
      quantityrules,
    } = req.body;
    user = req.user;

    inventory.forEach((data) => {
      if (!mongoose.Types.ObjectId.isValid(data.territory._id)) {
        return res.status(400).json({ message: "Invalid Territory ID" });
      }
      data.territory = data.territory._id;
    });
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid SKU ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(product._id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    sku = await skuModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          product: product._id,
          inventory: inventory,
          assets: assets,
          attributes: attributes,
          dattributes: dattributes,
          price: price,
          quantityrules: quantityrules,
          bulkdiscount: bulkdiscount,
        },
        $push: {
          updatelog: { updatedby: user._id },
        },
      },
      { new: true }
    );
    return res.json(sku);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
}

async function searchSku(req, res) {
  const { searchString } = req.body;
  try {
    skuModel
      .find({ $text: { $search: searchString } })
      .populate("product")
      .populate("inventory")
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
  getAllSkus,
  createSku,
  getOneSku,
  updateSku,
  searchSku,
};
const mongoose = require("mongoose");
const skuModel = require("../models/sku");
const productModel = require("../models/product");

// Get all skus for listing skus, limited to a 100 records. Filterable using filterparms
// filterby - supports category, & brand
//filtervalue - supports ID fields
async function getAllSkus(req, res) {
  try {
    //get query params
    const { filterBy, filterValue } = req.query;
    const territories = req.territories;
    
    //init variables
    let skus = [];
    let territoriesArray = [];
    let filterQuery = {};
    let territoryQuery = {};
    let unselectQuery = {}

    //map territories obj array to string array
    territoriesArray = territories?.map((t) => mongoose.Types.ObjectId(t._id));

    //validate Filter Value
    if (filterValue && !mongoose.Types.ObjectId.isValid(filterValue))
      res.status(400).json({ message: "Invalid ID passed as filter value" });
    
    if (req.customer){
      unselectQuery = {
        "price.purchaseprice": 0,
        "inventory.purchaseprice": 0,
      };
    }

    //assign territory query if territories
    if ((territoriesArray.length > 0) && req.customer) {
      console.log(territoriesArray);
      territoryQuery = { "inventory.territory": { $in: territoriesArray } };
    }

    //based on filter conditions update query
    if (filterBy && filterValue) {
      if (filterBy.toLowerCase()==="category"){
        filterQuery = {
          "product.category": mongoose.Types.ObjectId(filterValue),
        };
      } else if (filterBy.toLowerCase()==="brand"){
        filterQuery = {
          "product.brand": mongoose.Types.ObjectId(filterValue),
        };
      }
    }

    //sku actual query. If no filter return all
    skus = await skuModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" }, //look up returns array - convert to object
      {
        $match: {
          $and: [filterQuery, territoryQuery], //returns colleciton based on queries - does not filter the inventory
        },
      },
      {
        $project: unselectQuery, //hide purchase price from data sent
      },
      { $limit: 100 },
    ]);

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
    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    inventory.forEach((data) => {
      if (!mongoose.Types.ObjectId.isValid(data.territory._id)) {
        return res.status(400).json({ message: "Invalid Territory ID" });
      }
      data.territory = data.territory._id;
    });
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
          $slice: -25,
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

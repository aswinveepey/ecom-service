const mongoose = require("mongoose");
// const skuSchema = require("../models/sku");
// const Product = require("../models/product");
const skuService = require("../services/skuService")

// Get all skus for listing skus, limited to a 100 records. Filterable using filterparms
// filterby - supports category, & brand
//filtervalue - supports ID fields
async function getSkus(req, res) {
  try {
    //get query params
    const { filterBy, filterValue } = req.query;
    const territories = req.territories;
    const db = req.db;
    const skuModel = await db.model("Sku");
    
    //init variables
    let skus = [];
    let territoriesArray = [];
    let filterQuery = {};
    let territoryQuery = {};
    let statusFilter = {};
    let inventoryStatusFilter = {};

    const groupQuery = {
      _id: "$_id",
      shortid: { $first: "$shortid" },
      name: { $first: "$name" },
      product: { $first: "$product" },
      assets: { $first: "$assets" },
      attributes: { $first: "$attributes" },
      dattributes: { $first: "$dattributes" },
      price: { $first: "$price" },
      bulkdiscount: { $first: "$bulkdiscount" },
      quantityrules: { $first: "$quantityrules" },
      status: { $first: "$status" },
      createdat: { $first: "$createdat" },
      updatelog: { $first: "$updatelog" },
      inventory: { $first: "$inventory" },
    };

    //map territories obj array to string array
    territoriesArray = territories?.map((t) => mongoose.Types.ObjectId(t._id));

    //unselect purchase prices
    const unselectQuery = {
      "price.purchaseprice": 0,
      "inventory.purchaseprice": 0,
    };

    //assign territory query if territories
    if (req.customer) {
      territoryQuery = { "inventory.territory": { $in: territoriesArray } };
      inventoryStatusFilter = { "inventory.status": true };
      statusFilter= { "status": true };
    }

    //based on filter conditions update query
    if (filterBy) {
      //category filter
      if (filterBy.toLowerCase() === "category") {
        if (filterValue && !mongoose.Types.ObjectId.isValid(filterValue))
          throw new Error("Invalid Category ID passed as filter value");
        filterQuery = {
          "product.category": mongoose.Types.ObjectId(filterValue),
        };
        //brand filter
      } else if (filterBy.toLowerCase() === "brand") {
        if (filterValue && !mongoose.Types.ObjectId.isValid(filterValue))
          throw new Error("Invalid Brand ID passed as filter value");
        filterQuery = {
          "product.brand": mongoose.Types.ObjectId(filterValue),
        };
        //attribute filter
      } else if (filterBy.toLowerCase() === "attributes") {
        if (!filterValue) throw new Error("Invalid attribute value");
        filterQuery = {
          "product.attributes.value": { $in: filterValue?.split(",") },
        };
        //top products filter
      } else if (filterBy.toLowerCase() === "top") {
        const topSkus = await skuService.getTopOrderedSkus({ db: db });
        // get top skus by ID
        filterQuery = {
          _id: { $in: topSkus },
        };
      } else if (filterBy.toLowerCase() === "product") {
        if (filterValue && !mongoose.Types.ObjectId.isValid(filterValue))
          throw new Error("Invalid Product ID passed as filter value");
        filterQuery = {
          "product._id": mongoose.Types.ObjectId(filterValue),
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
      { $unwind: "$product" }, //product array to object
      { $unwind: "$inventory" }, //inventory array to object
      {
        $match: {
          $and: [
            filterQuery,
            territoryQuery,
            statusFilter,
            inventoryStatusFilter,
          ], //returns colleciton based on queries
        },
      },
      {
        $project: unselectQuery, //hide purchase prices for customer
      },
      { $group: groupQuery },
      { $limit: 50 },
    ]);

    //return query results
    return res.json({ data: skus });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function getOneSku(req, res) {
  try {
    const { skuId } = req.params;
    const db = req.db;
    const skuModel = await db.model("Sku");

    const territories = req.territories;
    let territoriesArray = [];
    let territoryQuery = {};
    let skus = [];
    let unselectQuery = {
        "price.purchaseprice": 0,
        "inventory.purchaseprice": 0,
        "product.skus.price.purchaseprice": 0,
        "product.skus.inventory": 0,
      };
    let groupQuery = {
      _id: "$_id",
      shortid: { $first: "$shortid" },
      name: { $first: "$name" },
      product: { $first: "$product" },
      assets: { $first: "$assets" },
      attributes: { $first: "$attributes" },
      dattributes: { $first: "$dattributes" },
      price: { $first: "$price" },
      bulkdiscount: { $first: "$bulkdiscount" },
      quantityrules: { $first: "$quantityrules" },
      status: { $first: "$status" },
      createdat: { $first: "$createdat" },
      updatelog: { $first: "$updatelog" },
      inventory: { $first: "$inventory" },
    };

    //map territories to array of ids
    territoriesArray = territories?.map((t) => mongoose.Types.ObjectId(t._id));

    //assign territory query if territories
    territoryQuery = { "inventory.territory": { $in: territoriesArray } };
    // if (territoriesArray.length > 0) {
      
    // }

    skus = await skuModel.aggregate([
      { $unwind: "$inventory" },
      {
        $match: {
          //returns colleciton based on queries - does not filter the inventory
          $and: [
            { _id: mongoose.Types.ObjectId(skuId) },
            territoryQuery,
            { "inventory.status": true },
          ],
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" }, //array of unwind queries
      {
        $lookup: {
          from: "brands",
          localField: "product.brand",
          foreignField: "_id",
          as: "product.brand",
        },
      },
      { $unwind: "$product.brand" }, //array of unwind queries
      {
        $lookup: {
          from: "skus",
          localField: "product._id",
          foreignField: "product",
          as: "product.skus",
        },
      },
      { $project: unselectQuery },
      { $group: groupQuery },
    ]);
    //return first instance
    return res.json({ data: skus[0] });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message });
  }
}

//end point for backend operations - had to be seperated due to conflict with app endpoint
async function getSku(req, res) {
  try {
    const { skuId } = req.params;
    const db = req.db;
    const skuModel = await db.model("Sku");

    sku = await skuModel
        .findById(skuId)
        .populate("product")
        .populate("product.category")
        .populate("product.brand")
        .populate({ path: "inventory.territory", select: "name" })
        .lean();;
    //return first instance
    return res.json({ data: sku });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message });
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
    const db = req.db;
    const skuModel = await db.model("Sku");
    user = req.user;

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    inventory?.forEach((data) => {
      if (
        !mongoose.Types.ObjectId.isValid(
          data.territory._id ? data.territory._id : data.territory
        )
      ) {
        return res.status(400).json({ message: "Invalid Territory ID" });
      }
      data.territory = data.territory._id ? data.territory._id : data.territory;
    });

    sku = await skuModel.create({
      name: name,
      product: product,
      inventory: inventory||[],
      assets: assets,
      attributes: attributes,
      dattributes: dattributes,
      price: price,
      quantityrules: quantityrules,
      bulkdiscount: bulkdiscount,
    });

    return res.json({ data: sku, message:"Succesfully created sku" });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
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
      status
    } = req.body;
    const db = req.db;
    const skuModel = await db.model("Sku");

    user = req.user;
    //loop through inventory and set territory data per model
    inventory.forEach((data) => {
      if (
        !mongoose.Types.ObjectId.isValid(
          data.territory?._id
        )
      ) {
        console.log(data.territory)
        throw new Error("Invalid Territory ID");
      }
      data.territory = data.territory?._id;
    });
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid SKU ID");
    }
    if (!mongoose.Types.ObjectId.isValid(product._id)) {
      throw new Error("Invalid product ID");
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
          status: status,
        },
        $push: {
          updatelog: { updatedby: user._id },
          $slice: -25,
        },
      },
      { new: true }
    );
    return res.json({ data: sku , message:"Succesfully updated sku"});
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function searchSku(req, res) {
  try {
    const { searchString } = req.body;
    const db = req.db;
    const skuModel = await db.model("Sku");

    const skus = await skuModel.aggregate([
      {
        $match: { $text: { $search: searchString } },
      },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {$unwind:"$product"}
    ]);

    return res.json({data:skus})
      
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getSkus,
  createSku,
  getOneSku,
  updateSku,
  searchSku,
  getSku,
};

const mongoose = require("mongoose");
const Sku = require("../models/sku");
const Product = require("../models/product");
const skuService = require("../services/skuService")

// Get all skus for listing skus, limited to a 100 records. Filterable using filterparms
// filterby - supports category, & brand
//filtervalue - supports ID fields
async function getSkus(req, res) {
  try {
    //get query params
    const { filterBy, filterValue, tenantId } = req.query;
    const territories = req.territories;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const skuModel = await db.model("Sku");
    
    //init variables
    let skus = [];
    let territoriesArray = [];
    let filterQuery = {};
    let territoryQuery = {};
    let unselectQuery = {}

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

    
    if (req.customer){
      unselectQuery = {
        "price.purchaseprice": 0,
        "inventory.purchaseprice": 0,
      };
    }

    //assign territory query if territories
    if ((territoriesArray.length > 0) && req.customer) {
      territoryQuery = { "inventory.territory": { $in: territoriesArray } };
    }

    //based on filter conditions update query
    if (filterBy) {
      //category filter
      if (filterBy.toLowerCase()==="category"){
        if (filterValue && !mongoose.Types.ObjectId.isValid(filterValue))
          throw new Error("Invalid Category ID passed as filter value");
        filterQuery = {
          "product.category": mongoose.Types.ObjectId(filterValue),
        };
        //brand filter
      } else if (filterBy.toLowerCase()==="brand"){
        if (filterValue && !mongoose.Types.ObjectId.isValid(filterValue))
          throw new Error("Invalid Brand ID passed as filter value");
        filterQuery = {
          "product.brand": mongoose.Types.ObjectId(filterValue),
        };
        //attribute filter
      } else if (filterBy.toLowerCase()==="attributes"){
        if (!filterValue)
          throw new Error("Invalid attribute value");
        filterQuery = {
          "product.attributes.value": { $in: filterValue?.split(",") },
        };
        //top products filter
      } else if (filterBy.toLowerCase()==="top"){
        const topSkus = await skuService.getTopOrderedSkus(tenantId);
        // get top skus by ID
        filterQuery = {
          _id: { $in: topSkus },
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
          $and: [filterQuery, territoryQuery, { "inventory.status": true }], //returns colleciton based on queries
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
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
    if ((territoriesArray.length > 0) && req.customer) {
      territoryQuery = { "inventory.territory": { $in: territoriesArray } };
    }

    //get sku
    if(req.customer){

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

    } else{

      skus[0] = await skuModel
        .findById(skuId)
        .populate("product")
        .populate({ path: "inventory.territory", select: "name" })
        .lean();;

    }
    //return first instance
    return res.json({ data: skus[0] });
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const skuModel = await db.model("Sku");
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
    } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const skuModel = await db.model("Sku");

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
    return res.status(400).json({ error: err.message });
  }
}

async function searchSku(req, res) {
  try {
    const { searchString } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const skuModel = await db.model("Sku");

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
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getSkus,
  createSku,
  getOneSku,
  updateSku,
  searchSku,
};

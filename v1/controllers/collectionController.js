// const Collection = require("../models/collection");
const mongoose = require("mongoose");

async function getCollections(req, res) {
  try {
    const db = req.db;
    const { filterBy } = req.query;
    const collectionModel = await db.model("Collection");
    let collections;

    if (filterBy && filterBy.toLowerCase() === "active") {
        collections = await collectionModel
          .find({ status: true })
          .limit(10)
          .sort({ createdat: -1 })
          .lean();
    } else {
        collections = await collectionModel
          .find()
          .limit(250)
          .sort({ createdat: -1 })
          .lean();
      }

    return res.json({ data: collections });

  } catch (error) {
    return res.status(400).json({error:error.message})
  }
  
}

async function getOneCollection(req, res) {
  try {
    const { collectionId } = req.params;
    const territories = req.territories;
    const db = req.db;
    const collectionModel = await db.model("Collection");
    const categoryModel = await db.model("Category");
    const skuModel = await db.model("Sku");

    let collection = await collectionModel
      .findOne({ _id: collectionId, status: true })
      .lean();

    if (collection.type === "Category"){

      const categories = await categoryModel.find({_id:{$in:collection.items}}).lean()
      collection.categories = categories

    } else {

      //map territories obj array to string array
      const territoriesArray = territories?.map((t) => mongoose.Types.ObjectId(t._id));
      //unselect purchase prices
      const unselectQuery = {
        "price.purchaseprice": 0,
        "inventory.purchaseprice": 0,
      };
      const territoryQuery = { "inventory.territory": { $in: territoriesArray } };
      const inventoryStatusFilter = { "inventory.status": true };
      const statusFilter = { status: true };
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
      const skus = await skuModel.aggregate([
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

      //append skus to collection object
      collection.skus = skus
    }
    return res.json({ data: collection });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createCollection(req, res) {
  try {
    const { name, assets, type, items, startdate, enddate, status  } = req.body;
    const db = req.db;
    const collectionModel = await db.model("Collection");

    collection = new collectionModel({
      name: name,
      assets: assets,
      type: type,
      startdate: startdate,
      enddate: enddate,
      status: status,
    });
    collection = await collection.save();
    collection = await collectionModel.update(
      { _id: collection._id },
      { $addToSet: { items: items } }
    );
    return res.json({ message: "Collection Added Succesfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}
async function updateCollection(req, res) {
  try {
    const {
      _id,
      name,
      assets,
      items,
      startdate,
      enddate,
      status,
    } = req.body;
    const db = req.db;
    const collectionModel = await db.model("Collection");

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Collection ID" });
    }
    collection = await collectionModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          assets: assets,
          startdate: startdate,
          enddate: enddate,
          status: status,
          updatedat: Date.now(),
        },
        $addToSet: {
          items: items,
        },
      },
      { new: true, upsert: true }
    );
    return res.json({ data:collection, message: "Collection Updated Succesfully" });

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function searchCollection(req, res) {
  try {
    const { searchString } = req.body;
    const db = req.db;
    const collectionModel = await db.model("Collection");

    const collections = await collectionModel.aggregate([
      { $match: { $text: { $search: searchString } } },
      { $limit: 5 },
    ]);
    
    return res.json({data:collections})

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getCollections,
  createCollection,
  searchCollection,
  getOneCollection,
  updateCollection,
};

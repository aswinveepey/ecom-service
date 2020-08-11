// const Collection = require("../models/collection");
const mongoose = require("mongoose");

async function getCollections(req, res) {
  try {
    const db = req.db;
    const collectionModel = await db.model("Collection");

    const collections = await collectionModel.find().lean();
    return res.json({ data: collections });

  } catch (error) {
    return res.status(400).json({error:error.message})
  }
  
}

async function getOneCollection(req, res) {
  try {
    const { collectionId } = req.params;
    const db = req.db;
    const collectionModel = await db.model("Collection");

    const collection = await collectionModel
      .find({ _id: collectionId, status:true })
      .populate({ path: "items", populate: { path: "product" } })
      .lean();
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

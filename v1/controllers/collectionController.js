const collectionModel = require("../models/collection");
const mongoose = require("mongoose");

async function getCollections(req, res) {
  const collections = await collectionModel.find().lean();
  res.json({ data: collections });
}

async function getOneCollection(req, res) {
  const { collectionId } = req.params;
  const collection = await collectionModel.findById(collectionId).lean();
  res.json({ data: collection });
}

async function createCollection(req, res) {
  try {
    const { name, assets, type, items, startdate, enddate, status  } = req.body;
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
    res.json({ message: "Collection Added Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
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
    res.json({ data:collection, message: "Collection Updated Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
}

async function searchCollection(req, res) {
  const { searchString } = req.body;
  try {
    collectionModel
      .find({ $text: { $search: searchString } })
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
          console.log(err);
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
  getCollections,
  createCollection,
  searchCollection,
  getOneCollection,
  updateCollection,
};

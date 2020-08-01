const mongoose = require("mongoose");
const shortid = require("shortid");

const collectionSchema = mongoose.Schema({
  shortid: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  assets: {
    img: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  type: {
    type: String,
    required: true,
    enum: ["Category", "Sku"],
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type",
    },
  ],
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedat: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const collectionModel = mongoose.model("Collection", collectionSchema);

module.exports = collectionModel;
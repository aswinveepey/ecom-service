const mongoose = require("mongoose");
const shortid = require("shortid");

const leadSchema = mongoose.Schema({
  shortid: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Business", "Regular"],
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  gst: {
    type: String,
  },
  score: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
    default:"warm"
  },
  source: {
    type: String,
    required: true,
    enum: ["walkin", "website"],
    default:"walkin"
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

leadSchema.index(
  {
    firstname: "text",
    lastname: "text",
  },
  {
    name: "lead_search_index",
  }
);

const leadModel = mongoose.model("Lead", leadSchema);

module.exports = leadModel;
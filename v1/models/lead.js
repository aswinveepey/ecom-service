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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // opportunities: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Opportunity",
  //   },
  // ],
  // quotes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Quote",
  //   },
  // ],
  // activities: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Activity",
  //   },
  // ],
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
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
    default: "warm",
  },
  source: {
    type: String,
    required: true,
    enum: ["walkin", "website"],
    default: "walkin",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
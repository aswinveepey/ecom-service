const mongoose = require("mongoose");
const shortid = require("shortid");
const Double = require("@mongoosejs/double");

const quoteSchema = mongoose.Schema({
  shortid: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phone:{
      type:String
    },
    email:{
      type:String
    },
    gst: { type: String },
  },
  items: [
    {
      sku: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sku",
        required: true,
      },
      quantity: {
        type: mongoose.Schema.Types.Number,
        required: true,
      },
      discount: {
        type: Double,
        required: true,
        default: 0,
      },
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ["prospecting", "proposal", "won", "lost"],
    default: "prospecting",
  },
  expirydate: {
    type: Date,
    required: true,
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

quoteSchema.index(
  {
    name: "text",
  },
  {
    name: "quote_search_index",
  }
);

const QuoteModel = mongoose.model("Quote", quoteSchema);

module.exports = QuoteModel;

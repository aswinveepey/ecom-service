const moongoose = require("mongoose");

const brandSchema = moongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    trim: true,
  },
  manufacturer: {
    type: String,
  },
  assets: {
    logo: {
      type: String,
    },
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

brandSchema.index(
  {
    name: "text",
  },
  {
    name: "brand_search_index",
  }
);

const brandModel = moongoose.model("Brand", brandSchema);

module.exports = brandModel;

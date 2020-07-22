const mongoose = require("mongoose");

const territorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  pincodes: [
    {
      type: String,
      trim: true,
      required:true
    },
  ],
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

territorySchema.index(
  {
    name: "text",
    pincodes: "text",
  },
  {
    name: "territory_search_index",
  }
);

const territoryModel = mongoose.model("Territory", territorySchema);

module.exports = territoryModel;

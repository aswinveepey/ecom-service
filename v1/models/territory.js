const mongoose = require("mongoose");

const territorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  pincodes: [
    {
      type: String,
      trim: true
    },
  ],
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const territoryModel = mongoose.model("Territory", territorySchema);

module.exports = territoryModel;

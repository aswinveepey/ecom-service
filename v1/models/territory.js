const mongoose = require("mongoose");

const territorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  pincodes: [
    {
      type: String,
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

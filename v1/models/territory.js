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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pincode",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const territoryModel = mongoose.model("Territory", territorySchema);

module.exports = territoryModel;

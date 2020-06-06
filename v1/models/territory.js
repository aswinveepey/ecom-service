const mongoose = require("mongoose");

const territorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  pincodes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pincode'
    }
  ]
});

const territoryModel = mongoose.model("Territory", territorySchema);

module.exports = territoryModel;

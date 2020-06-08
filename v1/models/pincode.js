const mongoose = require('mongoose')

const pincodeSchema = mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const pincodeModel = mongoose.model('Pincode', pincodeSchema);

module.exports = pincodeModel;
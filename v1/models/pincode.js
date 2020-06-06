const mongoose = require('mongoose')

const pincodeSchema = mongoose.Schema({
  pincode:{
    type: String,
    required: true,
    unique: true
  }
})

const pincodeModel = mongoose.model('Pincode', pincodeSchema);

module.exports = pincodeModel;
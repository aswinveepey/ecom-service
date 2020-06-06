const mongoose = require('mongoose')

const divisionSchema = mongoose.Schema({
  name:{
    type: String,
    unique: true,
    required: true
  }
})

const divisionModel = mongoose.model('Division', divisionSchema)

module.exports = divisionModel;
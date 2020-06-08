const mongoose = require('mongoose')

const divisionSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const divisionModel = mongoose.model('Division', divisionSchema)

module.exports = divisionModel;
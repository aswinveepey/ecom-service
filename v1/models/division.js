const mongoose = require('mongoose')

const divisionSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  assets: {
    img: {
      type: String,
    },
    thumbnail: {
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

divisionSchema.index(
  {
    name: "text",
  },
  {
    name: "division_search_index",
  }
);

const divisionModel = mongoose.model('Division', divisionSchema)

module.exports = divisionModel;
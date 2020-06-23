const moongoose = require('mongoose')

const categorySchema = moongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  filterattributes: [
    {
      name: {
        type: String,
        lowercase: true,
        trim: true,
      },
      values:[
        {type: String, lowercase: true, trim: true}
      ]
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

categorySchema.index(
  {
    name: "text",
  },
  {
    name: "category_search_index",
  }
);

const categoryModel = moongoose.model('Category', categorySchema)

module.exports = categoryModel;
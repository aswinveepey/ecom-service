const moongoose = require('mongoose')

const categorySchema = moongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const categoryModel = moongoose.model('Category', categorySchema)

module.exports = categoryModel;
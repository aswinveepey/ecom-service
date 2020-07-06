const mongoose = require('mongoose')
const shortid = require('shortid');
const Double = require("@mongoosejs/double");

const productSchema = mongoose.Schema({
  shortid: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: [
    {
      lang: {
        type: String,
        required: true,
        unique: true,
      },
      value: {
        type: String,
        required: true,
        unique: true,
      },
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  assets: {
    imgs: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
    },
  },
  attributes: [
    {
      name: {
        type: String,
        unique: true,
      },
      value: {
        type: String,
      },
    },
  ],
  variantattributes: [
    {
      name: {
        type: String,
        unique: true,
      },
      values: [{
        type: String,
      }],
    },
  ],
  storage: {
    storagetype: {
      type: String,
    },
    shelflife: {
      type: mongoose.Schema.Types.Number,
    },
  },
  logistics: {
    deadweight: {
      type: Double,
      required: true,
    },
    volumetricweight: {
      type: Double,
    },
  },
  gst: {
    hsncode: {
      type: String,
      required: true,
    },
    cgst: {
      type: Double,
      required: true,
    },
    sgst: {
      type: Double,
      required: true,
    },
    igst: {
      type: Double,
      required: true,
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
productSchema.virtual('skus',{
  ref:'Sku',
  localField:'_id',
  foreignField:'product',
  justOne:false
});
productSchema.index(
  {
    name: "text",
  },
  {
    name: "product_search_index",
  }
);

productSchema.index(
  {
    "attributes.name": 1,
    "attributes.value": 1,
  },
  {
    name: "product_attribute_index",
  }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
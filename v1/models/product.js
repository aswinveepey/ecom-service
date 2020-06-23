const mongoose = require('mongoose')
const shortid = require('shortid');

const productSchema = mongoose.Schema({
  shortId: {
    type: String,
    unique: true,
    default: shortId.generate,
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
  eannumber: {
    type: String,
    unique: true,
  },
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
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    volumetricweight: {
      type: mongoose.Schema.Types.Decimal128,
    },
  },
  gst: {
    hsncode: {
      type: String,
      required: true,
    },
    cgst: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    sgst: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    igst: {
      type: mongoose.Schema.Types.Decimal128,
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

const productModel = moongoose.model("Product", productSchema);

module.exports = productModel;
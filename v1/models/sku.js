const mongoose = require("mongoose");
const shortid = require("shortid");
const Double = require("@mongoosejs/double");

const skuSchema = mongoose.Schema({
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
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  inventory: [
    {
      territory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Territory",
        required: true,
      },
      quantity: {
        type: mongoose.Schema.Types.Number,
        required: true,
        default: 0,
      },
    },
  ],
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
  dattributes: [
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
  price: {
    mrp: {
      type: Double,
      required: true,
    },
    discount: {
      type: Double,
      required: true,
      default: 0,
    },
    sellingprice: {
      type: Double,
      required: true,
    },
    shippingcharges: {
      type: Double,
      required: true,
      default: 0,
    },
    installationcharges: {
      type: Double,
      required: true,
      default: 0,
    },
  },
  bulkdiscount: {
    threshold: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Double,
      required: true,
      default: 0,
    },
  },
  quantityrules: {
    minorderqty: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
    minorderqtystep: {
      type: Boolean,
      required: true,
      default: true,
    },
    maxorderqty: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatelog: [
    {
      updatedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      updatedat: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
});

skuSchema.index(
  {
    "name": "text",
    "product.name": "text"
  },
  {
    name: "sku_search_index",
  }
);

skuSchema.index(
  {
    "attributes.name": 1,
    "attributes.value": 1,
  },
  {
    name: "sku_attribute_index",
  }
);

skuSchema.index(
  {
    "inventory.territory": 1,
  },
  {
    name: "sku_territory_index",
  }
);

skuSchema.statics.findByCategory = async function (categoryId) {
  return this.find().populate({path: "product", match: { category: categoryId }}).limit(100).lean()
}

skuSchema.statics.findByBrand = async function (categoryId) {
  return this.find().populate({path: "product", match: { brand: categoryId }}).limit(100).lean()
}

const skuModel = mongoose.model("Sku", skuSchema);

module.exports = skuModel;

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
        min: 0,
      },
      mrp: {
        type: Double,
        required: true,
        min: 0,
      },
      discount: {
        type: Double,
        required: true,
        default: 0,
        min: 0,
      },
      sellingprice: {
        type: Double,
        required: true,
        min: 0,
      },
      purchaseprice: {
        type: Double,
        required: true,
        min: 0,
      },
      shippingcharges: {
        type: Double,
        required: true,
        default: 0,
        min: 0,
      },
      installationcharges: {
        type: Double,
        required: true,
        default: 0,
        min: 0,
      },
      status: {
        type: Boolean,
        required: true,
        default: true,
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
      min: 0,
    },
    discount: {
      type: Double,
      required: true,
      default: 0,
      min: 0,
    },
    sellingprice: {
      type: Double,
      required: true,
      min: 0,
    },
    purchaseprice: {
      type: Double,
      required: true,
      min: 0,
    },
    shippingcharges: {
      type: Double,
      required: true,
      default: 0,
      min: 0,
    },
    installationcharges: {
      type: Double,
      required: true,
      default: 0,
      min: 0,
    },
  },
  bulkdiscount: {
    threshold: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Double,
      required: true,
      default: 0,
      min: 0,
    },
  },
  quantityrules: {
    minorderqty: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
      min: 0,
    },
    minorderqtystep: {
      type: Boolean,
      required: true,
      default: true,
      min: 0,
    },
    maxorderqty: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
      min: 0,
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

const skuModel = mongoose.model("Sku", skuSchema);

module.exports = skuSchema;

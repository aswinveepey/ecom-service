const mongoose = require("mongoose");
const customerSchema = require("mongoose").model("Customer").schema;
const skuSchema = require("mongoose").model("Sku").schema;
const shortid = require("shortid");
const Double = require("@mongoosejs/double");

const addressSchema = mongoose.Schema({
  address1: {
    type: String,
    required: true,
  },
  address2: String,
  landmark: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "IN",
  },
  pincode: {
    type: String,
    required: true,
  },
  lat: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
});

const orderSchema = mongoose.Schema({
  shortid: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  customer: {
    customer: {
      type: customerSchema,
      required: true
    },
    deliveryaddress: {
      type: addressSchema,
      required: true,
    },
    billingaddress: {
      type: addressSchema,
      required: true,
    },
  },
  orderitems: [
    {
      shortid: {
        type: String,
        unique: true,
        default: shortid.generate,
      },
      sku: skuSchema,
      quantity: {
        territory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Territory",
          required: true,
        },
        booked: {
          type: mongoose.Schema.Types.Number,
          required: true,
        },
        confirmed: {
          type: mongoose.Schema.Types.Number,
        },
        shipped: {
          type: mongoose.Schema.Types.Number,
        },
        delivered: {
          type: mongoose.Schema.Types.Number,
        },
        returned: {
          type: mongoose.Schema.Types.Number,
        },
      },
      amount: {
        amount: {
          type: Double,
          required: true,
        },
        discount: {
          type: Double,
          required: true,
          default: 0,
        },
        totalamount: {
          type: Double,
          required: true,
        },
      },
      status: {
        type: String,
        enum: [
          "Booked",
          "Cancelled",
          "Confirmed",
          "Shipped",
          "Delivered",
          "Returned",
          "Partial Delivery",
        ],
        default: "Booked",
      },
      orderdate: {
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
    },
  ],
  amount: {
    amount: {
      type: Double,
      required: true,
    },
    discount: {
      type: Double,
      required: true,
      default: 0,
    },
    totalamount: {
      type: Double,
      required: true,
    },
    installation: {
      type: Double,
      required: true,
      default: 0,
    },
    shipping: {
      type: Double,
      required: true,
      default: 0,
    },
  },
  payment: [
    {
      type: {
        type: String,
        enum: ["Card", "Bank", "COD", "Other"],
      },
      ref: {
        type: String,
      },
      amount: {
        type: Double,
        required: true,
      },
      createdat: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
const mongoose = require("mongoose");
const validator = require("validator");

const accountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Corporate", "Enterprise", "Other"],
  },
  gstin: {
    unique: true,
    type: String,
    sparse: true,
    trim: true,
  },
  primarycontact: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    mobile: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
  },
  address: [
    {
      type: {
        type: String,
        required: true,
        enum: ["Delivery", "Billing"],
      },
      name:{
        type: String,
        required: true
      },
      address1: {
        type: String,
        required: true,
      },
      address2: {
        type: String,
      },
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
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedat: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

accountSchema.index(
  {
    name: "text",
    gstin: "text",
  },
  {
    name: "account_search_index",
  }
);

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;

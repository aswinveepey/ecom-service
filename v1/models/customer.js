const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Business", "Regular"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  birthday: {
    type: Date,
  },
  contactnumber: {
    type: String,
  },
  address: [
    {
      name:{
        type: String,
        required: true,
        unique:true
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
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    unique: true,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
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

customerSchema.index(
  {
    "firstname": "text",
    "lastname": "text",
    "auth.mobilenumber": "text",
  },
  {
    name: "customer_search_index",
  }
);

const customerModel = mongoose.model("Customer", customerSchema);

module.exports = customerModel;

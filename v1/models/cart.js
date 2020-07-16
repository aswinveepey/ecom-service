const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
    unique: true
  },
  cartitems: [
    {
      sku: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sku",
        required: true,
        unique:true
      },
      quantity: {
        type: mongoose.Schema.Types.Number,
        required: true,
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
    },
  ],
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
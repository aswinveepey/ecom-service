const mongoose = require("mongoose");
const orderModel = require("../models/order");
const customerModel = require("../models/customer");
const cartModel = require("../models/cart");


// add items to cart
// create cart if not exists

async function addtoCart(req, res){
  try {
    auth = req.auth._id;
    var {sku, quantity} = req.body
    customer = await customerModel.findOne({ auth: auth._id });
    !customer && res.status(400).json({ message: "Customer Not Found" });

    cart = await cartModel.findOneAndUpdate(
      { customer: customer._id },
      {
        $set: { customer: customer._id },
        $pull: { cartitems: { sku: sku } },
      },
      { upsert: true, new: true }
    );
    cart.cartitems.push({sku:sku, quantity:quantity})
    cart.save()
    return res.json({data:cart})


  } catch (error) {
    res.status(400).json({message:error})
  }
}

module.exports = {
  addtoCart,
};
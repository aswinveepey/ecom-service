const mongoose = require("mongoose");
const orderModel = require("../models/order");
const customerModel = require("../models/customer");
const cartModel = require("../models/cart");
const skuModel = require("../models/sku");
const skuRules = require("../services/orderValidations")
const territoryMappingService = require("../services/territoryMappingService")

// add items to cart
// create cart if not exists

async function getSelfCart(req, res) {
  try {
    customer = req.customer;
    !customer && res.status(400).json({ message: "Customer Not Found" });
    cart = await cartModel
      .findOne({ customer: customer._id })
      .populate("cartitems.sku")
      .lean();
    return res.json({ data: cart });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

async function addtoCart(req, res) {
  try {
    customer = req.customer;
    var { sku, quantity } = req.body;
    !customer && res.status(400).json({ message: "Customer Not Found" });
    //validate SKU
    if (!mongoose.Types.ObjectId.isValid(sku))
      res.status(400).json({ message: "Invalid SKU ID provided" });
    //fetch sku data
    skuData = await skuModel.findOne({ _id: sku, status: true });
    // if not sku return error message
    if (!skuData) throw new Error("SKU OOS or inactive");
    //Validate quantity rules
    await skuRules.validateSkuQuantityRules(skuData, quantity)
    // Update Cart
    cart = await cartModel.findOneAndUpdate(
      { customer: customer._id },
      {
        $set: { customer: customer._id },
        $pull: { cartitems: { sku: sku } },
      },
      { upsert: true, new: true }
    );
    cart.cartitems.push({ sku: sku, quantity: quantity });
    cart.save();
    return res.json({ data: cart });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

async function checkout(req, res) {
  try {
    auth = req.auth._id;
    let customer = {};
    let amount = {
      amount: 0,
      discount: 0,
      totalamount: 0,
      installation: 0,
      shipping: 0,
    };
    let orderitems = [];
    let payments = [];
    currentCustomer = req.customer;
    !currentCustomer && res.status(400).json({ message: "Customer Not Found" });
    //assign customer to customer.customer
    customer.customer = currentCustomer;
    customer.deliveryaddress = currentCustomer.address[currentCustomer.currentaddressindex];
    customer.billingaddress = currentCustomer.address[currentCustomer.currentaddressindex];

    mappedTerritories = await territoryMappingService.mapTerritory(customer.deliveryaddress.pincode);
    
    cart = await cartModel
        .findOne({ "customer._id": customer._id })
        .populate("customer")
        .populate("cartitems.sku");
    //ensure order items include atleast 1 sku
    if (cart.cartitems.length === 0) {
      return res.status(400).json({ message: "No items in cart" });
    }
    //loop through order items and perform operations
    await Promise.all(
      cart.cartitems.map(async (item) => {
        let orderitem = {};
        //check if sku id is valid
        if (!mongoose.Types.ObjectId.isValid(item.sku._id)) {
          throw new Error("Invalid SKU ID");
        }
        //get sku
        skus = await skuModel.aggregate([
          {$match:{_id:item.sku._id}}
        ])
        sku=skus[0]
        //if invalid sku return error
        if (!sku) {
          throw new Error("Specified SKU could not be found for the selected address");
        }
        //Quantity Rule Validations
        await skuRules.validateSkuQuantityRules(sku, item.quantity);

        //Inventory Operations
        //check if inventory for particular sku exists
        if (!sku.inventory[0]) {
          throw new Error("No inventory for selected sku");
        }
        //check if inventory gte booked qty
        if (!sku.inventory[0] >= item.quantity) {
          throw new Error("OOS for selected territory");
        }
        //assign sku to order item
        orderitem.sku = sku;
        orderitem.selectedInventoryIndex = 0;
        orderitem.quantity = {};
        orderitem.quantity.booked = item.quantity;
        //capture territory information
        orderitem.quantity.territory = sku.inventory[0].territory;
        //set default status
        orderitem.status = "Booked";
        orderitems.push(orderitem);
      })
    );
    order = await orderModel
      .create({
        customer: customer,
        amount: amount,
        payment: payments,
        orderitems: orderitems,
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: err.message });
      });
    if (order) {
      cart.cartitems = [];
      cart.save();
    }
    order = await order.calculateTotals();
    return res.json({ data: order });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  addtoCart,
  checkout,
  getSelfCart,
};

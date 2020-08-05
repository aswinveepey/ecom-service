const mongoose = require("mongoose");
const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const skuModel = require("../models/sku");
const skuRules = require("../services/orderValidations")
const territoryMappingService = require("../services/territoryMappingService")
const inventoryService = require("../services/inventoryService");

// add items to cart
// create cart if not exists

async function getSelfCart(req, res) {
  try {
    customer = req.customer;
    if(!customer) throw new Error("Customer Not Found");
    cart = await cartModel
      .findOne({ customer: customer._id })
      // .populate("cartitems.sku")
      .lean();
    return res.json({ data: cart });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

async function addtoCart(req, res) {
  try {
    customer = req.customer;
    var { sku, quantity } = req.body;
    
    //validate customer
    if(!customer) throw new Error("Customer Not Found");
    //validate SKU
    if (!mongoose.Types.ObjectId.isValid(sku)) throw new Error("Invalid SKU ID provided")
    
    //fetch sku data
    skuData = await skuModel.findOne({ _id: sku, status: true });

    // validate sku data
    if (!skuData) throw new Error("SKU OOS or inactive");
    
    //Validate quantity rules
    await skuRules.validateSkuQuantityRules(skuData, quantity)
    
    // Update Cart
    cart = await cartModel.findOneAndUpdate(
      { customer: customer._id },
      {
        $set: { customer: customer._id },
        $pull: { cartitems: { sku: skuData._id } },
      },
      { upsert: true, new: true }
    );
    cart.cartitems.push({ sku: skuData._id, quantity: quantity });
    await cart.save();
    return res.json({ data: cart, message:"Cart item added succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

async function checkout(req, res) {
  try {
    auth = req.auth._id;

    let amount = {
      amount: 0,
      discount: 0,
      totalamount: 0,
      installation: 0,
      shipping: 0,
    };
    let orderitems = [];
    let payments = [];
    let territoriesArray = [];
    let territoryQuery = {};
    
    currentCustomer = req.customer;
    if(!currentCustomer) throw new Error("Customer Not Found");
    
    //assign customer to customer.customer
    customer = {}; //if not passed through request body
    customer.customer = currentCustomer;
    customer.deliveryaddress = customer.deliveryaddress || currentCustomer.address[currentCustomer.currentaddressindex];
    customer.billingaddress = customer.billingaddress || currentCustomer.address[currentCustomer.currentaddressindex];

    const territories = await territoryMappingService.mapPincodeToTerritory(
      customer.deliveryaddress.pincode
    );

    territoriesArray = territories?.map((t) => mongoose.Types.ObjectId(t._id));

    //assign territory query if territories
    if (territoriesArray.length > 0) {
      territoryQuery = { "inventory.territory": { $in: territoriesArray } };
    }
    console.log(customer);
    cart = await cartModel
      .findOne({
        "customer": mongoose.Types.ObjectId(customer.customer._id),
      })
      .populate("customer")
      .populate("cartitems.sku");
    //ensure order items include atleast 1 sku
    if (cart.cartitems.length === 0) {
      throw new Error("No items in cart");
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
          {
            $match: {
              $and: [
                { _id: mongoose.Types.ObjectId(item.sku._id) },
                territoryQuery,
                { "inventory.status": true },
              ],
            },
          },
        ]);
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
        orderitem.quantity = {};
        orderitem.quantity.booked = item.quantity;
        //capture territory information
        orderitem.quantity.territory = mongoose.Types.ObjectId(sku.inventory[0].territory);
        //set default status
        orderitem.status = "Booked";
        orderitems.push(orderitem);
        //reduce inventory
        await inventoryService.reduceInventory(
          sku,
          orderitem.quantity.territory,
          orderitem.quantity.booked
        );
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
    if(order){
      cart.cartitems = [];
      cart.save();
    }
    order = await order.calculateTotals();
    return res.json({ data: order, message:"Succesfully Placed the order" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  addtoCart,
  checkout,
  getSelfCart,
};

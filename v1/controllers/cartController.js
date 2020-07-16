const mongoose = require("mongoose");
const orderModel = require("../models/order");
const customerModel = require("../models/customer");
const cartModel = require("../models/cart");
const skuModel = require("../models/sku");

// add items to cart
// create cart if not exists

async function getSelfCart(req, res){
  try {
    auth = req.auth._id;
    customer = await customerModel.findOne({ auth: auth._id });
    !customer && res.status(400).json({ message: "Customer Not Found" });
    cart = await cartModel
      .findOne({ customer: customer._id })
      .populate("cartitems.sku").lean();
    return res.json({ data: cart });  
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}

async function addtoCart(req, res) {
  try {
    auth = req.auth._id;
    var { sku, quantity } = req.body;
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
    cart.cartitems.push({ sku: sku, quantity: quantity });
    cart.save();
    return res.json({ data: cart });
  } catch (error) {
    res.status(400).json({ message: error });
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
      shipping:0,
    };
    let orderitems = [];
    let payments = [];
    currentCustomer = await customerModel.findOne({ auth: auth._id });
    !currentCustomer && res.status(400).json({ message: "Customer Not Found" });
    //assign customer to customer.customer
    customer.customer = currentCustomer;
    customer.deliveryaddress = currentCustomer.address[0];
    customer.billingaddress = currentCustomer.address[0];
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
        sku = await skuModel
          .findById(item.sku._id)
          .populate("inventory")
          .lean()
          .catch((err) => console.log(err));
        //if invalid sku return error
        if (!sku) {
          throw new Error("Specified SKU could not be found");
        }
        //Booked Quantity Validations
        //min qty rule
        if (!(item.quantity >= sku.quantityrules.minorderqty)) {
          throw new Error(
            `Quantity should be greater than or equal ${sku.quantityrules.minorderqty}`
          );
        }
        //min qty step rule
        if (
          sku.quantityrules.minorderqtystep &&
          sku.quantityrules.minorderqty != 0 &&
          !(item.quantity % sku.quantityrules.minorderqty === 0)
        ) {
          throw new Error("Minimum order qty multiples rules violated");
        }
        // max qty rule
        if (
          sku.quantityrules.maxorderqty != 0 &&
          item.quantity > sku.quantityrules.maxorderqty
        ) {
          throw new Error(
            `Quantity should be lesser than ${sku.quantityrules.maxorderqty}`
          );
        }
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
        // return res.status(400).json({ message: err });
      });
    if(order){
      cart.cartitems = [];
      cart.save();
    }
    order = await order.calculateTotals();
    return res.json({ data: order });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error });
  }
}

module.exports = {
  addtoCart,
  checkout,
  getSelfCart,
};

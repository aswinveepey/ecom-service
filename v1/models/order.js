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
      required: true,
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
          default: 0,
        },
        discount: {
          type: Double,
          required: true,
          default: 0,
        },
        totalamount: {
          type: Double,
          required: true,
          default: 0,
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
      default: 0,
    },
    discount: {
      type: Double,
      required: true,
      default: 0,
    },
    totalamount: {
      type: Double,
      required: true,
      default: 0,
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

orderSchema.methods.calculateTotals= async function(){
  const order = this;
  let Orderamount = 0
  let Ordertotalamount = 0
  let Ordershipping = 0
  let Orderinstallation = 0
  await this.orderitems.map(item=>{
    itemamount = item.sku.price.sellingprice 
                            * (item.quantity.delivered 
                              ||item.quantity.shipped 
                              ||item.quantity.confirmed 
                              ||item.quantity.booked);
    itemdiscount = item.sku.price.discount 
                            * (item.quantity.delivered 
                              ||item.quantity.shipped 
                              ||item.quantity.confirmed 
                              ||item.quantity.booked)
    itemtotalamount = itemdiscount ? (itemamount - itemdiscount) : itemamount;
    itemshipping = item.sku.price.shippingcharges 
                            * (item.quantity.shipped 
                              ||item.quantity.confirmed 
                              ||item.quantity.booked);
    iteminstallation = item.sku.price.installationcharges 
                            * (item.quantity.delivered 
                              || item.quantity.shipped 
                              || item.quantity.confirmed 
                              || item.quantity.booked);
    item.amount = item.amount || {};
    item.amount.amount = itemamount;
    item.amount.discount = itemdiscount || 0;
    item.amount.totalamount = itemtotalamount;
    //increment order amounts
    Orderamount += itemtotalamount;
    Ordershipping += itemshipping;
    Orderinstallation += iteminstallation;
  })
  //calculate order total amounts
  order.amount.amount = Orderamount
  order.amount.shipping = order.amount.shipping || Ordershipping;
  order.amount.installation = order.amount.installation || Orderinstallation;
  Ordertotalamount = Orderamount - order.amount.discount;
  order.amount.totalamount = Ordertotalamount
  await order.save()
  return order
}

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
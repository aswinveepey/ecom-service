const mongoose = require("mongoose");
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
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      shortid: {
        type: String,
      },
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
      },
      type: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
      },
      birthday: {
        type: Date,
      },
      contactnumber: {
        type: String,
      },
      auth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
      },
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
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
      sku: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        shortid: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
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
              min: 0,
            },
            installationcharges: {
              type: Double,
              required: true,
              min: 0,
            },
            status: {
              type: Boolean,
              required: true,
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
            min: 0,
          },
          installationcharges: {
            type: Double,
            required: true,
            min: 0,
          },
        },
        bulkdiscount: {
          threshold: {
            type: mongoose.Schema.Types.Number,
            required: true,
            min: 0,
          },
          discount: {
            type: Double,
            required: true,
            min: 0,
          },
        },
        quantityrules: {
          minorderqty: {
            type: mongoose.Schema.Types.Number,
            required: true,
            min: 0,
          },
          minorderqtystep: {
            type: Boolean,
            required: true,
          },
          maxorderqty: {
            type: mongoose.Schema.Types.Number,
            required: true,
            min: 0,
          },
        },
        status: {
          type: Boolean,
          required: true,
        },
      },
      inventory: {
        territory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Territory",
          required: true,
        },
        quantity: {
          type: mongoose.Schema.Types.Number,
          required: true,
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
          min: 0,
        },
        installationcharges: {
          type: Double,
          required: true,
          min: 0,
        },
        status: {
          type: Boolean,
          required: true,
        },
      },
      quantity: {
        booked: {
          type: mongoose.Schema.Types.Number,
          required: true,
          min: 0,
        },
        confirmed: {
          type: mongoose.Schema.Types.Number,
          min: 0,
        },
        shipped: {
          type: mongoose.Schema.Types.Number,
          min: 0,
        },
        delivered: {
          type: mongoose.Schema.Types.Number,
          min: 0,
        },
        returned: {
          type: mongoose.Schema.Types.Number,
          min: 0,
        },
        territory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Territory",
          required: true,
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
        enum: ["Online", "Bank", "COD", "Other"],
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

orderSchema.methods.calculateTotals = async function () {
  const order = this;
  let Orderamount = 0;
  let Ordertotalamount = 0;
  let Ordershipping = 0;
  let Orderinstallation = 0;
  await this.orderitems
    .filter((item) => item.status !== "Cancelled")
    .map((item) => {
      itemamount =
        item.sku.inventory[0].sellingprice *
        (item.quantity.delivered ||
          item.quantity.shipped ||
          item.quantity.confirmed ||
          item.quantity.booked);
      itemdiscount =
        item.sku.inventory[0].discount *
        (item.quantity.delivered ||
          item.quantity.shipped ||
          item.quantity.confirmed ||
          item.quantity.booked);
      itemtotalamount = itemdiscount ? itemamount - itemdiscount : itemamount;
      itemshipping =
        item.sku.inventory[0].shippingcharges *
        (item.quantity.shipped ||
          item.quantity.confirmed ||
          item.quantity.booked);
      iteminstallation =
        item.sku.inventory[0].installationcharges *
        (item.quantity.delivered ||
          item.quantity.shipped ||
          item.quantity.confirmed ||
          item.quantity.booked);
      item.amount = item.amount || {};
      item.amount.amount = itemamount;
      item.amount.discount = itemdiscount || 0;
      item.amount.totalamount = itemtotalamount;
      //increment order amounts
      Orderamount += itemtotalamount;
      Ordershipping += itemshipping;
      Orderinstallation += iteminstallation;
    });
  //calculate order total amounts
  order.amount.amount = Orderamount;
  order.amount.shipping = order.amount.shipping || Ordershipping;
  order.amount.installation = order.amount.installation || Orderinstallation;
  Ordertotalamount = Orderamount - order.amount.discount;
  order.amount.totalamount = Ordertotalamount;
  await order.save();
  return order;
};

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;

async function getOrderItemDump(req, res) {
  try {
    const db = req.db;
    const orderModel = await db.model("Order");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const orderitems = await orderModel.aggregate([
      { $match: { createdat: { $gte: startDate, $lte: endDate } } },
      { $unwind: "$orderitems" },
      {
        $lookup: {
          from: "products",
          localField: "orderitems.sku.product",
          foreignField: "_id",
          as: "orderitems.sku.product",
        },
      },
      { $unwind: "$orderitems.sku.product" },
      {
        $project: {
          _id: 0,
          itemorderid: "$shortid",
          orderitemid: "$orderitems.shortid",
          customerid: "$customer.customer.shortid",
          customername: {
            $concat: [
              "$customer.customer.firstname",
              " ",
              "$customer.customer.lastname",
            ],
          },
          skuid: "$orderitems.sku.shortid",
          skuname: {
            $concat: [
              "$orderitems.sku.product.name",
              " - ",
              "$orderitems.sku.name",
            ],
          },
          skucategoryid: "$orderitems.sku.product.category",
          skubrandid: "$orderitems.sku.product.brand",
          skumrp: "$orderitems.sku.price.mrp",
          skudiscount: "$orderitems.sku.price.discount",
          skusellingprice: "$orderitems.sku.price.sellingprice",
          skupurchaseprice: "$orderitems.sku.price.purchaseprice",
          skushippingcharges: "$orderitems.sku.price.shippingcharges",
          skuinstallationcharges: "$orderitems.sku.price.installationcharges",
          skubulkthreshold: "$orderitems.sku.bulkdiscount.threshold",
          skubulkdiscount: "$orderitems.sku.bulkdiscount.discount",
          skuminorderqty: "$orderitems.sku.quantityrules.minorderqty",
          skuminorderqtymultiples:
            "$orderitems.sku.quantityrules.minorderqtystep",
          skumaxorderqty: "$orderitems.sku.quantityrules.maxorderqty",
          itemquantitybooked: "$orderitems.quantity.booked",
          itemquantityconfirmed: "$orderitems.quantity.confirmed",
          itemquantityshipped: "$orderitems.quantity.shipped",
          itemquantitydelivered: "$orderitems.quantity.delivered",
          itemquantityreturned: "$orderitems.quantity.returned",
          itemterritoryid: "$orderitems.quantity.territory",
          itemamount: "$orderitems.amount.amount",
          itemdiscount: "$orderitems.amount.discount",
          itemtotalamount: "$orderitems.amount.totalamount",
          itemstatus: "$orderitems.status",
          itemorderdate: "$orderitems.orderdate",
        },
      },
    ]);

    return res.json({ data: orderitems });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}
async function getCustomerDump(req, res) {
  try {
    const db = req.db;
    const customerModel = await db.model("Customer");

    const customers = await customerModel.aggregate([
      {
        $lookup: {
          from: "auths",
          localField: "auth",
          foreignField: "_id",
          as: "auth",
        },
      },
      { $unwind: "$auth" },
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "account",
        },
      },
      { $unwind: "$account" },
      {
        $project: {
          _id: 0,
          customerid: "$shortid",
          accountid: "$account._id",
          firstname: "$firstname",
          lastname: "$lastname",
          accountname: "$account.name",
          username: "$auth.username",
          email: "$auth.email",
          mobilenumber: "$auth.mobilenumber",
          type: "$type",
          gender: "$gender",
          birthday: "$birthday",
          contactnumber: "$contactnumber",
          accounttype: "$account.type",
          gstin: "$account.gstin",
          status: "$auth.status",
          createdat: "$createdat",
        },
      },
    ]);

    return res.json({ data: customers });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function getInventoryDump(req, res) {
  try {
    const db = req.db;
    const skuModel = await db.model("Sku");

    const skus = await skuModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "product.category",
        },
      },
      { $unwind: "$product.category" },
      {
        $lookup: {
          from: "brands",
          localField: "product.brand",
          foreignField: "_id",
          as: "product.brand",
        },
      },
      {
        $unwind: { path: "$product.brand", preserveNullAndEmptyArrays: true },
      },
      { $unwind: "$inventory" },
      {
        $lookup: {
          from: "territories",
          localField: "inventory.territory",
          foreignField: "_id",
          as: "inventory.territory",
        },
      },
      { $unwind: "$inventory.territory" },
      {
        $group: {
          _id: "$inventory._id",
          productid: { $first: "$product.shortid" },
          productname: { $first: "$product.name" },
          skuid: { $first: "$shortid" },
          skuname: { $first: "$name" },
          categoryname: { $first: "$product.category.name" },
          brandname: { $first: "$product.brand.name" },
          territoryid: { $first: "$inventory.territory._id" },
          territoryname: { $first: "$inventory.territory.name" },
          quantity: { $first: "$inventory.quantity" },
          mrp: { $first: "$inventory.mrp" },
          purchaseprice: { $first: "$inventory.purchaseprice" },
          sellingprice: { $first: "$inventory.sellingprice" },
          discount: { $first: "$inventory.discount" },
          shippingcharges: { $first: "$inventory.shippingcharges" },
          installationcharges: { $first: "$inventory.installationcharges" },
          status: { $first: "$inventory.status" },
        },
      },
    ]);

    return res.json({ data: skus });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function getSkuDump(req, res){
  try {
    const db = req.db;
    const skuModel = await db.model("Sku");

    skus = await skuModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "product.category",
        },
      },
      { $unwind: "$product.category" },
      {
        $lookup: {
          from: "brands",
          localField: "product.brand",
          foreignField: "_id",
          as: "product.brand",
        },
      },
      {
        $unwind: { path: "$product.brand", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          skuid: "$shortid",
          productid: "$product.shortid",
          productname: "$product.name",
          skuname: "$name",
          category: "$product.category.name",
          brand: "$product.brand.name",
          mrp: "$price.mrp",
          discount: "$price.discount",
          sellingprice: "$price.sellingprice",
          purchaseprice: "$price.purchaseprice",
          shippingcharges: "$price.shippingcharges",
          installationcharges: "$price.installationcharges",
          bulkdiscountthreshold: "$bulkdiscount.threshold",
          bulkdiscount: "$bulkdiscount.discount",
          minorderqty: "$quantityrules.minorderqty",
          minorderqtystep: "$quantityrules.minorderqtystep",
          maxorderqty: "$quantityrules.maxorderqty",
          status: "$status",
          createdat: "$createdat",
        },
      },
    ]);

    return res.json({ data: skus });

  } catch (error) {
    console.log(error)
    return res.status(400).json({error:error.message})
  }
}
async function getProductDump(req, res){
  try {
    const db = req.db;
    const productModel = await db.model("Product");

    products = await productModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: { path: "$brand", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          productid: "$shortid",
          name: "$name",
          categoryname: "$category.name",
          categoryid: "$category._id",
          brandname: "$brand.name",
          brandid: "$brand._id",
          storagetype: "$storage.storagetype",
          shelflife: "$storage.shelflife",
          deadweight: "$logistics.deadweight",
          volumetricweight: "$logistics.volumetricweight",
          hsncode: "$gst.hsncode",
          cgst: "$gst.cgst",
          sgst: "$gst.sgst",
          igst: "$gst.igst",
          createdat: "$createdat",
        },
      },
    ]);

    return res.json({ data: products });

  } catch (error) {
    console.log(error)
    return res.status(400).json({error:error.message})
  }
}

module.exports = {
  getOrderItemDump,
  getCustomerDump,
  getInventoryDump,
  getSkuDump,
  getProductDump,
};
const mongoose = require("mongoose");

async function bulkUploadInventory(req, res){
  try {
    const inventoryId = mongoose.Types.ObjectId(req.body["Inventory ID"]);
    const territoryId = mongoose.Types.ObjectId(req.body["Territory ID"]);
    const skuId = req.body["SKU ID"];
    const quantity = req.body["Quantity"];
    const mrp = req.body["MRP"];
    const purchaseprice = req.body["Purchase Price"];
    const sellingprice = req.body["Selling Price"];
    const discount = req.body["Discount"];
    const shipping = req.body["Shipping"];
    const installation = req.body["Installation"];
    const status = req.body["Status"];

    const db = req.db;
    const skuModel = await db.model("Sku");

    if(inventoryId){
      await skuModel.updateOne(
        { shortid: skuId, "inventory._id": inventoryId },
        {
          $set: {
            "inventory.$.mrp": mrp,
            // "inventory.$.territoryId": mongoose.Types.ObjectId(territoryId),
            "inventory.$.quantity": quantity,
            "inventory.$.purchaseprice": purchaseprice,
            "inventory.$.sellingprice": sellingprice,
            "inventory.$.discount": discount,
            "inventory.$.shipping": shipping,
            "inventory.$.installation": installation,
            "inventory.$.status": status,
          },
        }
      );
    } else {
    await skuModel.updateOne(
        { shortid: skuId },
        {
          $push: {
            inventory: {
              mrp: mrp,
              territory: mongoose.Types.ObjectId(territoryId),
              quantity: quantity,
              purchaseprice: purchaseprice,
              sellingprice: sellingprice,
              discount: discount,
              shipping: shipping,
              installation: installation,
              status: status,
            },
          },
        }
      );
    }

    // console.log(req.body)
    return res.json({ status: "succesful" });
  } catch (error) {
    //do not user error to correspond to error message - use message instead
    return res.status(400).json({message:error.message})
  }
}
async function bulkUploadSku(req, res){
  try {
    const skuId = req.body["SKU ID"];
    const productId = req.body["Product ID"];
    const skuName = req.body["SKU Name"];
    const mrp = req.body["MRP"];
    const discount = req.body["Discount"];
    const sellingPrice = req.body["Selling Price"];
    const purchasePrice = req.body["Purchase Price"];
    const shipping = req.body["Shipping"];
    const installation = req.body["Installation"];
    const bulkThreshold = req.body["Bulk Discount Threshold"];
    const bulkDiscount = req.body["Bulk Discount"];
    const minOrderQty = req.body["Min Order Qty"];
    const minOrderQtyStep = req.body["Min Order Qty Multiples"];
    const maxOrderQty = req.body["Max Order Qty"];
    const status = req.body["Status"];
    
    const db = req.db;
    const skuModel = await db.model("Sku");
    const productModel = await db.model("Product");
    
    const product = await productModel.findOne({shortid:productId}).lean()
    if(!product) throw new Error("Invalid Product")

    if (skuId?.trim()!=="") {
      await skuModel.updateOne(
        { shortid: skuId },
        {
          name: skuName,
          product: product._id,
          "price.mrp": mrp,
          "price.discount": discount,
          "price.sellingprice": sellingPrice,
          "price.purchaseprice": purchasePrice,
          "price.shipping": shipping,
          "price.installation": installation,
          "bulkdiscount.threshold": bulkThreshold,
          "bulkdiscount.discount": bulkDiscount,
          "bulkdiscount.discount": bulkDiscount,
          "quantityrules.minorderqty": minOrderQty,
          "quantityrules.minorderqtystep": minOrderQtyStep,
          "quantityrules.maxorderqty": maxOrderQty,
          status: status,
        }
      );
    } else {
      await skuModel.create({
        name: skuName,
        product: product._id,
        "price.mrp": mrp,
        "price.discount": discount,
        "price.sellingprice": sellingPrice,
        "price.purchaseprice": purchasePrice,
        "price.shipping": shipping,
        "price.installation": installation,
        "bulkdiscount.threshold": bulkThreshold,
        "bulkdiscount.discount": bulkDiscount,
        "bulkdiscount.discount": bulkDiscount,
        "quantityrules.minorderqty": minOrderQty,
        "quantityrules.minorderqtystep": minOrderQtyStep,
        "quantityrules.maxorderqty": maxOrderQty,
        status: status,
      });
    }
    
    return res.json({ status: "succesful" });

  } catch (error) {
    console.log(error)
    return res.status(400).json({message:error.message})
  }
}
async function bulkUploadProduct(req, res){
  try {
    const productId = req.body["Product ID"];
    const productname = req.body["Product Name"];
    const categoryId = req.body["Category ID"];
    const brandId = req.body["Brand ID"];
    const storageType = req.body["Storage Type"];
    const shelfLife = req.body["Shelf Life"];
    const deadweight = req.body["Deadweight"];
    const volumetricWeight = req.body["Volumetric Weight"];
    const hsncode = req.body["HSN Code"];
    const cgst = req.body["CGST"];
    const sgst = req.body["SGST"];
    const igst = req.body["IGST"];
    
    const db = req.db;
    const productModel = await db.model("Product");
    const categoryModel = await db.model("Category");
    const brandModel = await db.model("Brand");

    const category = await categoryModel.findOne({ _id: categoryId }).lean();
    if (!category) throw new Error("Invalid Category");

    const brand = await brandModel.findOne({ _id: brandId }).lean();
    if (!brand) throw new Error("Invalid Brand");

    if (productId?.trim()!=="") {
      await productModel.updateOne(
        { shortid: productId },
        {
          name: productname,
          category: category._id,
          brand: brand._id,
          "storage.storagetype": storageType,
          "storage.shelflife": shelfLife,
          "logistics.deadweight": deadweight,
          "logistics.volumetricweight": volumetricWeight,
          "gst.hsncode": hsncode,
          "gst.cgst": cgst,
          "gst.igst": igst,
          "gst.sgst": sgst,
        }
      );
    } else {
      await productModel.create({
        name: productname,
        category: category._id,
        brand: brand._id,
        "storage.storagetype": storageType,
        "storage.shelflife": shelfLife,
        "logistics.deadweight": deadweight,
        "logistics.volumetricweight": volumetricWeight,
        "gst.hsncode": hsncode,
        "gst.cgst": cgst,
        "gst.igst": igst,
        "gst.sgst": sgst,
      });
    }
    
    return res.json({ status: "succesful" });

  } catch (error) {
    console.log(error)
    return res.status(400).json({message:error.message})
  }
}
async function bulkUploadOrderItem(req, res){
  try {
    const orderId = req.body["Order ID"];
    const orderItemId = req.body["Order Item ID"];
    const confirmedQty = req.body["Confirmed Qty"];
    const shippedQty = req.body["Shipped Qty"];
    const deliveredQty = req.body["Delivered Qty"];
    const returnedQty = req.body["Returned Qty"];
    const status = req.body["Status"];
    
    const db = req.db;
    const orderModel = await db.model("Order");

    const order = await orderModel.findOneAndUpdate(
      { shortid: orderId, "orderitems.shortid": orderItemId },
      {
        $set: {
          "orderitems.$.quantity.confirmed": confirmedQty,
          "orderitems.$.quantity.shipped": shippedQty,
          "orderitems.$.quantity.delivered": deliveredQty,
          "orderitems.$.quantity.returned": returnedQty,
          "orderitems.$.status": status,
        },
      },
      { new: true }
    );

    if(!order) throw new Error("Invalid Order ID")
    
    await order.calculateTotals();

    return res.json({ status: "succesful" });

  } catch (error) {
    console.log(error)
    return res.status(400).json({message:error.message})
  }
}

module.exports = {
  bulkUploadInventory,
  bulkUploadSku,
  bulkUploadProduct,
  bulkUploadOrderItem,
};

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

    console.log(mrp)
    sku = await skuModel.updateOne(
      { shortid: skuId, "inventory._id": inventoryId },
      {
        $set: {
          "inventory.$.mrp": mrp,
          "inventory.$.territoryId": mongoose.Types.ObjectId(territoryId),
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

    // console.log(req.body)
    return res.json({ data: sku });
  } catch (error) {
    //do not user error to correspond to error message - use message instead
    return res.status(400).json({message:error.message})
  }
}

module.exports = {
  bulkUploadInventory,
};

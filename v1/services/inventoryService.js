const skuModel = require("../models/sku");

const reduceInventory = async (skuParam, territory, quantity) => {
  let sku = skuModel.findById(skuParam._id);
  if (!sku)
    throw new Error(
      "Issue encountered while retrieving sku for inventory reduction"
    );
  sku = await sku.updateOne(
    { _id: skuParam._id },
    {
      $inc: { "inventory.$[element].quantity": -quantity },
    },
    { arrayFilters: [{ "element.territory": territory }] }
  );
  return sku;
};
module.exports = { reduceInventory };

//validate qty rules of an sku
async function validateSkuQuantityRules(sku, quantity){
  //min order qty validations
  if (quantity < sku.quantityrules.minorderqty)
    throw new Error(
      `Quantity should be greater than ${sku.quantityrules.minorderqty}`
    );
  //max order qty validations
  if (quantity > sku.quantityrules.maxorderqty)
    throw new Error(
      `Quantity should be lesser than ${sku.quantityrules.maxorderqty}`
    );
  //min order qty multiples
  if (
    sku.quantityrules.minorderqty > 0 &&
    sku.quantityrules.minorderqtystep &&
    quantity % sku.quantityrules.minorderqty !== 0
  )
    throw new Error(
      `Quantity selected should be multiples of ${sku.quantityrules.minorderqty}`
    );
}

module.exports = { validateSkuQuantityRules };
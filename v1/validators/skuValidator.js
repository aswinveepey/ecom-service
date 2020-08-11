const { check } = require("express-validator");
/**
 * sku validations - make sure payload is sanitized for input
 */

const validateSku = [
  check("price.mrp").exists().isFloat({ min: 0 }),
  check("price.discount").optional({ nullable: true }).isFloat({ min: 0 }),
  check("price.sellingprice").exists().isFloat({ min: 0 }),
  check("price.purchaseprice").exists().isFloat({ min: 0 }),
  check("price.shippingcharges")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  check("price.installationcharges")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  check("inventory.*.mrp").exists().isFloat({ min: 0 }),
  check("inventory.*.discount")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  check("inventory.*.sellingprice").exists().isFloat({ min: 0 }),
  check("inventory.*.purchaseprice").exists().isFloat({ min: 0 }),
  check("inventory.*.shippingcharges")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  check("inventory.*.installationcharges")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
];

module.exports = {
  validateSku,
};
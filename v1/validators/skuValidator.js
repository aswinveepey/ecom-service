const { check } = require("express-validator");
/**
 * sku validations - make sure payload is sanitized for input
 */

const validateSku = [
  check("name").exists(),
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
  check("inventory.*.quantity").exists().isInt({ min: 0 }),
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
  check("inventory.*.status").optional({ nullable: true }).isBoolean(),
  check("bulkdiscount.discount")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  check("bulkdiscount.threshold")
    .optional({ nullable: true })
    .isInt({ min: 0 }),
  check("quantityrules.minorderqty")
    .optional({ nullable: true })
    .isInt({ min: 0 }),
  check("quantityrules.maxorderqty")
    .optional({ nullable: true })
    .isInt({ min: 0 }),
  check("quantityrules.minorderqtystep")
    .optional({ nullable: true })
    .isBoolean(),
  check("status").optional({ nullable: true }).isBoolean(),
];

module.exports = {
  validateSku,
};

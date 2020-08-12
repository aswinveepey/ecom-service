const { check } = require("express-validator");
/**
 * sku validations - make sure payload is sanitized for input
 */

const validateInventoryBulkUpload = [
  check("MRP").exists().isFloat({ min: 0 }),
  check("Quantity").exists().isInt({ min: 0 }),
  check("Discount").optional({ nullable: true }).isFloat({ min: 0 }),
  check("Selling Price").exists().isFloat({ min: 0 }),
  check("Purchase Price").exists().isFloat({ min: 0 }),
  check("Shipping").optional({ nullable: true }).isFloat({ min: 0 }),
  check("Installation").optional({ nullable: true }).isFloat({ min: 0 }),
  check("Status").optional({ nullable: true }).toBoolean(),
];

const validateSkuBulkUpload = [
  check("SKU Name").exists(),
  check("Product ID").exists(),
  check("MRP").exists().isFloat({ min: 0 }),
  check("Discount").optional({ nullable: true }).isFloat({ min: 0 }),
  check("Selling Price").exists().isFloat({ min: 0 }),
  check("Purchase Price").exists().isFloat({ min: 0 }),
  check("Shipping").optional({ nullable: true }).isFloat({ min: 0 }),
  check("Installation").optional({ nullable: true }).isFloat({ min: 0 }),
  check("Bulk Discount").optional({ nullable: true }).isFloat({ min: 0 }),
  check("Bulk Discount Threshold")
    .optional({ nullable: true })
    .isInt({ min: 0 }),
  check("Min Order Qty").optional({ nullable: true }).isInt({ min: 0 }),
  check("Min Order Qty Multiples").optional({ nullable: true }).toBoolean(),
  check("Max Order Qty").optional({ nullable: true }).isInt({ min: 0 }),
  check("Status").optional({ nullable: true }).toBoolean(),
];

module.exports = {
  validateInventoryBulkUpload,
  validateSkuBulkUpload,
};
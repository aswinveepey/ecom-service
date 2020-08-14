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
  // check("Product ID").exists(),
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
const validateProductBulkUpload = [
  check("Product Name").exists(),
  check("Category ID").exists(),
  check("Brand ID").exists(),
  check("Shelf Life").optional({ nullable: true }).isInt({ min: 0 }),
  check("Deadweight").exists().isFloat({ min: 0 }),
  check("Volumetric Weight").optional({ nullable: true }).isFloat({ min: 0 }),
  check("HSN Code").exists(),
  check("CGST").exists().isFloat({ min: 0 }),
  check("SGST").exists().isFloat({ min: 0 }),
  check("IGST").exists().isFloat({ min: 0 }),
];
const validateOrderItemBulkUpload = [
  check("Status")
    .exists()
    .isIn([
      "Booked",
      // "Cancelled",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Returned",
      "Partial Delivery",
    ]),
  check("Order ID").exists(),
  check("Order Item ID").exists(),
  check("Confirmed Qty").optional({ nullable: true }).isInt({ min: 0 }),
  check("Shipped Qty").optional({ nullable: true }).isInt({ min: 0 }),
  check("Delivered Qty").optional({ nullable: true }).isInt({ min: 0 }),
  check("Returned Qty").optional({ nullable: true }).isInt({ min: 0 }),
];

module.exports = {
  validateInventoryBulkUpload,
  validateSkuBulkUpload,
  validateProductBulkUpload,
  validateOrderItemBulkUpload,
};
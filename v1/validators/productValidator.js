const { check } = require("express-validator");
/**
 * sku validations - make sure payload is sanitized for input
 */

const validateProduct = [
  check("name").exists(),
  check("category").exists(),
  check("brand").exists(),
  check("storage.shelflife").optional({ nullable: true }),
  check("logistics.deadweight")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  check("logistics.volumetricweight")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  check("logistics.volumetricweight")
    .optional({ nullable: true })
    .isFloat({ min: 0 }),
  // check("gst.hsncode").optional({ nullable: true }).isFloat({ min: 0 }),
  check("gst.cgst").optional({ nullable: true }).isFloat({ min: 0 }),
  check("gst.sgst").optional({ nullable: true }).isFloat({ min: 0 }),
  check("gst.igst").optional({ nullable: true }).isFloat({ min: 0 }),
];

module.exports = {
  validateProduct,
};

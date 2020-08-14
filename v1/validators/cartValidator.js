const { check } = require("express-validator");
/**
 * cart validations - make sure payload is sanitized for input
 */

const validateAddToCart = [
  check("sku").exists(),
  check("quantity").exists().isInt({ min: 0 }),
];

module.exports = {
  validateAddToCart,
};
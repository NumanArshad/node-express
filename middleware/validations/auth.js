const { body } = require("express-validator");
const formatValidationMessages = require("../formatValidationMessages");

const validateLoginRequest = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
  formatValidationMessages,
];

const validateRegisterRequest = [
  body("username").notEmpty().withMessage("username is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 4 })
    .withMessage("password must have length 4"),
  formatValidationMessages,
];

module.exports = {
  validateLoginRequest,
  validateRegisterRequest,
};

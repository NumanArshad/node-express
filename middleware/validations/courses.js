const { body } = require("express-validator");
const formatValidationMessages = require("../formatValidationMessages");

const validateCreateUpdateCourse = [
  body("name")
    .notEmpty()
    .withMessage("course name is required")
    .isAlpha()
    .withMessage("Course name must be alphabetices"),
  formatValidationMessages,
];

module.exports = validateCreateUpdateCourse;

const { body } = require("express-validator");

exports.generateValidator = [
  body("content")
    .not()
    .isEmpty()
    .withMessage("Must provide some content")
    .trim()
    .escape(),
];
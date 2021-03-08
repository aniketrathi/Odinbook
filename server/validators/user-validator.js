const { body, check } = require("express-validator");

exports.generateValidator = [
  check("firstName").notEmpty().escape(),
  check("lastName").notEmpty().escape(),
  check("email").normalizeEmail().isEmail(),
  body(
    "password",
    "Password must include one lowercase character, one uppercase character, a number, and a special character."
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check("confirmPassword").custom((value, { req }) => {
    const { password } = req.body;
    if (value !== password) {
      throw new Error("Password Confirmation does not match password");
    }
    return true;
  }),
];

exports.generateValidatorUpdate = [
  check("firstName").notEmpty().escape(),
  check("lastName").notEmpty().escape(),
  check("email").normalizeEmail().isEmail(),
  body(
    "password",
    "Password must include one lowercase character, one uppercase character, a number, and a special character."
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
];

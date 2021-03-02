const bcrypt = require("bcryptjs");
const env = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const passport = require("passport");

const User = require("../models/user");

env.config();

const router = express.Router();

const auth_validator = require("../validators/user-validator");

/// SIGNUP ROUTE ///
router.post("/", auth_validator.generateValidator, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errorMessage: errors.array() });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errorMessage: "Username exists!" });
    }

    // Hash password //
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      passwordHash,
      firstName,
      lastName,
    });
    const savedUser = await user.save();

    /// sign the token ///
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    /// send a token in a HTTP-only cookie ///
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(401)
        .json({ errorMessage: "Wrong username or password!" });
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res
        .status(401)
        .json({ errorMessage: "Wrong username or password!" });

    /// sign the token ///
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    /// send a token in a HTTP-only cookie ///
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post(
  "/facebook",
  passport.authenticate("facebookToken", { session: false }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        {
          user: req.user._id,
        },
        process.env.JWT_SECRET
      );
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send();
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

router.get("/loggedin", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);
    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

module.exports = router;

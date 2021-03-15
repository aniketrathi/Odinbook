const bcrypt = require("bcryptjs");
const env = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../models/user");

env.config();

const router = express.Router();

/// SIGNUP ROUTE ///
router.post("/", async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    let { photo } = req.body;
    if (email === "" || firstName === "" || lastName === "") {
      return res.status(400).json({ errorMessage: "Details Incomplete!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errorMessage: "Username exists!" });
    }

    if (password.length < 8) {
      return res.status(400).json({ errorMessage: "Weak Password!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ errorMessage: "Passwords doesn't match!" });
    }

    if (photo === "") {
      photo =
        "https://res.cloudinary.com/aniketrathi/image/upload/v1615195256/r6quzct3qv0sm9mq3pn9.jpg";
    }

    // Hash password //
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      passwordHash,
      firstName,
      lastName,
      friends: [],
      photo,
    });
    const savedUser = await user.save();

    /// sign the token ///
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.EXPIRED_TIME,
      }
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
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.EXPIRED_TIME,
      }
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
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.EXPIRED_TIME,
        }
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
    if (!token) return res.json({ status: false, user: NULL });
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      status: true,
      user: verified.user,
    });
  } catch (err) {
    res.json({ status: false, user: null });
  }
});

module.exports = router;

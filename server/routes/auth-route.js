const bcrypt = require("bcryptjs");
const env = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const User = require("../models/user");

env.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter,
}).single("photo");

/// SIGNUP ROUTE ///
router.post("/", async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    // const photo = "";
    // if (req.file !== undefined) {
    // const { filename } = req.file;
    // photo = filename;
    // }
    // upload(req, res, function (err) {
    //   if (err instanceof multer.MulterError) {
    //     res.status(400).json(err.code);
    //   } else if (err) {
    //     res.status(400).json("Generic error");
    //   }
    //   const { filename } = req.file;
    //   photo = filename;
    // });
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

    // Hash password //
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      passwordHash,
      firstName,
      lastName,
      friends: [],
      // photo,
      // fs.readFileSync(
      //   path.join(__dirname + "/images/" + filename)
      // ),
    });
    const savedUser = await user.save();

    /// sign the token ///
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 86400,
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
        expiresIn: 86400,
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
          expiresIn: 86400,
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
    if (!token) return res.json({status: false, user: NULL});
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      status: true,
      user: verified.user
    });
  } catch (err) {
    res.json({status: false, user: null});
  }
});

module.exports = router;

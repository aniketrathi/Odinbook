const express = require("express");
const { validationResult } = require("express-validator");

const check = require("../middlewares/auth-middleware").auth;
const User = require("../models/user");
const Post = require("../models/post");

const router = express.Router();

router.get("/users", check, (req, res) => {
  try {
    User.find()
      .lean()
      .populate("friends")
      .then((users) => {
        if (users.length === 0)
          res.status(404).json({
            message: "No users found",
          });
        res.json(users);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/users/:userid", check, (req, res) => {
  try {
    const { userid } = req.params;
    User.findById(userid)
      .populate("friends")
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "user not found",
          });
        }
        res.json(user);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/users/:userid", check, async (req, res) => {
  const { userid, password } = req.params;
  try {
    let hashedPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    const updatedData = { ...req.body };

    if (password) {
      delete updatedData.password;
      updatedData.password = hashedPassword;
    }

    const updateResult = await User.updateOne({ _id: userid }, updatedData);

    if (updateResult.nModified === 1) {
      return res.json({ ...updatedData, _id: userid });
    } else {
      res.status(500).json({
        message: "An internal error occurred.",
        details: ["Update result did not return 1."],
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/users/:userid/posts", check, async (req, res) => {
    const {userid} = req.params;
  try {
    Post.find({ author: userid })
      .sort({ timestamp: -1 })
      .populate("author")
      .then((posts) => {
        if (posts.length === 0) {
          return res.status(404).json({
            message: "No posts found.",
          });
        }
        return res.json(posts);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;

const express = require("express");

const check = require("../middlewares/auth-middleware").auth;
const User = require("../models/user");
const Post = require("../models/post");

const router = express.Router();

router.get("/posts", check, (req, res) => {
  try {
    Post.find()
      .lean()
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

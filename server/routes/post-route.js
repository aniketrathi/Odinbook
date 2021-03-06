const express = require("express");
const { validationResult } = require("express-validator");

const check = require("../middlewares/auth-middleware").auth;
const User = require("../models/user");
const Post = require("../models/post");
const postValidator = require("../validators/post-validator").generateValidator;
const updatePostValidator = require("../validators/post-validator").generateValidatorUpdate;

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

router.get("/posts/:postid", check, (req, res) => {
  const { postid } = req.params;
  try {
    Post.findById(req.params.postid)
      .lean()
      .populate("author")
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: "No post with such id found.",
          });
        }

        return res.json(post);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/posts", check, postValidator, async (req, res) => {
  const { content, timestamp } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Bad request.",
        details: errors.array(),
      });
    }

    const newPost = await new Post({
      content: content,
      author: req.user,
      timestamp: timestamp,
      likes: [],
    });

    const postResult = await newPost.save();
    return res.json(postResult);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/posts/:postid", check)

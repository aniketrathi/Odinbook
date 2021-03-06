const express = require("express");
const { validationResult } = require("express-validator");

const check = require("../middlewares/auth-middleware").auth;
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const commentValidator = require("../validators/comment-validator")
  .generateValidator;

const router = express.Router();

router.get("/posts/:postid/comments", check, (req, res) => {
  const { postid } = req.params;
  try {
    Comment.find({ post: postid })
      .populate("author")
      .populate("post")
      .then((comments) => {
        if (comments.length === 0) {
          return res.status(404).json({
            message: "Comments not found",
          });
        }
        return res.json(comments);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post(
  "/posts/:postid/comments",
  check,
  commentValidator,
  async (req, res) => {
    const { postid } = req.params;
    const { content } = req.body;
    try {
      const errors = await validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Bad request.",
          details: errors.array(),
        });
      }

      const commentPost = await Post.findById(postid);

      if (!commentPost) {
        return res.status(400).json({
          message: "Bad request.",
          details: ["Post ID provided does not return any posts."],
        });
      }

      const newComment = new Comment({
        content: content,
        author: req.user,
        post: postid,
      });

      const commentResult = await newComment.save();
      return res.json(commentResult);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);

router.put(
  "/posts/:postid/comments/:commentid",
  check,
  commentValidator,
  async (req, res) => {
    const { commentid } = req.params;
    try {
      const errors = await validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Bad request.",
          details: errors.array(),
        });
      }

      const updatedData = { ...req.body };

      await Comment.updateOne({ _id: commentid }, updatedData).then(
        (updateResult) => {
          if (updateResult.nModified !== 1) {
            throw new Error("Update result did not return nModified as 1");
          }

          return res.json({ ...updatedData, _id: commentid });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);

router.delete("/posts/:postid/comments/:commentid", check, async (req, res) => {
  const { commentid } = req.params;
  try {
    const deleteResult = await Comment.deleteOne({ _id: commentid });

    if (deleteResult.deletedCount === 1) {
      return res.json({ _id: commentid });
    } else {
      res.status(500).json({
        message: "An internal error occurred.",
        details: ["Deleted count did not return 1."],
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;

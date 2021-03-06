const express = require("express");
const { validationResult } = require("express-validator");

const check = require("../middlewares/auth-middleware").auth;
const User = require("../models/user");
const Post = require("../models/post");
const postValidator = require("../validators/post-validator").generateValidator;
const updatePostValidator = require("../validators/post-validator")
  .generateValidatorUpdate;

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
    Post.findById(postid)
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

router.put("/posts/:postid", check, updatePostValidator, async (req, res) => {
  const { postid } = req.params;
  try {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Bad request.",
        details: errors.array(),
      });
    }

    const updatedData = { ...req.body };

    Post.updateOne({ _id: postid }, updatedData).then((updateResult) => {
      if (updateResult.nModified !== 1) {
        throw new Error("Update result did not return nModified as 1");
      }

      return res.json({ ...updatedData, _id: postid });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.delete("/posts/:postid", check, async (req, res) => {
  const { postid } = req.params;
  try {
    const deleteResult = await Post.deleteOne({ _id: postid });

    if (deleteResult.deletedCount === 1) {
      return res.json({ _id: postid });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/posts/:postid/like", check, (req, res) => {
  const { postid } = req.params;
  const { _id } = req.body;
  try {
    if (!_id) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["Missing user ID."],
      });
    }

    Post.findById(postid).then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Post not found.",
        });
      }

      const likes = [...post.likes];
      const foundUser = likes.find((user) => user.toString() === _id);

      if (foundUser !== undefined) {
        return res.status(403).json({
          message: "Forbidden",
          details: ["User has already liked the post."],
        });
      }

      likes.push(_id);

      Post.updateOne({ _id: postid }, { likes })
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          throw err;
        });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/posts/:postid/dislike", check, (req, res) => {
  const { postid } = req.params;
  const { _id } = req.body;
  try {
    if (!_id) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["Missing user ID."],
      });
    }

    Post.findById(postid).then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Post not found.",
        });
      }

      if (post.likes.indexOf(_id) === -1) {
        return res.status(403).json({
          message: "Forbidden",
          details: ["User has not liked the post before."],
        });
      }

      const likes = [...post.likes].filter(
        (user) => user._id.toString() !== _id
      );

      Post.updateOne({ _id: postid }, { likes })
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          throw err;
        });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;

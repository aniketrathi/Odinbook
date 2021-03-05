const express = require("express");
const { validationResult } = require("express-validator");

const check = require("../middlewares/auth-middleware").auth;
const User = require("../models/user");
const Post = require("../models/post");
const FriendRequest = require("../models/friend-request");

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
  const { userid } = req.params;
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

// To show all requests //
router.get("/users/:userid/friendrequests", check, async (req, res) => {
  const { userid } = req.params;
  try {
    FriendRequest.find({ receiver: userid })
      .lean()
      .populate("sender")
      .populate("receiver")
      .then((results) => {
        if (results.length === 0) {
          return res.status(404).json({
            message: "No requests found",
          });
        }
        return res.json(results);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// To accept the friend request //
router.put("/users/:userid/friend", check, async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["User id was not sent on request body"],
      });
    }

    const userToAdd = await User.findById(req.body._id);

    if (!userToAdd) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["ID sent on request body returns no user"],
      });
    }

    const userRequested = await User.findById(req.params.userid);

    if (userRequested.friends.indexOf(req.body._id) !== -1) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["User already has the requester ID on friend array."],
      });
    }

    userRequested.friends.push(req.body._id);

    const saveResult = userRequested.save();
    return res.json(saveResult);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/users/:userid/unfriend", check, async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["User id was not sent on request body"],
      });
    }

    const user = await User.findById(req.params.userid);

    if (!user) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["User does not exist."],
      });
    }

    user.friends = [...user.friends].filter(
      (friend) => friend.toString() !== req.body._id
    );

    const updateResult = await User.updateOne(
      { _id: req.params.userid },
      { friends: user.friends }
    );

    return res.json(updateResult);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;

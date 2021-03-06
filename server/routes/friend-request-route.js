const express = require("express");

const check = require("../middlewares/auth-middleware").auth;
const User = require("../models/user");
const FriendRequest = require("../models/friend-request");

const router = express.Router();

router.get("/friendrequests", check, (req, res) => {
  try {
    FriendRequest.find()
      .lean()
      .populate("sender")
      .populate("receiver")
      .then((results) => {
        if (results.length === 0) {
          return res.status(404).json({
            message: "No requests found.",
          });
        }

        return res.json(results);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/friendrequests/:requestid", check, (req, res) => {
  const { requestid } = req.params;
  try {
    FriendRequest.findById(requestid)
      .lean()
      .populate("sender")
      .populate("receiver")
      .then((request) => {
        if (!request) {
          return res.status(404).json({
            message: "Request not found.",
          });
        }

        return res.json(request);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/friendrequests", check, async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    if (!sender || !receiver) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["Sender or receiver not provided."],
      });
    }

    if (sender === receiver) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["Sender or receiver not provided."],
      });
    }

    const senderUser = await User.findById(req.body.sender);
    const receiverUser = await User.findById(req.body.receiver);

    if (!senderUser || !receiverUser) {
      return res.status(400).json({
        message: "Bad request.",
        details: ["The sender or receiver specified does not exist."],
      });
    }
    const newRequest = await new FriendRequest({
      sender,
      receiver,
    });
    const saveResult = await newRequest.save();

    return res.json(saveResult);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.delete("/friendrequests/:requestid", check, (req, res) => {
  const { requestid } = req.params;
  try {
    FriendRequest.deleteOne({ _id: requestid }).then((result) => {
      return res.json({ _id: requestid });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String },
  facebookId: { type: Number },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  photo: {
    type: String,
    default: "https://res.cloudinary.com/aniketrathi/image/upload/v1615195256/r6quzct3qv0sm9mq3pn9.jpg",
  },
});
//Export model
module.exports = mongoose.model("User", userSchema);

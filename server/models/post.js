const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
},{
  timestamps: true
});

//Export model
module.exports = mongoose.model("Post", postSchema);

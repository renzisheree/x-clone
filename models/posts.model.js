const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const postsSChema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pinned: Boolean,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },

  { timestamps: true }
);

var Posts = mongoose.model("Posts", postsSChema);

module.exports = Posts;

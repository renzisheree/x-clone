const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const postsSChema = new mongoose.Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pinned: Boolean,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    retweetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    retweetData: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
  },

  { timestamps: true }
);

var Posts = mongoose.model("Posts", postsSChema);

module.exports = Posts;

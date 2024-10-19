const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const user = require("./user.model");

const postsSChema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: user },
    pinned: Boolean,
  },

  { timestamps: true }
);

var posts = mongoose.model("posts", postsSChema);

module.exports = posts;

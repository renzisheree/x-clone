const Posts = require("../models/posts.model");
const User = require("../models/user.model");

exports.getPost = async (req, res, next) => {
  try {
    const posts = await Posts.find()
      .populate("postedBy")
      .sort({ createdAt: -1 });
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
exports.createPost = async (req, res, next) => {
  if (!req.body.content) {
    console.log("Content is not sending with the request");
    return res.sendStatus(400);
  }

  const postsData = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  try {
    const newPost = await Posts.create(postsData);
    const populatedPost = await User.populate(newPost, { path: "postedBy" });
    res.status(201).send(populatedPost);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

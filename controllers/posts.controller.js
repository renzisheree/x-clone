const posts = require("../models/posts.model");
const user = require("../models/user.model");

exports.getPost = async (req, res, next) => {};

exports.createPost = async (req, res, next) => {
  if (!req.body.content) {
    console.log("Content is not sending with the request");
    return res.sendStatus(400);
  }
  var postsData = {
    content: req.body.content,
    postedBy: req.session.user,
  };
  posts
    .create(postsData)
    .then(async (newPost) => {
      newPost = await user.populate(newPost, { path: "postedBy" });
      res.status(201).send(newPost);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
};

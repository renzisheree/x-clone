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
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user._id;

    const isLiked =
      req.session.user.likes && req.session.user.likes.includes(postId);
    const option = isLiked ? "$pull" : "$addToSet";

    // Update user's likes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        [option]: { likes: postId },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.sendStatus(404);
    }

    req.session.user = updatedUser;

    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      {
        [option]: { likes: userId },
      },
      { new: true }
    ).populate("postedBy");

    if (!updatedPost) {
      return res.sendStatus(404);
    }

    res.status(200).send(updatedPost);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "An error occurred", error: error.message });
  }
};
exports.retweetPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user._id;

    // Try to delete the retweet
    let deletedPost;
    try {
      deletedPost = await Posts.findOneAndDelete({
        postedBy: userId,
        retweetData: postId,
      });
    } catch (error) {
      console.error("Error deleting retweet:", error);
      return res.sendStatus(500);
    }

    const option = deletedPost ? "$pull" : "$addToSet";

    let repost = deletedPost;
    if (!repost) {
      try {
        repost = await Posts.create({ postedBy: userId, retweetData: postId });
      } catch (error) {
        console.error("Error creating repost:", error);
        return res.sendStatus(500);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        [option]: { retweets: repost._id },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.sendStatus(404);
    }

    req.session.user = updatedUser;

    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      {
        [option]: { retweetUsers: userId },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.sendStatus(404);
    }

    res.status(200).send(updatedPost);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

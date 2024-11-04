const Posts = require("../models/posts.model");
const User = require("../models/user.model");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await getPosts({});

    res.status(200).send(posts);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "An error occurred while fetching posts." });
  }
};

exports.getPostPage = async (req, res, next) => {
  var payload = {
    pageTitle: "View Post",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params.id,
  };
  return res.status(200).render("postPage", payload);
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.id;
  var postData = await getPosts({ _id: postId });
  postData = postData[0];
  var results = {
    postData: postData,
  };
  if (postData.replyTo !== undefined) {
    results.replyTo = postData.replyTo;
  }
  results.replies = await getPosts({ replyTo: postId });
  return res.status(200).send(results);
};
exports.getPostPage = async (req, res, next) => {
  var payload = {
    pageTitle: "View Post",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params.id,
  };
  return res.status(200).render("postPage", payload);
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
  if (req.body.replyTo) {
    postsData.replyTo = req.body.replyTo;
  }

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

exports.deletePost = async (req, res, next) => {
  try {
    await Posts.findByIdAndDelete(req.params.id);
    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
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

const getPosts = async (filter) => {
  try {
    var posts = await Posts.find(filter)
      .populate("postedBy")
      .populate("retweetData")
      .populate("replyTo")
      .sort({ createdAt: -1 });
    posts = await User.populate(posts, {
      path: "replyTo.postedBy",
    });
    return await User.populate(posts, {
      path: "retweetData.postedBy",
    });
  } catch (err) {
    console.error(err);
  }
};

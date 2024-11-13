const Posts = require("../models/posts.model");
const User = require("../models/user.model");

exports.followUser = async (req, res, next) => {
  const userId = req.params.userId;
  var user = await User.findById(userId);
  if (user == null) return res.sendStatus(404);
  var isFollowing =
    user.followers && user.followers.includes(req.session.user._id);
  var option = isFollowing ? "$pull" : "$addToSet";
  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    {
      [option]: { following: userId },
    },
    { new: true }
  ).catch((e) => {
    console.log(e);
    res.sendStatus(400);
  });

  User.findByIdAndUpdate(userId, {
    [option]: { followers: req.session.user._id },
  }).catch((e) => {
    console.log(e);
    res.sendStatus(400);
  });

  res.status(200).send(req.session.user);
};

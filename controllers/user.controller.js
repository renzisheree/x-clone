const User = require("../models/user.model");
const path = require("path");
const fs = require("fs");
exports.followUser = async (req, res, next) => {
  try {
    var userId = req.params.userId;
    var user = await User.findById(userId);

    if (!user) return res.sendStatus(404);

    var isFollowing =
      user.followers && user.followers.includes(req.session.user._id);

    var option = isFollowing ? "$pull" : "$addToSet";

    // Update current user's following list
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id,
      { [option]: { following: userId } },
      { new: true }
    );

    // Update target user's followers list
    await User.findByIdAndUpdate(userId, {
      [option]: { followers: req.session.user._id },
    });

    // Update session
    req.session.user = updatedUser;

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const result = await User.findById(req.params.id).populate("followers");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
exports.getFollowing = async (req, res, next) => {
  try {
    const result = await User.findById(req.params.id).populate("following");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
exports.getFollowers = async (req, res, next) => {
  try {
    const result = await User.findById(req.params.id).populate("followers");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

exports.updateProfilePicture = async (req, res, next) => {
  if (!req.file) {
    console.log("no file uploaded ");
    return res.sendStatus(400);
  }

  var filePath = `/uploads/images/${req.file.filename}.png`;
  var tempPath = req.file.path;
  var targetPath = path.join(__dirname, `../${filePath}`);

  fs.rename(tempPath, targetPath, (err) => {
    if (err != null) {
      console.log(err);
      return res.sendStatus(400);
    }
  });

  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    {
      profilePic: filePath,
    },
    { new: true }
  );

  res.sendStatus(204);
};

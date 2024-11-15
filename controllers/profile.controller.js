const User = require("../models/user.model");

exports.getProfilePage = async (req, res, next) => {
  var payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  };
  res.status(200).render("profilePage", payload);
};
exports.getUserProfile = async (req, res, next) => {
  var payload = await getPayload(req.params.username, req.session.user);
  res.status(200).render("profilePage", payload);
};

exports.getUserReply = async (req, res, next) => {
  var payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "replies";

  res.status(200).render("profilePage", payload);
};

exports.getUserFollowingPage = async (req, res, next) => {
  var payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "following";

  res.status(200).render("followersAndFollowing", payload);
};
exports.getUserFollowersPage = async (req, res, next) => {
  var payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "followers";

  res.status(200).render("followersAndFollowing", payload);
};
async function getPayload(username, userLoggedIn) {
  var user = await User.findOne({ username: username });
  if (user == null) {
    var user = await User.findById(username);
    if (user == null) {
      return {
        pageTitle: "User not found",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
      };
    }
  }
  return {
    pageTitle: user.username,
    userLoggedIn: userLoggedIn,
    userLoggedInJs: JSON.stringify(userLoggedIn),
    profileUser: user,
  };
}

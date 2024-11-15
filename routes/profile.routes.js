const express = require("express");
const {
  getProfilePage,
  getUserProfile,
  getUserReply,
  getUserFollowersPage,
  getUserFollowingPage,
} = require("../controllers/profile.controller");

const router = express.Router();
router.get("/profile", getProfilePage);
router.get("/profile/:username", getUserProfile);
router.get("/profile/:username/replies", getUserReply);
router.get("/profile/:username/followers", getUserFollowersPage);
router.get("/profile/:username/following", getUserFollowingPage);

module.exports = router;

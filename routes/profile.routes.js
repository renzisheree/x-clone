const express = require("express");
const {
  getProfilePage,
  getUserProfile,
  getUserReply,
} = require("../controllers/profile.controller");

const router = express.Router();
router.get("/profile", getProfilePage);
router.get("/profile/:username", getUserProfile);
router.get("/profile/:username/replies", getUserReply);

module.exports = router;

const express = require("express");
const {
  getProfilePage,
  getUserProfile,
} = require("../controllers/profile.controller");

const router = express.Router();
router.get("/profile", getProfilePage);
router.get("/profile/:username", getUserProfile);

module.exports = router;

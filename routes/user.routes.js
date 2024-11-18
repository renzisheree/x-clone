const {
  followUser,
  getFollowers,
  getFollowing,
  updateProfilePicture,
} = require("../controllers/user.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");

const router = express.Router();

router.put("/api/users/:userId/follow", followUser);
router.get("/api/users/:id/followers", getFollowers);
router.get("/api/users/:id/following", getFollowing);
router.post(
  "/api/users/profilePicture",
  upload.single("croppedImage"),
  updateProfilePicture
);

module.exports = router;

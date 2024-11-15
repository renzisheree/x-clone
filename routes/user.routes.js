const {
  followUser,
  getFollowers,
  getFollowing,
} = require("../controllers/user.controller");

const express = require("express");

const router = express.Router();

router.put("/api/users/:userId/follow", followUser);
router.get("/api/users/:id/followers", getFollowers);
router.get("/api/users/:id/following", getFollowing);

module.exports = router;

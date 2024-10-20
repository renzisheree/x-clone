const express = require("express");
const {
  createPost,
  getPost,
  updatePost,
  retweetPost,
} = require("../controllers/posts.controller");
const router = express.Router();
router.get("/api/posts", getPost);

router.post("/api/posts", createPost);
router.put("/api/posts/:id/like", updatePost);
router.post("/api/posts/:id/retweet", retweetPost);

module.exports = router;

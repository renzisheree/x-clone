const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  retweetPost,
  getPostPage,
  deletePost,
  pinPost,
} = require("../controllers/posts.controller");
const router = express.Router();
router.get("/api/posts", getPosts);
router.get("/api/posts/:id", getPost);
router.get("/posts/:id", getPostPage);

router.post("/api/posts", createPost);
router.delete("/api/posts/:id", deletePost);
router.put("/api/posts/:id/like", updatePost);
router.put("/api/posts/:id/", pinPost);
router.post("/api/posts/:id/retweet", retweetPost);

module.exports = router;

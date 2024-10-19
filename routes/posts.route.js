const express = require("express");
const { createPost, getPost } = require("../controllers/posts.controller");
const router = express.Router();
router.get("/api/posts", getPost);

router.post("/api/posts", createPost);

module.exports = router;

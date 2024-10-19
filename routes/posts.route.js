const express = require("express");
const { createPost } = require("../controllers/posts.controller");
const router = express.Router();

router.post("/api/posts", createPost);

module.exports = router;

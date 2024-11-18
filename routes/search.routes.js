const express = require("express");
const {
  searchPage,
  searchPosts,
  searchUsers,
} = require("../controllers/search.controller");

const router = express.Router();

router.get("/search", searchPage);
router.get("/search/posts", searchPosts);
router.get("/search/users", searchUsers);
module.exports = router;

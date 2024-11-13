const { followUser } = require("../controllers/user.controller");

const express = require("express");

const router = express.Router();

router.put("/api/users/:userId/follow", followUser);

module.exports = router;

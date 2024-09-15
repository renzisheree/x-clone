const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user.model");

router.get("/", (req, res, next) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
});

module.exports = router;

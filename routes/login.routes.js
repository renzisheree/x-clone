const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user.model");

router.get("/", (req, res, next) => {
  res.status(200).render("login");
});
router.post("/", async (req, res, next) => {
  payload = req.body;
  if (req.body.logUsername && req.body.logPassword) {
    var user = await User.findOne({
      $or: [{ username: req.body.logUsername }, { email: req.body.email }],
    }).catch((error) => {
      console.log(error);
      payload.messageError = "Something went wrong";
      return res.status(200).render("login", payload);
    });

    if (user) {
      var result = await bcrypt.compare(req.body.logPassword, user.password);
      if (result) {
        req.session.user = user;
        return res.redirect("/");
      }
    }
    payload.errorMessage = "Invalid credentials";
    return res.status(200).render("login", payload);
  }

  payload.errorMessage = "Make sure each field has a valid value";
  return res.status(200).render("login", payload);
});
module.exports = router;

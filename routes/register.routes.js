const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
router.get("/", (req, res, next) => {
  res.status(201).render("register");
});
router.post("/", async (req, res, next) => {
  var firstName = req.body.firstName.trim();
  var lastName = req.body.lastName.trim();
  var username = req.body.username.trim();
  var email = req.body.email.trim();
  var password = req.body.password;
  var payload = req.body;
  if (firstName && lastName && username && email && password) {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((err) => {
      console.log(err);
      payload.errorMessage = "Something went wrong";
      res.status(400).render("register", payload);
    });
    if (!user) {
      payload.password = await bcrypt.hash(password, 10);
      await User.create(payload).then((user) => {
        console.log(user);
      });
    } else {
      if (email == user.email) {
        payload.errorMessage = "Email is already in use";
      } else {
        payload.errorMessage = "Username is already in user";
      }
    }
  } else {
    payload.errorMessage = "Please make sure you fill all the field";
    res.status(400).render("register", payload);
  }
  res.status(201).render("register");
});
module.exports = router;

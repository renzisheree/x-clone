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
    try {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (!user) {
        payload.password = await bcrypt.hash(password, 10);
        const newUser = await User.create(payload);
        req.session.user = newUser;
        return res.status(201).redirect("/"); // Ensure return
      } else {
        if (email === user.email) {
          payload.errorMessage = "Email is already in use";
        } else {
          payload.errorMessage = "Username is already in use";
        }
        return res.status(400).render("register", payload); // Ensure return
      }
    } catch (err) {
      console.log(err);
      payload.errorMessage = "Something went wrong";
      return res.status(400).render("register", payload); // Ensure return
    }
  } else {
    payload.errorMessage = "Please make sure you fill all the fields";
    return res.status(400).render("register", payload); //
  }
});
module.exports = router;

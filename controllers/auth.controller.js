const User = require("../models/user.model");
const bcrypt = require("bcrypt");
exports.LoginPage = (req, res, next) => {
  res.status(200).render("login");
};
exports.Login = async (req, res, next) => {
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
};

exports.Logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
};
exports.RegisterPage = (req, res, next) => {
  res.status(201).render("register");
};
exports.Register = async (req, res, next) => {
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
      return res.status(400).render("register", payload);
    }
  } else {
    payload.errorMessage = "Please make sure you fill all the fields";
    return res.status(400).render("register", payload);
  }
};

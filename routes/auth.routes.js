const express = require("express");
const {
  Logout,
  Register,
  Login,
  LoginPage,
  RegisterPage,
} = require("../controllers/auth.controller");
const router = express.Router();

router.get("/login", LoginPage);
router.post("/login", Login);
router.get("/register", RegisterPage);
router.post("/register", Register);
router.get("/logout", Logout);

module.exports = router;

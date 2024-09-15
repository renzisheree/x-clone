const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const port = 5100;
const middleware = require("./middleware");
const path = require("path");
const mongoose = require("./database");
const session = require("express-session");

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "renzisheree",
    resave: true,
    saveUninitialized: false,
  })
);
//routes
const loginRoute = require("./routes/login.routes");
const registerRoute = require("./routes/register.routes");
const logoutRoute = require("./routes/logout.routes");
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", registerRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
  var payload = { pageTitle: "Home", userLoggedIn: req.session.user };
  res.status(200).render("home", payload);
});

const server = app.listen(port, () => {
  console.log("server listening on port " + port);
});

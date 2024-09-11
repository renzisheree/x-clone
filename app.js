const express = require("express");

const app = express();

const port = 5100;
const middleware = require("./middleware");

app.set("view engine", "pug");
app.set("views", "views");

//routes
const loginRoute = require("./routes/login.routes");
app.use("/login", loginRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
  var payload = { pageTitle: "Home" };
  res.status(200).render("home", payload);
});

const server = app.listen(port, () => {
  console.log("server listening on port " + port);
});

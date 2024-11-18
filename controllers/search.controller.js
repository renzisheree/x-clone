const path = require("path");

exports.searchPage = async (req, res, next) => {
  var payload = createPayload(req);
  res.status(200).render("searchPage", payload);
};
exports.searchPosts = async (req, res, next) => {
  var payload = createPayload(req);
  payload.selectedTab = req.params.selecetedTab;
  res.status(200).render("searchPage", payload);
};
exports.searchUsers = async (req, res, next) => {
  var payload = createPayload(req);
  payload.selectedTab = req.params.selecetedTab;
  res.status(200).render("searchPage", payload);
};

function createPayload(req) {
  return {
    pageTitle: "Search",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
}

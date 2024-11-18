const path = require("path");

exports.getImage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
};

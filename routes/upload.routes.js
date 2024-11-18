const express = require("express");
const { getImage } = require("../controllers/upload.controller");

const router = express.Router();

router.get("/uploads/images/:path", getImage);
module.exports = router;

var express = require("express");
const { jwtCheck } = require("../services/jwt-check.service");
var router = express.Router();

router.get("/", jwtCheck, function (req, res, next) {
  res.send("my-fave-games not implemented yet");
});

module.exports = router;

var express = require("express");
const { jwtCheck } = require("../app");
var router = express.Router();

const faveGames = [];

const username = "robt1019";

router.get("/", jwtCheck, function (req, res, next) {
  res.send("my-fave-games not implemented yet");
});

module.exports = router;

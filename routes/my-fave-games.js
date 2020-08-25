var express = require("express");
var router = express.Router();

const faveGames = [];

const username = "robt1019";

router.get("/", function (req, res, next) {
  res.render("index", { title: "express" });
});

module.exports = router;

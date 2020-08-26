const express = require("express");
const { jwtCheck } = require("../services/jwt-check.service");
const router = express.Router();
const User = require("../models/user.model");
const FaveGame = require("../models/fave-game.model");

router.get("/", jwtCheck, function (req, res, next) {
  res.send("my-fave-games not implemented yet");
});

// create
router.post("/", jwtCheck, (req, res) => {
  const { gameId, platformId, reasons } = req.body;
});

//update
router.put("/", jwtCheck, (req, res) => {
  res.send("my-fave-games not implemented yet");
});

module.exports = router;

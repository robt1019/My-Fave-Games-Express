const express = require("express");
const { jwtCheck } = require("../services/jwt-check.service");
const router = express.Router();
const User = require("../models/user.model");
const FaveGame = require("../models/fave-game.model");

router.get("/:userId", jwtCheck, function (req, res, next) {
  const userId = req.params.userId;
  User.findOne({ userId }).then((result) => {
    if (result) {
      res.send(result.faveGames);
    } else {
      User.create({
        userId,
        faveGames: [],
      }).then(() => {
        res.send([]);
      });
    }
  });
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

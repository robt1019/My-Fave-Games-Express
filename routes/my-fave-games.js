const express = require("express");
const debug = require("debug")("http");
const { jwtCheck } = require("../services/jwt-check.service");
const router = express.Router();
const User = require("../models/user.model");
const FaveGame = require("../models/fave-game.model");

router.get("/:userId", function (req, res, next) {
  const userId = req.params.userId;
  User.findOne({ userId })
    .populate("faveGames")
    .then((result) => {
      if (result) {
        res.send(result.faveGames);
      } else {
        res.send([]);
      }
    });
});

// create
router.post("/", jwtCheck, (req, res) => {
  const { gameId, platformId } = req.body;
  const userId = req.user.sub;

  debug(
    `creating new game with body: ${JSON.stringify(
      req.body
    )}, gameId: ${gameId}, userId: ${userId} and platformId: ${platformId}`
  );

  const newGame = new FaveGame({
    id: `${platformId}-${gameId}-${userId}`,
    platformId,
    gameId,
    userId,
  });

  newGame
    .save()
    .then((game) => {
      User.findOne({ userId }).then((result) => {
        if (result) {
          result.faveGames.push(game);
          result
            .save()
            .then((obj) => {
              res.status(200).send(obj);
            })
            .catch((err) => res.status(400).send(err));
        } else {
          User.create({
            userId,
            faveGames: [game],
          })
            .then((result) => res.status(200).send(result))
            .catch((err) => res.status(400).send(err));
        }
      });
    })
    .catch((err) => res.status(400).send(err));
});

//update
router.put("/", jwtCheck, (req, res) => {
  res.send("my-fave-games not implemented yet");
});

module.exports = router;

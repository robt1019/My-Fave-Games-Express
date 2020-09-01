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
    .then(() => {
      User.findOne({ userId }).then((result) => {
        if (result) {
          result.faveGames.push(newGame);
          result
            .save()
            .then(() => {
              res.status(200).send(newGame);
            })
            .catch((err) => res.status(400).send(err));
        } else {
          User.create({
            userId,
            faveGames: [newGame],
          })
            .then(() => res.status(200).send(newGame))
            .catch((err) => res.status(400).send(err));
        }
      });
    })
    .catch((err) => res.status(400).send(err));
});

router.delete("/:faveGameId", jwtCheck, (req, res) => {
  const { faveGameId } = req.params;
  FaveGame.findOneAndDelete({ id: faveGameId })
    .then(() => res.status(200).send())
    .catch((err) => res.status(400).send);
});

module.exports = router;

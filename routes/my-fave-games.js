const express = require("express");
const debug = require("debug")("http");
const { jwtCheck } = require("../services/jwt-check.service");
const router = express.Router();
const User = require("../models/user.model");
const FaveGame = require("../models/fave-game.model");
const axios = require("axios");
const crypto = require("crypto");

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer, "utf8").digest("hex");
}

router.get("/", jwtCheck, function (req, res) {
  const userId = sha256(req.user.sub);
  FaveGame.find({ userId }).then((results) => {
    res.send(results);
  });
});

router.get("/:userId", function (req, res) {
  const userId = req.params.userId;
  FaveGame.find({ userId }).then((results) => {
    res.send(results);
  });
});

router.post("/", jwtCheck, (req, res) => {
  const { gameId, platformId, reasons } = req.body;
  const userId = sha256(req.user.sub);

  FaveGame.find({ userId }).then((results) => {
    if (results && results.length >= 5) {
      debug(`too many games`);
      res.status(400).send({ code: "too_many_games" });
    } else {
      const newGame = new FaveGame({
        id: `${platformId}-${gameId}-${userId}`,
        platformId,
        gameId,
        userId,
        reasons,
      });

      debug(
        `creating new game with body: ${JSON.stringify(
          req.body
        )}, gameId: ${gameId}, userId: ${userId} and platformId: ${platformId}`
      );

      newGame.save().then(() => {
        User.findOne({ userId })
          .then((result) => {
            if (!result) {
              axios({
                url: `${process.env.AUTH0_DOMAIN}userInfo`,
                method: "GET",
                headers: {
                  Authorization: req.header("Authorization"),
                },
              }).then((userInfo) => {
                debug(userInfo);
                User.create({
                  userId,
                  username:
                    (userInfo.data &&
                      userInfo.data["https://myfavegames/username"]) ||
                    "",
                })
                  .then(() => res.status(200).send(newGame))
                  .catch((err) => res.status(400).send(err));
              });
            }
          })
          .catch((err) => res.status(400).send(err));
      });
    }
  });
});

router.put("/:faveGameId", jwtCheck, (req, res) => {
  const { faveGameId } = req.params;
  const { reasons } = req.body;
  debug(`updating game: ${faveGameId}`);
  debug(`new reasons: ${reasons}`);
  FaveGame.findOneAndUpdate({ id: faveGameId }, { reasons })
    .then((updatedGame) => res.status(200).send(updatedGame))
    .catch((err) => res.status(400).send(err));
});

router.delete("/:faveGameId", jwtCheck, (req, res) => {
  const { faveGameId } = req.params;
  FaveGame.findOneAndDelete({ id: faveGameId })
    .then(() => res.status(200).send())
    .catch((error) => res.status(400).send(error));
});

module.exports = router;

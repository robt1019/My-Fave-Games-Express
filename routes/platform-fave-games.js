const express = require("express");
const router = express.Router();
const FaveGame = require("../models/fave-game.model");
const debug = require("debug")("http");

router.get("/:platformId", function (req, res) {
  const { platformId } = req.params;
  FaveGame.find({ platformId })
    .then((results) => {
      debug(`platform fave games result: ${JSON.stringify(results)}`);
      const platformFaveGamesByGameId = results.reduce((prev, curr) => {
        const { gameId } = curr;
        if (prev[gameId]) {
          prev[gameId].push(curr);
        } else {
          prev[gameId] = [curr];
        }
        return prev;
      }, {});
      res.status(200).send(
        Object.keys(platformFaveGamesByGameId)
          .map((gameId) => {
            const faveGame = platformFaveGamesByGameId[gameId];
            return {
              gameId,
              count: faveGame.length,
              reasons: faveGame.map((userFave) => userFave.reasons),
            };
          })
          .slice(0, 5)
          .sort((a, b) => {
            if (a.count > b.count) {
              return -1;
            }
            if (b.count < a.count) {
              return 1;
            }
          })
      );
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;

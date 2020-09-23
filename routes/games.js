const express = require("express");
const router = express.Router();
const axios = require("axios");
const debug = require("debug")("http");

router.get("/:gameId", (req, res) => {
  const gameId = req.params.gameId;
  if (!gameId) {
    res
      .status(400)
      .send("you need to send a gameId query param with that request");
  } else {
    axios({
      url: "https://api-v3.igdb.com/games",
      method: "POST",
      headers: {
        Accept: "application/json",
        "user-key": process.env.IGDB_USER_KEY,
      },
      data: `fields name, platforms; where id = ${gameId}; limit 100;`,
    })
      .then((game) => {
        axios({
          url: "https://api-v3.igdb.com/screenshots",
          method: "POST",
          headers: {
            Accept: "application/json",
            "user-key": process.env.IGDB_USER_KEY,
          },
          data: `fields id, url; where game = ${gameId}; limit 10;`,
        })
          .then((screenshots) => {
            res.json({
              ...game.data[0],
              screenshots: screenshots.data.map((screenshot) => ({
                ...screenshot,
                url: `https:${screenshot.url.replace(
                  "t_thumb",
                  "t_screenshot_big"
                )}`,
              })),
            });
          })
          .catch((err) => res.status(400).send(err && err.messsage));
      })
      .catch((err) => {
        res.status(400).send(err && err.message);
      });
  }
});

router.get("/", function (req, res) {
  const { search, gameIds } = req.query;
  debug(`gameIds: ${gameIds}`);
  if (!(search || gameIds)) {
    res
      .status(400)
      .send(
        "You must provide a search term or game ids list via the search or gameIds query strings"
      );
  } else {
    debug(`I got here at least. That is something. Right?`);
    Promise.all([
      axios({
        url: "https://api-v3.igdb.com/games",
        method: "POST",
        headers: {
          Accept: "application/json",
          "user-key": process.env.IGDB_USER_KEY,
        },
        data: `fields name, platforms; ${
          gameIds ? `where id=(${gameIds});` : ""
        }${search ? `search "${search}";` : ""} limit 100;`,
      }),
      new Promise((resolve, reject) => {
        if (!gameIds) {
          resolve([]);
        }
        axios({
          url: "https://api-v3.igdb.com/screenshots",
          method: "POST",
          headers: {
            Accept: "application/json",
            "user-key": process.env.IGDB_USER_KEY,
          },
          data: `fields id, url, game;${
            gameIds ? `where game=(${gameIds});` : ""
          }  limit 100;`,
        })
          .then((screenshots) => {
            debug(`screenshots: ${screenshots}`);
            resolve(
              screenshots.data.map((screenshot) => ({
                ...screenshot,
                url: `https:${screenshot.url.replace(
                  "t_thumb",
                  "t_screenshot_big"
                )}`,
              }))
            );
          })
          .catch((err) => {
            debug(`error fetching screenshots: ${err}`);
            reject(err);
          });
      }),
    ])
      .then(([games, screenshots]) => {
        const joined = games.data.map((game) => ({
          ...game,
          screenshots: screenshots.filter(
            (screenshot) => screenshot.game === game.id
          ),
        }));
        res.status(200).json(joined);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
});

module.exports = router;

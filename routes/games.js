const express = require("express");
const router = express.Router();
const axios = require("axios");

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
              screenshot: `https:${screenshots.data[
                Math.floor(Math.random() * screenshots.data.length - 1)
              ].url.replace("t_thumb", "t_screenshot_big")}`,
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
  const searchTerm = req.query.search;
  if (!searchTerm) {
    res
      .status(400)
      .send("You must provide a search term via the search query string");
  } else {
    axios({
      url: "https://api-v3.igdb.com/games",
      method: "POST",
      headers: {
        Accept: "application/json",
        "user-key": process.env.IGDB_USER_KEY,
      },
      data: `fields name, platforms; search "${searchTerm}"; limit 100;`,
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
});

module.exports = router;

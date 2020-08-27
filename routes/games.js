const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:gameId", (req, res) => {
  const gameId = req.params.gameId;
  axios({
    url: "https://api-v3.igdb.com/games",
    method: "POST",
    headers: {
      Accept: "application/json",
      "user-key": process.env.IGDB_USER_KEY,
    },
    data: `fields name, platforms; where id = ${gameId}; limit 100;`,
  })
    .then((response) => {
      res.json(response.data[0]);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/", function (req, res, next) {
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

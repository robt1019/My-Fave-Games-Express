const express = require("express");
const router = express.Router();
const axios = require("axios");
const debug = require("debug")("http");

router.get("/", function (req, res) {
  const platformIds = req.query.platformIds;
  const searchTerm = req.query.searchTerm;
  if (!(platformIds || searchTerm)) {
    res
      .status(400)
      .send(
        "You must provide a comma separated list of platformIds, or a searchTerm in the query string"
      );
  } else {
    axios({
      url: "https://api-v3.igdb.com/platforms",
      method: "POST",
      headers: {
        Accept: "application/json",
        "user-key": process.env.IGDB_USER_KEY,
      },
      data: `fields name, platform_logo; ${
        platformIds ? `where id=(${platformIds});` : `search "${searchTerm}";`
      } limit 100;`,
    })
      .then((platforms) => {
        res.status(200).json(platforms.data);
      })
      .catch((err) => {
        res.status(400).send(err && err.message);
      });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const debug = require("debug")("http");

router.get("/", function (req, res, next) {
  const platformIds = req.query.platformIds;
  if (!platformIds) {
    res
      .status(400)
      .send(
        "You must provide a comma separated list of platformIds in the query string"
      );
  } else {
    axios({
      url: "https://api-v3.igdb.com/platforms",
      method: "POST",
      headers: {
        Accept: "application/json",
        "user-key": process.env.IGDB_USER_KEY,
      },
      data: `fields name, platform_logo; where id=(${platformIds}); limit 100;`,
    })
      .then((platforms) => {
        debug(platforms.data);
        Promise.all(
          platforms.data.map((platform) => {
            return axios({
              url: "https://api-v3.igdb.com/platform_logos",
              method: "POST",
              headers: {
                Accept: "application/json",
                "user-key": process.env.IGDB_USER_KEY,
              },
              data: `fields url; where id=${platform.platform_logo};`,
            });
          })
        )
          .then((logos) => {
            res.json(
              platforms.data.map((p, key) => ({
                ...p,
                logo: logos[key].data[0],
              }))
            );
          })
          .catch((err) => res.status(400).send(err));
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
});

module.exports = router;

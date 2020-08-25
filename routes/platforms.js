const express = require("express");
const router = express.Router();
const axios = require("axios");

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
      data: `fields name; where id=(${platformIds}); limit 100;`,
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

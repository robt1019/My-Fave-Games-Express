const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const debug = require("debug")("http");

router.get("/", function (req, res) {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    res
      .status(400)
      .send("You must provide a search term via the search query string");
  } else {
    debug(`search term: ${searchTerm}`);
    const searchTermRegex = new RegExp(searchTerm, "i");
    User.find({ $or: [{ userId: searchTermRegex }, { name: searchTermRegex }] })
      .then((users) => {
        debug(`users found: ${users}`);
        res.status(200).send(users);
      })
      .catch((err) => res.status(400).send(err));
  }
});

module.exports = router;

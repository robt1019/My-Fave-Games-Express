const express = require("express");
const User = require("../models/user.model");
const { jwtCheck } = require("../services/jwt-check.service");
const router = express.Router();
const debug = require("debug")("http");
const crypto = require("crypto");

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer, "utf8").digest("hex");
}

router.get("/me", jwtCheck, (req, res) => {
  const userId = sha256(req.user.sub);
  User.findOne({ userId })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(204).send();
      }
    })
    .catch((err) => res.status(400).send(err));
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  User.findOne({ userId })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(400).send(err));
});

router.get("/", (req, res) => {
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

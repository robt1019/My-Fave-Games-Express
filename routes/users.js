const express = require("express");
const User = require("../models/user.model");
const router = express.Router();

router.get("/", function (req, res) {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    res
      .status(400)
      .send("You must provide a search term via the search query string");
  } else {
    User.find({ userId: new RegExp("^" + searchTerm + "$", "i") }).then(
      (users) => {
        res.status(200).send(users);
      }
    );
  }
});

module.exports = router;

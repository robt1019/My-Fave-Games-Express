const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const debug = require("debug")("http");
const cors = require("cors");

const gamesRouter = require("./routes/games");
const platformsRouter = require("./routes/platforms");
const myFaveGamesRouter = require("./routes/my-fave-games");
const faveGamesRouter = require("./routes/fave-games");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.get("/ping", (req, res) => {
  res.send("pong");
});
app.use("/games", gamesRouter);
app.use("/platforms", platformsRouter);
app.use("/my-fave-games", myFaveGamesRouter);
app.use("/fave-games", faveGamesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

const connection = mongoose.connection;

connection.once("open", () => {
  debug("MongoDB database connection established correctly");
});

module.exports = app;

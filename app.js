var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const debug = require("debug")("http");

var myFaveGamesRouter = require("./routes/my-fave-games");
var faveGamesRouter = require("./routes/fave-games");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.get("/ping", (req, res) => {
  res.send("pong");
});
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

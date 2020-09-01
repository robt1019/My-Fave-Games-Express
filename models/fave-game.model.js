const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const faveGameSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  gameId: {
    type: String,
    required: true,
  },
  platformId: {
    type: String,
    required: true,
  },
  reasons: {
    type: String,
    required: false,
  },
});

const FaveGame = mongoose.model("FaveGame", faveGameSchema);

module.exports = FaveGame;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  faveGames: [
    {
      type: mongoose.ObjectId,
      ref: "FaveGame",
    },
  ],
});

const User = mongoose.model("Notes", userSchema);

module.exports = User;

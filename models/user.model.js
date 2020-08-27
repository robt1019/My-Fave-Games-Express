const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
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

const User = mongoose.model("User", userSchema);

module.exports = User;

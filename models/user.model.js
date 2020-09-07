const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

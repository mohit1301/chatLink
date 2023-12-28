const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  socketId: { type: String, required: true}, // the socket id of the user
  userId: { type: String, required: true, unique: true }, // unique uuid of every user
  userName: { type: String, required: true },
  room: { type: String, required: true },
});

module.exports = mongoose.model("Users", userSchema);

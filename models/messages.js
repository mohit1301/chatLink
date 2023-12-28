const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  userId: { type: String, required: true }, //socket id of the connected user
  userName: { type: String, required: true },
  text: { type: String, required: true },
  time: {
    type: String,
    default: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  },
});

module.exports = mongoose.model("Messages", messageSchema);

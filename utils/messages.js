const Messages = require("../models/messages");
const { getRoom } = require("./rooms");
const { getCurrentUser } = require('./users')

async function createMessage( msg, userId) {
  const user = await getCurrentUser(userId);
  const createdRoom = await getRoom(user.room)

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });

  return await Messages.create({
    roomId: createdRoom._id,
    userId: user.userId,
    userName: user.userName,
    text: msg,
    time: currentTime,
  });
}

async function getChatHistory(roomId) {
  return await Messages.find({ roomId });
}

async function deleteMessage(messageId, userId) {
  const deletedMessage = await Messages.findOneAndDelete({
    _id: messageId,
    userId: userId,
  }).populate("roomId");

  return deletedMessage;
}

function formatBotMessage(userName, text) {
  return {
    userName,
    text,
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC"
    }),
    isBot: true,
  };
}

module.exports = {
  formatBotMessage,
  createMessage,
  getChatHistory,
  deleteMessage,
};

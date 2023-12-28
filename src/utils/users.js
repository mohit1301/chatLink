const Users = require("../models/Users");

// Join user to chat
async function userJoin(socketId, userId, userName, room) {
  return await Users.create({ socketId, userId, userName, room });
}

// Get current user
async function getCurrentUser(userId) {
  return await Users.findOne({ userId });
}

// User leaves chat
async function userLeave(socketId) {
  return await Users.findOneAndDelete({ socketId });
}

// Get room Users
async function getRoomUsers(room) {
  return await Users.find({ room });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};

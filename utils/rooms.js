const Room = require("../models/room");

async function createRoom(name) {
  const room = await Room.findOne({ name });
  if (!room) {
    return await Room.create({ name });
  }
  return room;
}

async function getRoom(name) {
  return await Room.findOne({ name });
}

module.exports = {
  createRoom,
  getRoom,
};

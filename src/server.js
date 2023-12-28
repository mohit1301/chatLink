const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  formatBotMessage,
  createMessage,
  getChatHistory,
  deleteMessage,
} = require("./utils/messages");
require("dotenv").config();
require("./DBConfig");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const { createRoom } = require("./utils/rooms");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatLink Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ userName, room, userId }) => {
    let user = await getCurrentUser(userId);

    if (user) {
      // Update the socket ID for the existing user
      user.socketId = socket.id;
      await user.save();
    } else {
      // Create a new user if not exists
      user = await userJoin(socket.id, userId, userName, room);
    }

    //Create a room
    const createdRoom = await createRoom(room);
    socket.join(createdRoom.name);

    //Retrive the chat history
    let chatHistory = await getChatHistory(createdRoom._id);

    // Emit chats to the current user
    socket.emit("chatHistory", chatHistory);

    // Welcome current user
    socket.emit(
      "message",
      formatBotMessage(botName, `Hey ${user.userName}! Welcome to ChatLink.`)
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatBotMessage(botName, `${user.userName} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: await getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", async ({msg, room, userId}) => {

    // Store the message in database
    const message = await createMessage(msg, userId);
    io.to(room).emit("message", message);
  });

  //Delete a particular msg from chat
  socket.on("deleteMessage", async ({ messageId, userId }) => {
    const deletedMessage = await deleteMessage(messageId, userId);

    if (deletedMessage) {

      // Check if the deleted message is a user message
      if (!deletedMessage.isBot) {
        // Emit an event to delete the message container
        io.to(deletedMessage.roomId.name).emit("deleteLocalMessage", messageId);
      }
    }
  });

  // Runs when client disconnects
  socket.on("disconnect", async () => {
    const user = await userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatBotMessage(botName, `${user.userName} has left the chat`)
      );
    
    socket.emit("removeUserId")

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: await getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

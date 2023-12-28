const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const currentUser = document.getElementById("current-user");
const userList = document.getElementById("users");

// Get username and room from URL
const { userName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Get the user ID from sessionStorage
let userId = sessionStorage.getItem('userId');

// If there's no userId generate one
if (!userId) {
  userId = `${userName}-${room}-${self.crypto.randomUUID()}`;
  sessionStorage.setItem('userId', userId);
}
console.log(userId)
// Join chatroom
socket.emit("joinRoom", { userName, room, userId });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputCurrentUser(userName)
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Display chat history
socket.on("chatHistory", (data) => {
  data.forEach((message) => {
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();
  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", { msg, room, userId });

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const chatMessagesContainer = document.querySelector(".chat-messages");

  const div = document.createElement("div");
  div.classList.add("message");
  div.id = message._id;

  // Meta information (user name and time)
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.userName;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);

  // Message text
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);

  // Delete button
  if (!message.isBot) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function () {
      deleteMessage(message._id, userId);
    };
    div.appendChild(deleteButton);
  }
  chatMessagesContainer.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add current user name to DOM
function outputCurrentUser(user) {
  currentUser.innerText = user;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.userName;
    userList.appendChild(li);
  });
}

function deleteMessage(messageId, userId) {
  socket.emit("deleteMessage", { messageId, userId });
}

socket.on("deleteLocalMessage", (messageId) => {
  // Remove the message container based on the messageId
  const messageContainer = document.getElementById(messageId);

  if (messageContainer) {
    messageContainer.remove();
  }
});

socket.on("removeUserId", () => {
  sessionStorage.removeItem('userId')
})

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    // sessionStorage.removeItem('userId')
    window.location = "../index.html";
  } else {
  }
});

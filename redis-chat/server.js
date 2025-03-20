const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const redisPub = new Redis();
const redisSub = new Redis();
const CHAT_CHANNEL = "chats_channel";

io.on("connection", (socket) => {
  socket.on("sendMessage", (message) => {
    redisPub.publish(CHAT_CHANNEL, JSON.stringify(message));
  });
  socket.on("disconnect", () => {
    console.log("�� User disconnected:", socket.id);
  });
});
redisSub.subscribe(CHAT_CHANNEL);
redisSub.on("message", (channel, message) => {
  if (channel === CHAT_CHANNEL) {
    io.emit("receiveMessage", JSON.parse(message)); // Emit to all connected clients with new message
  }
});
server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

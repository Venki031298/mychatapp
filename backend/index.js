
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
var counter =0;
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  (counter++);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {

    // console.log('send '+ data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    (counter--);
    console.log("User Disconnected", socket.id);
  });

  socket.emit("count",counter);

 });
//  io.on("connection", (socket) =>{
//   console.log('counting'+counter)
//   socket.emit("count",counter);
// })

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
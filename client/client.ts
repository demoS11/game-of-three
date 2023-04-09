import io from "socket.io-client";
import readline from "readline";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Welcome Player", socket.id);

  socket.emit("enter", socket.id);
});

socket.on("progress", (msg) => {
  console.log(`The number is ${msg}`);
  console.log(`Make your move, choose 1, 0 or -1`);
  switch (msg % 3) {
    case 0:
      console.log(`Move is 0`);
      socket.emit("move", 0);
      break;
    case 1:
      console.log(`Move is -1`);
      socket.emit("move", -1);
      break;
    case 2:
      console.log(`Move is 1`);
      socket.emit("move", 1);
      break;
    default:
      console.log(`Move is undefiend`);
      socket.emit("move", -2);
      break;
  }
});

socket.on("over", (msg) => {
  console.log(msg);
});

socket.on("info", (msg) => {
  console.log(`${msg}\n`);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
  process.exit();
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

import io from "socket.io-client";
import readline from "readline";
import { ClientMessage } from "./messages";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(`${ClientMessage.Welcome} ${socket.id}`);
  console.log(ClientMessage.Intro);
  console.log(ClientMessage.Divider);

  socket.emit("enter", socket.id);
});

socket.on("progress", (msg) => {
  console.log(ClientMessage.Divider);
  console.log(`${ClientMessage.GameNumber} ${msg}`);
  console.log(ClientMessage.MakeYourMove);

  switch (msg % 3) {
    case 0:
      console.log(`${ClientMessage.YourMove} 0`);
      socket.emit("move", 0);
      break;
    case 1:
      console.log(`${ClientMessage.YourMove} -1`);
      socket.emit("move", -1);
      break;
    case 2:
      console.log(`${ClientMessage.YourMove} 1`);
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
  process.exit();
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

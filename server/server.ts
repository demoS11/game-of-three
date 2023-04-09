import { createServer } from "http";
import { Server } from "socket.io";
import App from "./app";

const PORT = process.argv[2] || 3000;

const httpServer = createServer();
const io = new Server(httpServer);

const app = new App(io);

io.on("connection", (socket) => {
  console.info(`New user connected to the server: ${socket.id}`);

  socket.on("enter", () => {
    console.info(`${socket.id} has entered.`);
    app.handleEnter(socket);
  });

  socket.on("move", (move) => {
    console.info(`${socket.id} has made move.`);
    app.handleMove(socket, move);
  });

  socket.on("disconnect", () => {
    console.info(`${socket.id} is disconnected.`);
    app.handleDisconnect(socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Game server listening on PORT:${PORT}`);
  console.warn("----------------------------------------");
});

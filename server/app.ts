import { DefaultEventsMap } from "socket.io/dist/typed-events";
import PlayerController from "./controllers/PlayerController";
import { Server } from "socket.io";
import Player from "./lib/Player";
import RoomController from "./controllers/RoomController";

class App {
  io: any;
  dict: Map<any, any>;
  PlayerController: PlayerController;
  RoomController: RoomController;

  constructor(
    socketIO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    this.io = socketIO;
    this.dict = new Map();
    this.PlayerController = new PlayerController();
    this.RoomController = new RoomController();
  }

  match(players: Player[]) {
    const [playerX, playerO] = players;

    const playerXSocketID = playerX.socket.id;
    const playerOSocketID = playerO.socket.id;

    const newGame = this.RoomController.create([
      playerXSocketID,
      playerOSocketID,
    ]);

    const roomID = newGame.gameID;

    newGame.init();

    playerX.socket.join(roomID);
    playerO.socket.join(roomID);

    this.dict.set(roomID, {
      playerX: playerXSocketID,
      playerO: playerOSocketID,
    });

    this.dict.set(playerXSocketID, roomID);
    this.dict.set(playerOSocketID, roomID);

    this.io
      .to(playerXSocketID)
      .emit("info", "Game started, you are the player X");
    this.io
      .to(playerOSocketID)
      .emit("info", "Game started, you are the player O");

    console.log("Game Starting with number", newGame.progress);
    this.io.to(playerXSocketID).emit("progress", newGame.progress);
  }

  handleEnter(socket: any) {
    this.PlayerController.addToQueue(socket);

    if (this.PlayerController.queueSize === 2) {
      const players = this.PlayerController.addToStore();

      this.match(players);
    } else {
      socket.emit("info", "Waiting for the other player...");
    }
  }

  handleMove(socket: any, message: any) {
    const roomID = this.dict.get(socket.id);
    const game = this.RoomController.getRoom(roomID);
    const currentPlayer = game.participants[socket.id];

    const playerTurn = game._turn === currentPlayer;

    if (playerTurn) {
      const numberAfterMove = game.makeMove(message);

      if (numberAfterMove === 1) {
        socket.broadcast.to(roomID).emit("over", "Game is over");
        socket.emit("info", "YOU WIN");
        socket.broadcast.to(roomID).emit("over", "You Lost");
      } else {
        console.log(`${currentPlayer} made move ${message}`);
        game.turn();
        console.log(game.process);
        socket.to(roomID).emit("progress", game.progress);
      }
    } else {
      socket.to().emit("info", "It's not your turn");
    }
  }

  handleDisconnect(socketID: string) {
    const roomID = this.dict.get(socketID);

    this.dict.delete(socketID);
    this.PlayerController.remove(socketID);

    this.io.to(roomID).emit("info", "The other player has disconnected");
  }
}

export default App;

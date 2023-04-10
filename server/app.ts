import PlayerController from "./controllers/PlayerController";
import { Server } from "socket.io";
import Player from "./lib/Player";
import RoomController from "./controllers/RoomController";
import { InfoMessage } from "./messages";

class App {
  io: Server;
  dict: Map<any, any>;
  PlayerController: PlayerController;
  RoomController: RoomController;

  constructor(socketIO: Server) {
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

    this.io.to(playerXSocketID).emit("info", InfoMessage.GameStartedForPlayerX);
    this.io.to(playerOSocketID).emit("info", InfoMessage.GameStartedForPlayerO);

    console.log(`Game is starting with number: ${newGame.progress}`);

    this.io.to(playerXSocketID).emit("progress", newGame.progress);
  }

  handleEnter(socket: any) {
    this.PlayerController.addToQueue(socket);

    if (this.PlayerController.queueSize === 2) {
      const players = this.PlayerController.addToStore();

      this.match(players);
    } else {
      socket.emit("info", InfoMessage.WaitForOthers);
    }
  }

  handleMove(socket: any, message: number) {
    const roomID = this.dict.get(socket.id);
    const game = this.RoomController.getRoom(roomID);
    const currentPlayer = game.participants[socket.id];

    const playerTurn = game._turn === currentPlayer;

    if (playerTurn) {
      const numberAfterMove = game.makeMove(message);

      if (numberAfterMove === 1) {
        this.io.in(roomID).emit("over", InfoMessage.GameOver);

        socket.emit("over", InfoMessage.Victory);
        socket.to(roomID).emit("over", InfoMessage.Lose);
      } else {
        console.log(`Player ${currentPlayer} sent ---> ${message}`);

        game.turn();

        socket.to(roomID).emit("progress", game.progress);
      }
    } else {
      socket.to().emit("info", InfoMessage.WrongPlayer);
    }
  }

  handleDisconnect(socketID: string) {
    const roomID = this.dict.get(socketID);

    this.dict.delete(socketID);
    this.PlayerController.remove(socketID);

    this.io.to(roomID).emit("info", InfoMessage.Disconnected);
  }
}

export default App;

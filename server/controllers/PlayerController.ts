import { Socket } from "socket.io";
import Player from "../lib/Player";

class PlayerController {
  players: any;
  queue: any[];

  constructor() {
    this.players = new Map();
    this.queue = [];
  }

  get queueSize() {
    return this.queue.length;
  }

  addToStore() {
    const twoPlayers = this.queue.splice(0, 2);

    const [p1, p2] = twoPlayers;

    this.players.set(p1.socket.id, p1);
    this.players.set(p2.socket.id, p2);

    return twoPlayers;
  }

  addToQueue(socket: Socket) {
    const player = new Player(socket);

    this.queue.push(player);
  }

  getPlayer(socketID: Socket["id"]) {
    return this.players.get(socketID);
  }

  remove(socketID: Socket["id"]) {
    this.players.delete(socketID);
  }
}

export default PlayerController;

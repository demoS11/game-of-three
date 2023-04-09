import { Socket } from "socket.io";

class Player {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }
}

export default Player;

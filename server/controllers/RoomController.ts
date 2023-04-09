import Game from "../lib/Game";

class RoomController {
  ongoing: Map<any, any>;

  constructor() {
    this.ongoing = new Map();
  }

  genKey = () => Math.round(Math.random() * 1000).toString();

  create(playerIds: string[]) {
    const game = new Game(
      `game_room_${this.genKey}`,
      playerIds[0],
      playerIds[1]
    );

    this.ongoing.set(game.gameID, game);

    return game;
  }

  getRoom(gameID: string) {
    return this.ongoing.get(gameID);
  }

  remove(gameID: string) {
    this.ongoing.delete(gameID);
  }

  getCurrentRoomID(socket: any) {
    const roomID = [...socket.rooms].find((room) =>
      `${room}`.includes("game_room_")
    );

    return roomID;
  }
}

export default RoomController;

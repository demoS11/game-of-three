import Player from "./Player";

class Game {
  gameID: string;
  _turn: string;
  gameNumber: number;
  PX: string;
  PO: string;
  participants: { [x: string]: string };

  constructor(gameID: string, PX: string, PO: string) {
    this.gameID = gameID;
    this._turn = "X";
    this.gameNumber = 0;
    this.PX = PX;
    this.PO = PO;
    this.participants = this.participants = {
      [PX]: "X",
      [PO]: "O",
    };
  }

  init() {
    this._turn = "X";
    this.gameNumber = Math.floor(Math.random() * 100) + 1;
  }

  get progress() {
    return this.gameNumber;
  }

  makeMove(move: number) {
    return (this.gameNumber = (this.gameNumber + move) / 3);
  }

  turn() {
    this._turn = this._turn === "X" ? "O" : "X";
  }
}

export default Game;

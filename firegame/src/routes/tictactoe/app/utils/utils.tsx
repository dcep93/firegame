import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType, Tile } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  incrementPlayerTurn() {
    store.gameW.game.isPlacingNeutralAtEndOfTurn = false;
    if (this.checkIfFourOrLessEmpty()) {
      store.gameW.game.isSliding = true;
      store.gameW.game.skippedPlacing = true;
    } else {
      store.gameW.game.isSliding = false;
      store.gameW.game.skippedPlacing = false;
    }
    if (this.gameOver()) store.gameW.info.alert = "game over";
    super.incrementPlayerTurn();
  }

  checkIfFourOrLessEmpty(): boolean {
    if (
      store.gameW.game.board.flatMap((i) => i).filter((i) => i === Tile.white)
        .length <= 4
    ) {
      store.gameW.game.players[1].canPlaceNeutral = false;
      return true;
    } else {
      return false;
    }
  }

  gameOver(): boolean {
    const board = store.gameW.game.board;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (this.winningOn(i, j, 0, 1)) return true;
        if (this.winningOn(i, j, 1, 0)) return true;
        if (this.winningOn(i, j, 1, 1)) return true;
        if (this.winningOn(i, j, -1, -1)) return true;
      }
    }
    return false;
  }

  winningOn(row: number, column: number, x: number, y: number): boolean {
    const board = store.gameW.game.board;
    const myIndex = this.myIndex();
    for (let i = 0; i < 5; i++) {
      if (this.idx(board, [row + x * i, column + y * i]) !== myIndex)
        return false;
    }
    return true;
  }
}

const utils = new Utils();

export default utils;

export { store };

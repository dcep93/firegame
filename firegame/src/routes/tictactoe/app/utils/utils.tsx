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
}

const utils = new Utils();

export default utils;

export { store };

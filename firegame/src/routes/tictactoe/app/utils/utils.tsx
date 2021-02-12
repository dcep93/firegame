import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  incrementPlayerTurn() {
    store.gameW.game.isSliding = false;
    store.gameW.game.isPlacingNeutralAtEndOfTurn = false;
    store.gameW.game.skippedPlacing = false;
    super.incrementPlayerTurn();
  }
}

const utils = new Utils();

export default utils;

export { store };

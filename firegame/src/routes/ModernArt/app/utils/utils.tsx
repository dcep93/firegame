import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  allDraw(game: GameType): GameType {
    // todo
    const num = 10;
    game.players.forEach((p) => p.hand.push(...game.deck.splice(0, num)));
    return game;
  }
}

const utils = new Utils();

export default utils;

export { store };

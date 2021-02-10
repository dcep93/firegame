import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType } from "./NewGame";

const TILES_PER_FACTORY = 4;

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  newRound(game: GameType) {
    this.shuffle(game.bag);
    game.factories = utils.repeat(null, game.numFactories).map((_) => {
      if (game.bag.length < TILES_PER_FACTORY) {
        game.bag.push(...(game.lid || []));
        game.lid = [];
      }
      return game.bag.splice(0, TILES_PER_FACTORY);
    });
  }
}

const utils = new Utils();

export default utils;

export { store };

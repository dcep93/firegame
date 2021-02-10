import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType, Tile } from "./NewGame";

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

  takeTile(
    source: string,
    tile: Tile,
    isTable: boolean,
    popDestination: () => number
  ) {
    if (!utils.isMyTurn()) return;
    const destination = popDestination();
    if (destination === -1) {
      alert("need to select a line");
      return;
    }
    store.update(`${Tile[tile]} ${source} -> ${destination + 1}`);
  }
}

const utils = new Utils();

export default utils;

export { store };

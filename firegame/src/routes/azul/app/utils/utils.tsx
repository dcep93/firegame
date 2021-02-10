import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType, Tile } from "./NewGame";

const TILES_PER_FACTORY = 4;

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  FIRST_PLAYER_TILE = -1;
  FLOOR_SCORING = [-1, -1, -2, -2, -2, -3, -3];

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

  takeTile(factoryIndex: number, tile: Tile, popDestination: () => number) {
    if (!utils.isMyTurn()) return;
    const destination = popDestination();
    if (destination === -1) {
      alert("need to select a line");
      return;
    }
    const me = utils.getMe();
    if (!me.lines) me.lines = [];
    if (this.default((me.lines[destination] || [])[0], tile) !== tile) {
      alert("must match tile to line");
      return;
    }
    if ((me.wall || [])[destination]?.indexOf(tile) !== undefined) {
      alert("already have tile in wall");
      return;
    }
    var sourceName: string;
    var source: Tile[];
    const isTable = factoryIndex < 0;
    if (isTable) {
      sourceName = "table";
      source = store.gameW.game.table!;
    } else {
      sourceName = `Factory ${factoryIndex + 1}`;
      source = store.gameW.game.factories![factoryIndex]!;
    }
    const removed = utils.removeAll(source, (t) => t === tile);
    const newLine = (me.lines[destination] || []).concat(removed);
    me.lines[destination] = newLine;
    if (!me.floor) me.floor = [];
    me.floor.splice(0, 0, ...newLine.splice(destination + 1));
    if (!isTable) {
      store.gameW.game.table = (store.gameW.game.table || [])
        .concat(source.splice(0))
        .sort();
    } else if (
      store.gameW.game.players
        .flatMap((p) => p.floor || [])
        .filter((t) => t === this.FIRST_PLAYER_TILE).length === 0
    ) {
      me.floor.push(this.FIRST_PLAYER_TILE);
    }
    store.update(`${Tile[tile]} ${sourceName} -> ${destination + 1}`);
  }
}

const utils = new Utils();

export default utils;

export { store };

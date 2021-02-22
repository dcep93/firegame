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
    var destination = popDestination();
    if (destination === -1) {
      alert("need to select a line");
      return;
    }
    const me = utils.getMe();
    if (!me.lines) me.lines = [];
    if (this.default((me.lines[destination] || [])[0], tile) !== tile) {
      destination = -1;
    }
    const wallRow = (me.wall || {})[destination] || {};
    if (Object.values(wallRow).indexOf(tile) !== -1) {
      alert("already have tile in wall");
      return;
    }
    this.incrementPlayerTurn();
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
    me.floor = me.floor.concat(...newLine.splice(destination + 1));
    store.gameW.game.lid = (store.gameW.game.lid || []).concat(
      me.floor.splice(this.FLOOR_SCORING.length)
    );
    if (
      isTable &&
      source.length === 0 &&
      store.gameW.game.factories === undefined
    ) {
      store.gameW.game.currentPlayer = store.gameW.game.players
        .map((p, index) => ({ p, index }))
        .filter(
          (obj) => (obj.p.floor || []).indexOf(this.FIRST_PLAYER_TILE) !== -1
        )[0].index;
      store.gameW.game.players.forEach(this.tileWalls.bind(this));
      this.newRound(store.gameW.game);
    }
    store.update(`${Tile[tile]} ${sourceName} -> ${destination + 1}`);
  }

  tileWalls(p: PlayerType) {
    const numTiles = this.enumArray(Tile).length;
    this.enumArray(Tile).forEach((i) => {
      const row = (p.lines || [])[i];
      if (row && row.length === i + 1) {
        const tile = row.pop()!;
        if (!p.wall) p.wall = {};
        if (!p.wall[i]) p.wall[i] = [];
        const wallIndex = (tile! + i) % numTiles;
        p.wall![i]![wallIndex] = tile;
        p.score += this.countWall(p, i, wallIndex);
        const matchingTiles = Object.values(p.wall)
          .flatMap((i) => Object.values(i))
          .filter((i) => i === tile);
        if (matchingTiles.length === numTiles) p.score += 10;
        store.gameW.game.lid!.push(...row.splice(0));
      }
    });
    if (!p.floor) p.floor = [];
    p.score += p.floor.map((_, i) => this.FLOOR_SCORING[i]).sum();
    p.score = Math.max(p.score, 0);
    this.removeAll(p.floor, (t) => t === this.FIRST_PLAYER_TILE);
    store.gameW.game.lid!.push(...p.floor.splice(0));
  }

  countWall(p: PlayerType, rowI: number, columnI: number): number {
    const numTiles = this.enumArray(Tile).length;
    const wall = this.objToArr(p.wall!);
    const columnChain = this.countChain(
      this.enumArray(Tile).map((i) => this.idx(wall, [i, columnI])),
      rowI
    );
    const rowChain = this.countChain(
      this.enumArray(Tile).map((i) => this.idx(wall, [rowI, i])),
      columnI
    );
    var score = columnChain + rowChain;
    if (columnChain === 1) score--;
    if (rowChain === 1) score--;
    if (score === 0) return 1;
    if (columnChain === numTiles) score += 7;
    if (rowChain === numTiles) score += 2;
    return score;
  }

  countChain(arr: (number | undefined)[], index: number): number {
    var chain = 0;
    for (let i = index; i < arr.length; i++) {
      if (arr[i] === undefined) break;
      chain++;
    }
    for (let i = index - 1; i >= 0; i--) {
      if (arr[i] === undefined) break;
      chain++;
    }
    return chain;
  }
}

const utils = new Utils();

export default utils;

export { store };

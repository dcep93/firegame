import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import {
  Diamond,
  Diamonds,
  Faction,
  Factions,
  Science,
  Sciences,
  Tile,
  Tiles,
} from "./library";

import { GameType, Params, PlayerType } from "./NewGame";
import { Action, Rank, Resource, Track } from "./gameTypes";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(params: Params): GameType {
    const game: GameType = {
      params,
      currentPlayer: Object.keys(params.lobby).length - 1,

      year: 1,
      action: Action.selectFaction,
      startingPlayer: 0,
      players: [],
      sectors: [],
      buyableSciences: [],
      sciencesBag: utils.shuffle(
        Object.entries(Sciences).flatMap(([key, value]) =>
          utils.repeat(key as Science, 100)
        )
      ),
      diamonds: utils.shuffle(
        Object.entries(Diamonds).flatMap(([key, value]) =>
          utils.repeat(key as Diamond, 100)
        )
      ),
      military: utils.shuffle(
        [1, 2, 3, 4].flatMap((value) => utils.repeat(value, 100))
      ),
      tiles: Object.fromEntries(
        utils
          .enumArray(Rank)
          .filter((rank) => rank !== Rank.special)
          .map((rank) => [
            rank,
            Object.keys(Tiles).filter((t) => Tiles[t].rank === rank),
          ])
      ),
    };
    utils.pushSector(
      "100",
      {
        orientation: 0,
        x: 0,
        y: 0,
      },
      game
    );
    for (
      var needed;
      (needed =
        14 -
        game.buyableSciences.filter(
          (science) => Sciences[science].track !== Track.black
        ).length);
      utils.drawResearch(needed, game)
    ) {}
    return game;
  }

  drawResearch(needed: number, game: GameType | undefined = undefined): void {
    game = game || store.gameW.game;
    game.buyableSciences.push(...game.sciencesBag.splice(0, needed));
  }

  pushSector(
    tile: Tile,
    obj: { orientation: number; x: number; y: number },
    game: GameType | undefined = undefined
  ): void {
    game = game || store.gameW.game;
    game.sectors.push({
      tile,
      ...obj,
      enemies: Tiles[tile].enemies || [],
      tokens: [],
    });
  }

  selectFaction(faction: Faction): void {
    const obj = Factions[faction];
    utils.getMe().d = {
      faction,
      ships: obj.ships,
      storage: obj.storage,
      income: {
        [Resource.materials]: 1,
        [Resource.science]: 1,
        [Resource.gold]: 1,
      },
      well: {
        [Resource.materials]: 0,
        [Resource.science]: 0,
        [Resource.gold]: 0,
      },
      discs: 13,
      usedDiscs: 0,
      research: obj.research.map((science) => ({
        science,
        track: Sciences[science].track,
      })),
      twoPointers: 0,
    };
    store.update(`selected ${faction}`);
  }

  research(execute: boolean, science: Science, track: Track): boolean {
    if (track === Track.black) return false;
    const researched = utils
      .getMe()
      .d!.research.filter((obj) => obj.track === track).length;
    if (researched > 100) return false;
    const obj = Sciences[science];
    if (obj.track !== Track.black && obj.track !== track) return false;
    const cost = Math.max(obj.cost - researched, obj.floor);
    if (utils.getMe().d!.storage[Resource.science] < cost) return false;
    const game = store.gameW.game;
    if (game.action !== Action.research) return false;
    if (execute) {
      utils.getMe().d!.storage[Resource.science] -= cost;
      utils.getMe().d!.research.push({ track, science });
      game.buyableSciences.splice(
        game.buyableSciences.findIndex((s) => s === science),
        1
      );
      store.update(`researched ${science}`);
    }
    return true;
  }
}

const utils = new Utils();

export default utils;

export { store };
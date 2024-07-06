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
  Upgrade,
  Upgrades,
} from "./library";

import { GameType, Params, PlayerType } from "./NewGame";
import { Action, Rank, Resource, Sector, Ship, Track } from "./gameTypes";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(params: Params): GameType {
    const numPlayers = Object.keys(params.lobby).length;
    const game: GameType = {
      params,
      currentPlayer: numPlayers - 1,

      year: 1,
      action: { action: Action.selectFaction },
      startingPlayer: 0,
      players: [],
      sectors: [
        utils.buildSector("100", {
          orientation: 0,
          x: 0,
          y: 0,
        }),
      ],
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
    game.sectors.push(
      ...utils
        .shuffle(["201", "202", "203", "204", "205", "206"] as Tile[])
        .map((tile, i) => ({ tile, i }))
        .filter(({ i }) => (i * numPlayers) % 6 >= numPlayers)
        .map(({ tile, i }) => utils.buildStartingSector(tile, i))
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

  buildStartingSector(tile: Tile, orientation: number): Sector {
    return utils.buildSector(tile, {
      orientation,
      x: -Math.round(
        (Math.sin((Math.PI * orientation) / 3) * 4) / Math.sqrt(3)
      ),
      y: -Math.round(Math.cos((Math.PI * orientation) / 3) * 4),
    });
  }

  drawResearch(needed: number, game: GameType | undefined = undefined): void {
    game = game || store.gameW.game;
    game.buyableSciences.push(...game.sciencesBag.splice(0, needed));
  }

  buildSector(
    tile: Tile,
    obj: { orientation: number; x: number; y: number }
  ): Sector {
    return {
      tile,
      ...obj,
      units: (Tiles[tile].npcs || []).map((ship) => ({
        ship,
      })),
      tokens: [],
    };
  }

  // execute

  selectFaction(execute: boolean, faction: Faction): boolean {
    if (!utils.isMyTurn()) return false;
    if (execute) {
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
      const game = store.gameW.game;
      game.sectors.push(
        utils.buildStartingSector(
          faction,
          Math.ceil((utils.myIndex() * 6) / game.players.length)
        )
      );
      if (game.currentPlayer === 0) {
        game.action = { action: Action.turn };
      } else {
        game.currentPlayer--;
      }
      store.update(`selected ${faction}`);
    }
    return true;
  }

  research(execute: boolean, science: Science, track: Track): boolean {
    if (!utils.isMyTurn()) return false;
    const game = store.gameW.game;
    if (game.action.action !== Action.research) return false;
    if (track === Track.black) return false;
    const researched = utils
      .getMe()
      .d!.research.filter((obj) => obj.track === track).length;
    if (researched > 100) return false;
    const obj = Sciences[science];
    if (obj.track !== Track.black && obj.track !== track) return false;
    const cost = Math.max(obj.cost - researched, obj.floor);
    if (utils.getMe().d!.storage[Resource.science] < cost) return false;
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

  explorePortal(
    execute: boolean,
    sector: Sector,
    orientation: number
  ): boolean {
    if (!utils.isMyTurn()) return false;
    const game = store.gameW.game;
    if (game.action.action !== Action.explore) return false;
    const state = {
      orientation,
      x:
        sector.x +
        Math.round((Math.sin((Math.PI * orientation) / 3) * 2) / Math.sqrt(3)),
      y: sector.y + Math.round(Math.cos((Math.PI * orientation) / 3) * 2),
    };
    const d = [(state.x * 1.5) / 2, (state.y * Math.sqrt(3)) / 4]
      .map((v) => Math.pow(v, 2))
      .sum();
    const rank = d < 1 ? Rank.i : d < 4 ? Rank.ii : Rank.iii;
    if (execute) {
      store.update(`explored rank ${Rank[rank]}`);
    }
    return true;
  }

  move(
    execute: boolean,
    ship: Ship,
    source: Sector,
    destination: Sector
  ): boolean {
    if (!utils.isMyTurn()) return false;
    const game = store.gameW.game;
    if (game.action.action !== Action.move) return false;
    const sourceTile = Tiles[source.tile];
    const myFaction = utils.getMe().d!.faction;
    const units = [true, false].map(
      (match) =>
        source.units!.filter((unit) => (unit.faction === myFaction) === match)
          .length
    );
    if (units[0] <= units[1]) return false;
    const destinationTile = Tiles[destination.tile];
    if (
      !(
        (sourceTile.warp_portal ||
          (source.tokens || []).includes("warp_portal")) &&
        (destinationTile.warp_portal ||
          (destination.tokens || []).includes("warp_portal"))
      )
    ) {
      const distance = [source.x - destination.x, source.y - destination.y]
        .map(Math.abs)
        .sum();
      if (distance > 2) return false;
      const num_wormholes = [
        sourceTile.portals.includes(-1),
        destinationTile.portals.includes(-1),
        utils
          .getMe()
          .d!.research.find(({ science }) => science === "wormhole_generator"),
      ].filter(Boolean).length;
      if (num_wormholes < 2) return false;
    }
    if (execute) {
      source.units!.splice(
        source.units!.findIndex(
          (unit) => unit.faction === myFaction && unit.ship === ship
        ),
        1
      );
      destination.units = (destination.units || []).concat({
        faction: myFaction,
        ship,
      });
      store.update(`moved a ${Ship[ship]}`);
    }
    return true;
  }

  build(execute: boolean, ship: Ship, sector: Sector): boolean {
    if (!utils.isMyTurn()) return false;
    const game = store.gameW.game;
    if (game.action.action !== Action.build) return false;
    const myD = utils.getMe().d!;
    if (
      ship === Ship.starbase &&
      !myD.research.find(({ science }) => science === "starbase")
    )
      return false;
    if (
      game.sectors.flatMap((sector) =>
        (sector.units || []).filter(
          (unit) => unit.faction === myD.faction && unit.ship === ship
        )
      ).length ===
      {
        [Ship.interceptor]: 8,
        [Ship.cruiser]: 4,
        [Ship.dreadnought]: 2,
        [Ship.starbase]: 4,
      }[ship]
    )
      return false;
    const cost = {
      [Ship.interceptor]: 3,
      [Ship.cruiser]: 5,
      [Ship.dreadnought]: 8,
      [Ship.starbase]: 3,
    }[ship];
    if (myD.storage[Resource.materials] < cost) return false;
    if (execute) {
      myD.storage[Resource.materials] -= cost;
      sector.units = (sector.units || []).concat({
        faction: myD.faction,
        ship,
      });
      store.update(`built ${Ship[ship]}`);
    }
    return true;
  }

  buildToken(
    execute: boolean,
    token: "orbital" | "monolith",
    sector: Sector
  ): boolean {
    if (!utils.isMyTurn()) return false;
    const game = store.gameW.game;
    if (game.action.action !== Action.build) return false;
    const myD = utils.getMe().d!;
    const cost = {
      orbital: 4,
      monolith: 10,
    }[token];
    if (myD.storage[Resource.materials] < cost) return false;
    if (execute) {
      myD.storage[Resource.materials] -= cost;
      sector.tokens = (sector.tokens || []).concat(token);
      store.update(`built ${token}`);
    }
    return true;
  }

  upgrade(
    execute: boolean,
    ship: Ship,
    index: number,
    upgrade: Upgrade
  ): boolean {
    if (!utils.isMyTurn()) return false;
    const game = store.gameW.game;
    if (game.action.action !== Action.upgrade) return false;
    const blueprint = utils.getMe().d!.ships[ship];
    if (
      blueprint
        .map((u, i) => (i === index ? upgrade : u))
        .map((u) => Upgrades[u].energy)
        .sum() < 0
    )
      return false;
    if (execute) {
      blueprint[index] = upgrade;
      store.update(`upgraded ${Ship[ship]} with ${upgrade}`);
    }
    return true;
  }
}

const utils = new Utils();

export default utils;

export { store };

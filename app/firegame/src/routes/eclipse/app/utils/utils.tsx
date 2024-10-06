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
  Token,
  Upgrade,
  Upgrades,
} from "./library";

import { GameType, Params, PlayerType } from "./NewGame";
import { Action, Rank, Resource, Sector, Ship, Track } from "./gameTypes";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(params: Params): GameType {
    const numPlayers = Object.keys(params.lobby).length;
    if (numPlayers < 2 || numPlayers > 6) {
      // throw Error("numPlayers");
      alert("numPlayers");
    }
    const game: GameType = {
      params,
      currentPlayer: numPlayers - 1,

      year: 0,
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
          utils.repeat(key as Science, value.count)
        )
      ),
      diamonds: utils.shuffle(
        Object.entries(Diamonds).flatMap(([key, obj]) =>
          utils.repeat(key as Diamond, obj.count)
        )
      ),
      military: utils.shuffle(
        Object.entries({ 1: 12, 2: 10, 3: 7, 4: 4 }).flatMap(([value, count]) =>
          utils.repeat(parseInt(value), count)
        )
      ),
      tiles: Object.fromEntries(
        utils
          .enumArray(Rank)
          .filter((rank) => rank !== Rank.special)
          .map((rank) => ({
            rank,
            arr: utils.shuffle(
              Object.keys(Tiles).filter((t) => Tiles[t].rank === rank)
            ),
          }))
          .map(({ rank, arr }) => [
            rank,
            rank === Rank.iii
              ? arr.slice(
                  -{ 1: 10, 2: 5, 3: 8, 4: 14, 5: 16, 6: 18 }[numPlayers]!
                )
              : arr,
          ])
      ),
    };
    const playerOrientations = utils
      .count(numPlayers)
      .map((index) => utils.getPlayerStartingOrientation(index, numPlayers));
    const guardianTiles = utils.shuffle(
      Object.entries(Tiles)
        .map(([tile, obj]) => ({ tile, obj }))
        .filter(({ obj }) => (obj.enemies || []).includes(Ship.cruiser))
        .map(({ tile }) => tile as Tile)
    );
    game.sectors.push(
      ...utils
        .count(6)
        .filter((i) => !playerOrientations.includes(i))
        .filter((index) => guardianTiles[index])
        .map((orientation, index) =>
          utils.buildStartingSector(guardianTiles[index], orientation)
        )
    );
    for (
      var needed;
      (needed =
        { 1: 10, 2: 12, 3: 14, 4: 16, 5: 18, 6: 20 }[numPlayers]! -
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

  // {1: 10, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9}
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
      units: (Tiles[tile].enemies || []).map((ship) => ({
        ship,
      })),
      tokens: [],
      colonists: Tiles[tile].colonies.map((obj) => ({ ...obj, active: false })),
    };
  }

  getPlayerStartingOrientation(
    playerIndex: number,
    numPlayers: number
  ): number {
    return Math.ceil((playerIndex * 6) / numPlayers);
  }

  pass(): void {
    utils.getMe().d!.passed = true;
    utils.getMe().d!.reaction = true;
    if (store.gameW.game.startingPlayer === -1) {
      store.gameW.game.startingPlayer = utils.myIndex();
      utils.getMe().d!.resources[Resource.gold] += 2;
    } else if (
      store.gameW.game.players.find((p) => !p.d!.passed) === undefined
    ) {
      alert("end of year");
    } else {
      utils.incrementPlayerTurn();
    }
    store.update("passed");
  }

  // execute

  selectFaction(execute: boolean, faction: Faction): boolean {
    if (!utils.isMyTurn()) return false;
    if (execute) {
      const obj = Factions[faction];
      utils.getMe().d = {
        faction,
        reaction: false,
        passed: false,
        ships: obj.ships,
        resources: obj.storage,
        income: {
          [Resource.materials]: 0,
          [Resource.science]: 0,
          [Resource.gold]: 0,
        },
        well: {
          [Resource.materials]: 0,
          [Resource.science]: 0,
          [Resource.gold]: 0,
        },
        remainingDiscs: 12,
        totalDiscs: 12,
        research: obj.research.map((science) => ({
          science,
          track: Sciences[science].track,
        })),
        twoPointers: 0,
      };
      const game = store.gameW.game;
      game.sectors.push({
        faction,
        ...utils.buildStartingSector(
          obj.tile,
          utils.getPlayerStartingOrientation(
            utils.myIndex(),
            game.players.length
          )
        ),
        units: [
          {
            faction,
            ship: faction === "black" ? Ship.cruiser : Ship.interceptor,
          },
        ],
      });
      if (game.currentPlayer === game.startingPlayer) {
        game.startingPlayer = -1;
        game.year = 1;
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
    if (researched >= 7) return false;
    const obj = Sciences[science];
    if (obj.track !== Track.black && obj.track !== track) return false;
    const cost = Math.max(obj.cost - researched, obj.floor);
    if (utils.getMe().d!.resources[Resource.science] < cost) return false;
    if (execute) {
      utils.getMe().d!.resources[Resource.science] -= cost;
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
    if (game.action.state?.tile !== undefined) return false;
    const state = {
      orientation: 0,
      x:
        sector.x +
        Math.round((Math.sin((Math.PI * orientation) / 3) * 2) / Math.sqrt(3)),
      y: sector.y + Math.round(Math.cos((Math.PI * orientation) / 3) * 2),
    };
    const d = [(state.x * 1.5) / 2, (state.y * Math.sqrt(3)) / 4]
      .map((v) => Math.pow(v, 2))
      .sum();
    const rank = d < 1 ? Rank.i : d < 4 ? Rank.ii : Rank.iii;
    if (game.tiles[rank] === undefined) return false;
    if (execute) {
      const tile = game.tiles[rank]!.pop()!;
      game.sectors.push(utils.buildSector(tile, state));
      game.action.state = Object.assign({ tile }, game.action.state);
      store.update(`explored rank ${Rank[rank]}`);
    }
    return true;
  }

  finishExplore(execute: boolean, rotate: number | null): boolean {
    const tile = store.gameW.game.action.state!.tile;
    if (execute) {
      if (
        utils.getMe().d!.faction === "green" &&
        !store.gameW.game.action.state!.greenExplored
      ) {
        store.gameW.game.action.state!.greenExplored = true;
      } else {
        store.gameW.game.action = { action: Action.turn };
        utils.incrementPlayerTurn();
      }
      if (rotate === null) {
        store.update("discarded the tile");
      } else {
        store.gameW.game.sectors.find(
          (sector) => sector.tile === tile
        )!.orientation = rotate;
        store.update("placed the tile");
      }
    }
    return false;
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
          (source.tokens || []).includes(Token.warp_portal)) &&
        (destinationTile.warp_portal ||
          (destination.tokens || []).includes(Token.warp_portal))
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
    if (myD.resources[Resource.materials] < cost) return false;
    if (execute) {
      myD.resources[Resource.materials] -= cost;
      sector.units = (sector.units || []).concat({
        faction: myD.faction,
        ship,
      });
      store.update(`built ${Ship[ship]}`);
    }
    return true;
  }

  buildToken(execute: boolean, token: Token, sector: Sector): boolean {
    if (!utils.isMyTurn()) return false;
    const game = store.gameW.game;
    if (game.action.action !== Action.build) return false;
    const myD = utils.getMe().d!;
    const cost = {
      [Token.orbital]: 4,
      [Token.monolith]: 10,
      [Token.warp_portal]: 0,
    }[token];
    if (myD.resources[Resource.materials] < cost) return false;
    if (execute) {
      myD.resources[Resource.materials] -= cost;
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
      blueprint.upgrades
        .map((u, i) => (i === index ? upgrade : u))
        .map((u) => Upgrades[u])
        .concat(blueprint.builtIn || {})
        .map((u) => u.energy)
        .sum() < 0
    )
      return false;
    if (execute) {
      blueprint.upgrades[index] = upgrade;
      store.update(`upgraded ${Ship[ship]} with ${upgrade}`);
    }
    return true;
  }
}

const utils = new Utils();

export default utils;

export { store };

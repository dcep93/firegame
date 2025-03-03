import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import {
  BoardMap,
  maps,
  powerplants,
  Resource,
  startingBankResources,
} from "./bank";

export type GameType = {
  currentPlayer: number;
  players: PlayerType[];

  step: number;
  phase: Phase;
  mapName: string;
  playerOrder: number[];
  deckIndices?: number[];
  costs?: { [pp: number]: number };
  outOfPlayZones?: string[]; // todo
  resources: { [r in Resource]?: number };
  auction?: { playerIndex: number; i: number; cost: number };
  auctionPassers?: { [playerIndex: number]: number };
};

export type PlayerType = {
  userId: string;
  userName: string;

  color: string;
  money: number;
  powerPlantIndices?: number[];
  cityIndices?: number[];
  resources: { [r in Resource]?: number };
};

enum Phase {
  powerplants,
  resource,
  city,
}

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(): Promise<GameType> {
    const numPlayers = Object.entries(store.lobby).length;
    return Promise.resolve({
      step: 1,
      phase: Phase.powerplants,
      currentPlayer: 0,
      mapName: "germany",
      playerOrder: utils.shuffle(utils.count(numPlayers)),
      players: Object.entries(store.lobby).map(([userId, userName], index) => ({
        userId,
        userName,
        color: ["red", "blue", "green", "pink", "yellow", "orange"][index],
        money: 50,
        powerPlantIndices: [],
        cityIndices: [],
        resources: {
          [Resource.coal]: 0,
          [Resource.oil]: 0,
          [Resource.garbage]: 0,
          [Resource.uranium]: 0,
        },
      })),
      deckIndices: ((grouped) =>
        ((plugs, sockets) =>
          plugs
            .splice(0, 9)
            .concat(
              utils.shuffle(
                plugs
                  .slice({ 2: 1, 3: 2, 4: 1 }[numPlayers] || 0)
                  .concat(sockets.slice({ 2: 5, 3: 6, 4: 3 }[numPlayers] || 0))
              )
            )
            .map(({ index }) => index)
            .concat(-1))(
          utils.shuffle(grouped["true"]),
          utils.shuffle(grouped["false"])
        ))(utils.groupByF(powerplants, (pp) => pp.isPlug.toString())),
      outOfPlayZones: [],
      resources: startingBankResources,
    } as GameType);
  }

  auctionPowerPlant(
    execute: boolean,
    pp: number,
    i: number,
    j: number
  ): boolean {
    if (
      utils.isMyTurn() &&
      pp !== -1 &&
      store.gameW.game.phase === Phase.powerplants &&
      store.gameW.game.auction === undefined
    ) {
      if (store.gameW.game.step === 3 || j <= 3) {
        if (utils.getCurrent().money >= powerplants[pp].cost) {
          if (execute) {
            store.gameW.game.auction = {
              playerIndex: utils.myIndex(),
              i,
              cost: powerplants[pp].cost,
            };
            store.update(`auctions $${powerplants[pp].cost}`);
          }
          return true;
        }
      }
    }
    return false;
  }

  needsToDumpPowerPlant(): boolean {
    if (
      utils.isMyTurn() &&
      (utils.getCurrent().powerPlantIndices || []).length > 3
    ) {
      return true;
    }
    return false;
  }

  dumpPowerPlant(execute: boolean, i: number): boolean {
    if (utils.needsToDumpPowerPlant()) {
      if (execute) {
        const spliced = utils.getCurrent().powerPlantIndices!.splice(i, 1)[0];
        utils.finishPowerPlantPurchase();
        store.update(`discarded $${powerplants[spliced].cost}`);
      }
      return true;
    }
    return false;
  }

  finishPowerPlantPurchase() {
    // todo
  }

  pass(execute: boolean): boolean {
    if (!utils.isMyTurn()) {
      return false;
    }
    if (store.gameW.game.phase === Phase.powerplants) {
      if (
        store.gameW.game.auction === undefined &&
        utils.getCurrent().cityIndices === undefined
      ) {
        return false;
      }
      if (store.gameW.game.auction?.playerIndex === utils.myIndex()) {
        return false;
      }
    }
    if (execute) {
      store.update("passed"); // todo
    }
    return true;
  }

  bidOnPowerPlant(execute: boolean, cost: number): boolean {
    if (!execute) {
      return false;
    }
    if (utils.isMyTurn()) {
      if (
        cost <= utils.getCurrent()!.money &&
        cost >= store.gameW.game.auction!.cost
      ) {
        Object.assign(store.gameW.game.auction!, {
          playerIndex: utils.myIndex(),
          cost,
        });
        const pp = store.gameW.game.deckIndices![store.gameW.game.auction!.i];
        store.update(`bid $${cost} on $${powerplants[pp].cost}`); // todo
      }
    }
    return false;
  }

  buyCity(execute: boolean, index: number): boolean {
    if (!execute) {
      return false;
    }
    if (utils.isMyTurn() && store.gameW.game.phase === Phase.city) {
      const cost = 0;
      if (utils.getCurrent().money >= cost) {
        if (execute) {
          utils.getCurrent().money -= cost;
          store.update(`bought ${utils.getMap().cities[index].name}`);
        }
      }
    }
    return false;
  }

  getMap(): BoardMap {
    return maps.find((m) => m.name === store.gameW.game.mapName)!;
  }

  dumpResource(execute: boolean, resource: Resource): boolean {
    if (!execute) {
      return false;
    }
    if (utils.isMyTurn()) {
      const excessResources = utils.getExcessResources();
      if ((excessResources[resource] || 0) > 0) {
        if (execute) {
          utils.getCurrent().resources[resource]!--;
          utils.finishPowerPlantPurchase();
          store.update(`dumped ${Resource[resource]}`);
        }
        return true;
      }
    }
    return false;
  }

  hasExcessResources(): boolean {
    const excessResources = utils.getExcessResources();
    return Object.values(excessResources).filter((c) => c > 0).length > 0;
  }

  getExcessResources(): { [r in Resource]?: number } {
    const resources = Object.apply({}, utils.getCurrent().resources as any) as {
      [r in Resource]?: number;
    };
    (utils.getCurrent().powerPlantIndices || [])
      .map((i) => powerplants[i].resources)
      .map((rs) =>
        Object.entries(rs).forEach(([r, count]) => {
          resources[r as unknown as Resource]! -= 2 * count;
        })
      );
    [Resource.coal, Resource.oil].forEach((r) => {
      if (resources[r]! > -resources[Resource.hybrid]!) {
        resources[Resource.hybrid]! += resources[r]!;
        resources[r] = 0;
      }
    });
    return resources;
  }

  getResourceCost(resource: Resource): number {
    const count = store.gameW.game.resources[resource]!;
    const costs = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16].reverse();
    const tier =
      resource === Resource.uranium ? count - 1 : Math.ceil(count / 3) + 3;
    return costs[tier];
  }

  buyResource(execute: boolean, resource: Resource): boolean {
    if (!execute) {
      return false;
    }
    if (utils.isMyTurn()) {
      const cost = utils.getResourceCost(resource);
      if (utils.getCurrent().money >= cost) {
        utils.getCurrent().money -= cost;
        store.gameW.game.resources[resource]!--;
        store.update(`bought ${Resource[resource]} for $${cost}`);
      }
    }
    return false;
  }

  getAction(): string {
    switch (store.gameW.game.phase) {
      case Phase.powerplants:
        if (store.gameW.game.auction !== undefined) {
          return `bidding on $${
            powerplants[
              store.gameW.game.deckIndices![store.gameW.game.auction.i]
            ].cost
          }`;
        }
        if (utils.needsToDumpPowerPlant()) {
          return "dumping a power plant";
        }
        if (utils.hasExcessResources()) {
          return "dumping resources";
        }
        return "selecting for auction";
      case Phase.resource:
        return "buying resources";
      case Phase.city:
        return "buying cities";
    }
  }

  getPlayerBackgroundColor(playerIndex: number): string | undefined {
    if (utils.currentIndex() === playerIndex) {
      return "grey";
    }
    if (store.gameW.game.phase === Phase.powerplants) {
      const passer = (store.gameW.game.auctionPassers || {})[playerIndex];
      if (passer === undefined) {
        return "lightgreen"; // todo
      }
    }
    return undefined;
  }
}

const utils = new Utils();

export default utils;

export { store };

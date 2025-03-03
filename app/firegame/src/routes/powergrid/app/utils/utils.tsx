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
        if (utils.getMe().money >= powerplants[pp].cost) {
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

  dumpPowerPlant(execute: boolean, i: number): boolean {
    if (
      utils.isMyTurn() &&
      (utils.getMe().powerPlantIndices || []).length > 3
    ) {
      if (execute) {
        const spliced = utils.getMe().powerPlantIndices!.splice(i, 1)[0];
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
        utils.getMe().cityIndices === undefined
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
        cost <= utils.getMe()!.money &&
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
      if (utils.getMe().money >= cost) {
        if (execute) {
          utils.getMe().money -= cost;
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
      if (excessResources[resource]) {
        if (execute) {
          utils.getMe().resources[resource]!--;
          store.update(`dumped ${Resource[resource]}`); // todo
        }
        return true;
      }
    }
    return false;
  }

  getExcessResources(): { [r in Resource]?: number } {
    return {}; // todo
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
      if (utils.getMe().money >= cost) {
        utils.getMe().money -= cost;
        store.gameW.game.resources[resource]!--;
        store.update(`bought ${Resource[resource]} for $${cost}`);
      }
    }
    return false;
  }

  getAction(): string {
    return "picking a card for auction"; // todo
  }

  getPlayerBackgroundColor(playerIndex: number): string | undefined {
    if (utils.currentIndex() === playerIndex) {
      return "grey";
    }
    if (store.gameW.game.phase === Phase.powerplants) {
      const passer = (store.gameW.game.auctionPassers || {})[playerIndex];
      if (passer === undefined) {
        return "grey";
      }
    }
    return undefined;
  }
}

const utils = new Utils();

export default utils;

export { store };

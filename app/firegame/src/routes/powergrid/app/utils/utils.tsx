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
  auctionPassers?: { [playerIndex: number]: boolean };
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

export enum Action {
  bidding,
  dumping_power_plant,
  dumping_resources,
  selecting_auction,
  buying_resources,
  buying_cities,
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
              playerIndex: store.gameW.game.currentPlayer,
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

  getNextAuctionPlayer(): number {
    return (
      store.gameW.game.playerOrder.find(
        (playerIndex) =>
          store.gameW.game.auctionPassers![playerIndex] === undefined
      ) || -1
    );
  }

  pass(execute: boolean): boolean {
    if (!execute) {
      return false;
    }
    if (!utils.isMyTurn()) {
      return false;
    }
    const currentIndex = store.gameW.game.playerOrder.findIndex(
      (p) => p === store.gameW.game.currentPlayer
    );
    switch (utils.getAction()) {
      case Action.selecting_auction:
        if (utils.getCurrent().powerPlantIndices === undefined) {
          return false;
        }
        if (!store.gameW.game.auctionPassers)
          store.gameW.game.auctionPassers = {};
        store.gameW.game.auctionPassers[store.gameW.game.currentPlayer] = true;
        const nextAuctionPlayer = utils.getNextAuctionPlayer();
        if (nextAuctionPlayer === -1) {
          utils.startBuyingResources();
          store.update(`passed - buying resources`);
          return true;
        }
        store.gameW.game.currentPlayer = nextAuctionPlayer;
        break;
      case Action.bidding:
        const auction = store.gameW.game.auction!;
        if (auction.playerIndex === utils.currentIndex()) {
          return false;
        }
        if (!store.gameW.game.auctionPassers)
          store.gameW.game.auctionPassers = {};
        store.gameW.game.auctionPassers[store.gameW.game.currentPlayer] = false;
        const nextBidPlayer = store.gameW.game.playerOrder
          .concat(store.gameW.game.playerOrder)
          .splice(currentIndex, store.gameW.game.playerOrder.length)
          .find(
            (playerIndex) =>
              store.gameW.game.auctionPassers![playerIndex] === undefined
          )!;
        if (nextBidPlayer === auction.playerIndex) {
          delete store.gameW.game.auction;
          const pp = store.gameW.game.deckIndices!.splice(auction.i, 1)[0];
          utils.getCurrent().money -= auction.cost;
          if (!utils.getCurrent().powerPlantIndices)
            utils.getCurrent().powerPlantIndices = [];
          utils.getCurrent().powerPlantIndices!.push(pp);
          const nextAuctionPlayer = utils.getNextAuctionPlayer();
          if (nextAuctionPlayer === -1) {
            delete store.gameW.game.auctionPassers;
            utils.startBuyingResources();
            store.update(
              `passed - ${
                store.gameW.game.players[auction!.playerIndex].color
              } bought $${powerplants[pp].cost}(${
                auction.cost
              }) - buying resources`
            );
            return true;
          }
          store.gameW.game.auctionPassers = Object.fromEntries(
            Object.entries(store.gameW.game.auctionPassers || {}).filter(
              ([_, passedAuction]) => passedAuction
            )
          );
          store.gameW.game.currentPlayer = nextAuctionPlayer;
          store.update(
            `passed - ${
              store.gameW.game.players[auction!.playerIndex].color
            } bought $${powerplants[pp].cost}(${auction.cost})`
          );
          return true;
        }
        store.gameW.game.currentPlayer = nextBidPlayer;
        break;
      case Action.dumping_power_plant:
        return false;
      case Action.dumping_resources:
        return false;
      case Action.buying_resources:
        if (currentIndex === 0) {
          store.gameW.game.phase = Phase.city;
          store.gameW.game.currentPlayer = store.gameW.game.playerOrder
            .slice()
            .reverse()[0];
          store.update("passed - buying cities");
          return true;
        }
        store.gameW.game.currentPlayer =
          store.gameW.game.playerOrder[currentIndex - 1];
        break;
      case Action.buying_cities:
        if (currentIndex === 0) {
          utils.newYear();
          store.update("passed - new year");
          return true;
        }
        store.gameW.game.currentPlayer =
          store.gameW.game.playerOrder[currentIndex - 1];
        break;
    }
    store.update("passed");
    return true;
  }

  newYear() {
    // todo
  }

  startBuyingResources() {
    store.gameW.game.phase = Phase.resource;
    // todo
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
          playerIndex: store.gameW.game.currentPlayer,
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

  getAction(): Action {
    switch (store.gameW.game.phase) {
      case Phase.powerplants:
        if (store.gameW.game.auction !== undefined) {
          return Action.bidding;
        }
        if (utils.needsToDumpPowerPlant()) {
          return Action.dumping_power_plant;
        }
        if (utils.hasExcessResources()) {
          return Action.dumping_resources;
        }
        return Action.selecting_auction;
      case Phase.resource:
        return Action.buying_resources;
      case Phase.city:
        return Action.buying_cities;
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

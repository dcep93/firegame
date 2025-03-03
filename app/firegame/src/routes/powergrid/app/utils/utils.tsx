import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import {
  BoardMap,
  incomes,
  maps,
  PowerPlant,
  powerplants,
  Resource,
  startingBankResources,
} from "./bank";

export type GameType = {
  currentPlayer: number;
  players: PlayerType[]; // todo 2p

  year: number;
  step: number;
  phase: Phase;
  mapName: string;
  playerOrder: number[];
  deckIndices?: number[];
  costs?: { [pp: number]: number };
  outOfPlayZones?: string[]; // todo
  resources: { [r in Resource]?: number };
  auctionPassers?: { [playerIndex: number]: boolean };
  auction?: { playerIndex: number; i: number; cost: number };
  bureocracyUsed?: { [ppIndex: number]: boolean };
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

export enum Phase {
  selecting_auction,
  bidding,
  dumping_power_plant,
  dumping_resources,
  buying_resources,
  buying_cities,
  bureocracy,
}

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(): Promise<GameType> {
    const numPlayers = Object.entries(store.lobby).length;
    return Promise.resolve({
      year: 1,
      step: 1,
      phase: Phase.selecting_auction,
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
      store.gameW.game.phase === Phase.selecting_auction
    ) {
      if (store.gameW.game.step === 3 || j <= 3) {
        if (utils.getCurrent().money >= powerplants[pp].cost) {
          if (execute) {
            store.gameW.game.phase = Phase.bidding;
            store.gameW.game.auction = {
              playerIndex: store.gameW.game.currentPlayer,
              i,
              cost: powerplants[pp].cost - 1,
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

  clickPowerPlant(execute: boolean, i: number): boolean {
    if (!utils.isMyTurn()) {
      return false;
    }
    switch (store.gameW.game.phase) {
      case Phase.dumping_power_plant:
        if (execute) {
          const spliced = utils.getCurrent().powerPlantIndices!.splice(i, 1)[0];
          utils.finishPowerPlantPurchase();
          store.update(`discarded $${powerplants[spliced].cost}`);
        }
        return true;
      case Phase.bureocracy:
        if (!store.gameW.game.bureocracyUsed)
          store.gameW.game.bureocracyUsed = {};
        if (store.gameW.game.bureocracyUsed[i]) {
          return false;
        }
        const ppp = powerplants[utils.getCurrent().powerPlantIndices![i]];
        const spend = utils.getSpend(ppp);
        if (utils.cantAfford(spend)) {
          return false;
        }
        if (execute) {
          Object.entries(spend).forEach(([r, count]) => {
            store.gameW.game.resources[r as unknown as Resource]! += count;
            utils.getCurrent().resources[r as unknown as Resource]! -= count;
          });
          store.gameW.game.bureocracyUsed[i] = true;
          store.update(
            `powered $${ppp.cost} - using ${utils.getResourceString(spend)}`
          );
        }
        return true;
    }
    return false;
  }

  getResourceString(rs: { [r in Resource]?: number }): string {
    return Object.entries(rs)
      .map(([r, count]) => `${Resource[r as unknown as Resource]}:${count}`)
      .join(",");
  }

  cantAfford(spend: { [r in Resource]?: number }): boolean {
    return (
      Object.entries(spend).find(
        ([r, count]) =>
          (utils.getCurrent().resources[r as unknown as Resource] || 0) < count
      ) !== undefined
    );
  }

  getSpend(ppp: PowerPlant): { [r in Resource]?: number } {
    if (ppp.resources[Resource.renewable] !== undefined) {
      return {};
    }
    const numHybrid = ppp.resources[Resource.hybrid];
    if (numHybrid !== undefined) {
      const choices = utils
        .count(numHybrid + 1)
        .map((numCoal) => ({
          [Resource.coal]: numCoal,
          [Resource.oil]: numHybrid - numCoal,
        }))
        .filter((spend) => !utils.cantAfford(spend));
      const chosen = choices.find(
        (c) =>
          choices.length === 1 ||
          window.confirm(`spend ${utils.getResourceString(c)} ?`)
      );
      if (chosen) {
        return chosen;
      }
    }
    return ppp.resources;
  }

  finishPowerPlantPurchase() {
    // todo
    delete store.gameW.game.auction;
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
    switch (store.gameW.game.phase) {
      case Phase.selecting_auction:
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
      case Phase.bidding:
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
          const pp = store.gameW.game.deckIndices!.splice(auction.i, 1)[0];
          utils.getCurrent().money -= auction.cost;
          if (!utils.getCurrent().powerPlantIndices)
            utils.getCurrent().powerPlantIndices = [];
          utils.getCurrent().powerPlantIndices!.push(pp);
          const nextAuctionPlayer = utils.getNextAuctionPlayer();
          if (nextAuctionPlayer === -1) {
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
          store.gameW.game.phase = Phase.selecting_auction;
          store.update(
            `passed - ${
              store.gameW.game.players[auction!.playerIndex].color
            } bought $${powerplants[pp].cost}(${auction.cost})`
          );
          return true;
        }
        store.gameW.game.currentPlayer = nextBidPlayer;
        break;
      case Phase.dumping_power_plant:
        return false;
      case Phase.dumping_resources:
        return false;
      case Phase.buying_resources:
        if (currentIndex === 0) {
          store.gameW.game.phase = Phase.buying_cities;
          store.gameW.game.currentPlayer = store.gameW.game.playerOrder
            .slice()
            .reverse()[0];
          store.update("passed - buying cities");
          return true;
        }
        store.gameW.game.currentPlayer =
          store.gameW.game.playerOrder[currentIndex - 1];
        break;
      case Phase.buying_cities:
        if (currentIndex === 0) {
          store.gameW.game.phase = Phase.bureocracy;
          store.update("passed - bureocracy");
          return true;
        }
        store.gameW.game.currentPlayer =
          store.gameW.game.playerOrder[currentIndex - 1];
        break;
      case Phase.bureocracy:
        const numPowered = Math.min(
          Object.keys(store.gameW.game.bureocracyUsed || {})
            .map(
              (pp) =>
                powerplants[utils.getCurrent().powerPlantIndices![parseInt(pp)]]
                  .power
            )
            .reduce((a, b) => a + b, 0),
          (utils.getCurrent().cityIndices || []).length
        );
        utils.getCurrent().money += incomes[numPowered] || 0;
        delete store.gameW.game.bureocracyUsed;
      // todo
    }
    store.update("passed");
    return true;
  }

  reorderPlayers() {
    store.gameW.game.playerOrder = store.gameW.game.playerOrder
      .map((playerIndex) => ({
        playerIndex,
        p: store.gameW.game.players[playerIndex],
      }))
      .map(({ playerIndex, p }) => ({
        playerIndex,
        power: p
          .powerPlantIndices!.map((pp) => powerplants[pp].cost)
          .reduce((a, b) => a + b, 0),
        cities: (p.cityIndices || []).length,
      }))
      .sort((a, b) => a.cities - b.cities || a.power - b.power)
      .map(({ playerIndex }) => playerIndex)
      .reverse();
  }

  startBuyingResources() {
    if (store.gameW.game.year === 1) {
      utils.reorderPlayers();
    }
    store.gameW.game.phase = Phase.buying_resources;
    store.gameW.game.currentPlayer = store.gameW.game.playerOrder
      .slice()
      .reverse()[0];
    delete store.gameW.game.auctionPassers;
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
        store.update(`bid $${cost} on $${powerplants[pp].cost}`); // todo might win, might need to dump x2
      }
    }
    return false;
  }

  buyCity(execute: boolean, index: number): boolean {
    if (!execute) {
      return false;
    }
    if (utils.isMyTurn() && store.gameW.game.phase === Phase.buying_cities) {
      const connectionCost = utils.getConnectionCost(index);
      const cost =
        connectionCost +
        { 0: 10, 1: 15, 2: 20 }[
          store.gameW.game.players.filter((p) => p.cityIndices?.includes(index))
            .length
        ]!;
      if (utils.getCurrent().money >= cost) {
        if (execute) {
          utils.getCurrent().money -= cost;
          store.update(`bought ${utils.getMap().cities[index].name}`);
        }
      }
    }
    return false;
  }

  getConnectionCost(index: number): number {
    const c = utils.getCurrent();
    if (c.cityIndices === undefined) {
      return 0;
    }
    if (c.cityIndices.includes(index)) {
      return Number.POSITIVE_INFINITY;
    }
    const owned = Object.fromEntries(
      c.cityIndices.map((i) => [this.getMap().cities[i].name, true])
    );
    const seen: { [name: string]: boolean } = {};
    const queue = [{ name: this.getMap().cities[index].name, cost: 0 }];
    for (let i = 0; i < this.getMap().cities.length; i++) {
      if (queue.length === 0) {
        break;
      }
      queue.sort((a, b) => a.cost - b.cost);
      const first = queue.shift()!;
      if (owned[first.name]) {
        return first.cost;
      }
      seen[first.name] = true;
      queue.push(
        ...utils
          .getMap()
          .edges.map((e) => ({
            name: (e.c1 === first.name
              ? e.c2
              : e.c2 === first.name
              ? e.c1
              : null)!,
            cost: e.cost,
          }))
          .filter(({ name }) => name !== null && !seen[name])
          .map(({ name, cost }) => ({ name, cost: first.cost + cost }))
      );
    }
    throw new Error("infinite loop");
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

  getPlayerBackgroundColor(playerIndex: number): string | undefined {
    if (utils.currentIndex() === playerIndex) {
      return "grey";
    }
    if (
      [Phase.selecting_auction, Phase.bidding].includes(store.gameW.game.phase)
    ) {
      const passer = (store.gameW.game.auctionPassers || {})[playerIndex];
      if (passer === undefined) {
        return "lightgreen";
      }
    }
    return undefined;
  }

  isOver(): boolean {
    return (
      Math.max(
        ...store.gameW.game.players.map((p) => (p.cityIndices || []).length)
      ) >=
      { 2: 18, 3: 17, 4: 17, 5: 15, 6: 15 }[store.gameW.game.players.length]!
    );
  }
}

const utils = new Utils();

export default utils;

export { store };

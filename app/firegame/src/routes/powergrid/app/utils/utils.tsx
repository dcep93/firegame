import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import {
  BoardMap,
  incomes,
  maps,
  PowerPlant,
  powerplants,
  recharges,
  Resource,
  startingBankResources,
  totalResources,
} from "./bank";

export type GameType = {
  currentPlayer: number;
  players: PlayerType[];

  year: number;
  step: number;
  phase: Phase;
  mapName: string;
  playerOrder: number[];
  powerplantIndices?: number[];
  historicalCosts?: { [pp: number]: number };
  outOfPlayZones?: string[];
  resources: { [r in Resource]?: number };
  justDrewStep3: boolean;

  auctionPassers?: { [playerIndex: number]: AuctionState };
  auction?: { playerIndex: number; i: number; cost: number };
  bureocracyUsed?: { [ppIndex: number]: boolean };

  twoPlayer_trust?: PlayerType;
  germany_uraniumPhaseOut: boolean;
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

  nuking_cities,
  initializing_trust,
}
enum AuctionState {
  bought,
  passed,
  folded,
}

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(): Promise<GameType> {
    return Promise.resolve()
      .then(() => ({
        players: Object.entries(store.lobby).map(
          ([userId, userName], index) => ({
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
          })
        ),
      }))
      .then(
        ({ players }) =>
          ({
            justDrewStep3: false,
            germany_uraniumPhaseOut: false,
            year: 1,
            step: 1,
            phase: Phase.nuking_cities,
            currentPlayer: 0,
            mapName: "germany",
            playerOrder: utils.shuffle(utils.count(players.length)),
            players,
            powerplantIndices: ((grouped) =>
              ((plugs, sockets) =>
                plugs
                  .concat(
                    utils.shuffle(
                      sockets.slice({ 2: 8, 3: 8, 4: 4 }[players.length] || 0)
                    )
                  )
                  .map(({ index }) => index)
                  .concat(-1))(
                utils.shuffle(grouped["true"]),
                utils.shuffle(grouped["false"])
              ))(
              utils.groupByF(
                powerplants.map((pp, index) => ({ pp, index })),
                ({ pp }) => (pp.cost <= 10).toString()
              )
            ),
            outOfPlayZones: [],
            resources: startingBankResources,
          } as GameType)
      );
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
      (utils.getCurrent().powerPlantIndices || []).length >
      (store.gameW.game.players.length === 2 ? 4 : 3)
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
    delete store.gameW.game.auction;
    if (utils.needsToDumpPowerPlant()) {
      store.gameW.game.phase = Phase.dumping_power_plant;
    } else {
      const excessResources = utils.getExcessResources();
      if (Object.values(excessResources).find((c) => c > 0) !== undefined) {
        store.gameW.game.phase = Phase.dumping_power_plant;
      } else {
        const nextAuctionPlayer = utils.getNextAuctionPlayer();
        if (nextAuctionPlayer === -1) {
          utils.startBuyingResources();
        } else {
          store.gameW.game.phase = Phase.selecting_auction;
        }
      }
    }
  }

  getNextAuctionPlayer(): number {
    const t = store.gameW.game.twoPlayer_trust;
    if (t) {
      const biggestMarket = (store.gameW.game.powerplantIndices || [])
        .slice(0, store.gameW.game.step === 3 ? 7 : 8)
        .map((pp, i) => ({
          pp,
          i,
          sort: pp === -1 ? Number.POSITIVE_INFINITY : powerplants[pp].cost,
        }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ i }) => i)
        .slice(0, store.gameW.game.step === 3 ? 6 : 4)
        .map((pp, index) => ({
          index,
          value: pp < 0 ? Number.NEGATIVE_INFINITY : powerplants[pp].cost,
        }))
        .sort((a, b) => b.value - a.value)[0];
      if (!t.powerPlantIndices) {
        t.powerPlantIndices = [];
        utils.acquirePowerPlant(t, biggestMarket.index);
      } else {
        const smallestOwned = t.powerPlantIndices
          .map((pp, index) => ({
            index,
            value: powerplants[pp].cost,
          }))
          .sort((a, b) => a.value - b.value)[0];
        if (biggestMarket.value > smallestOwned.value) {
          utils.acquirePowerPlant(t, biggestMarket.index);
          t.powerPlantIndices!.sort((a, b) => a - b);
          if (t.powerPlantIndices!.length > 4) {
            t.powerPlantIndices!.shift();
          }
        }
      }
    }
    return (
      store.gameW.game.playerOrder.find(
        (playerIndex) =>
          store.gameW.game.auctionPassers![playerIndex] === undefined
      ) || -1
    );
  }

  getNextBidPlayer(): number {
    return (
      store.gameW.game.playerOrder
        .concat(store.gameW.game.playerOrder)
        .splice(
          store.gameW.game.playerOrder.findIndex(
            (p) => p === store.gameW.game.currentPlayer
          ),
          store.gameW.game.playerOrder.length
        )
        .find(
          (playerIndex) =>
            store.gameW.game.auctionPassers?.[playerIndex] === undefined &&
            store.gameW.game.auction!.playerIndex !== playerIndex
        ) || -1
    );
  }

  buyPowerPlant(): number {
    const p = utils.getCurrent();
    const auction = store.gameW.game.auction!;

    p.money -= auction.cost;
    if (!store.gameW.game.historicalCosts)
      store.gameW.game.historicalCosts = {};
    store.gameW.game.historicalCosts[auction.i] = auction.cost;
    store.gameW.game.auctionPassers![store.gameW.game.currentPlayer] =
      AuctionState.bought;
    this.finishPowerPlantPurchase();

    const pp = store.gameW.game.powerplantIndices![auction.i];
    utils.acquirePowerPlant(p, auction.i);
    return pp;
  }

  acquirePowerPlant(p: PlayerType, index: number) {
    const pp = store.gameW.game.powerplantIndices!.splice(index, 1)[0];
    if (utils.justEnteredStep3()) {
      store.gameW.game.powerplantIndices!.push(
        ...utils.shuffle(store.gameW.game.powerplantIndices!.splice(8))
      );
    }
    if (store.gameW.game.mapName === "germany" && powerplants[pp].cost === 39) {
      store.gameW.game.germany_uraniumPhaseOut = true;
    }
    if (!p.powerPlantIndices) p.powerPlantIndices = [];
    p.powerPlantIndices!.push(pp);
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
        store.gameW.game.auctionPassers[store.gameW.game.currentPlayer] =
          AuctionState.passed;
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
        store.gameW.game.auctionPassers[store.gameW.game.currentPlayer] =
          AuctionState.folded;
        const nextBidPlayer = utils.getNextBidPlayer();
        if (nextBidPlayer === -1) {
          const pp = utils.buyPowerPlant();
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
              ([_, passedAuction]) => passedAuction !== AuctionState.folded
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
        if (store.gameW.game.twoPlayer_trust) {
          store.gameW.game.twoPlayer_trust
            .powerPlantIndices!.flatMap((pp) =>
              Object.entries(powerplants[pp].resources)
            )
            .map(([r, count]) => ({ r: r as unknown as Resource, count }))
            .filter(({ r }) => r !== Resource.renewable)
            .forEach(({ r, count }) => {
              if (r === Resource.hybrid) {
                const availableCoal =
                  store.gameW.game.resources[Resource.coal]!;
                if (availableCoal < count / 2) {
                  store.gameW.game.resources[Resource.coal] = 0;
                  store.gameW.game.resources[Resource.oil] = Math.max(
                    0,
                    store.gameW.game.resources[Resource.oil]! -
                      (count - availableCoal)
                  );
                  return;
                }
                const availableOil = store.gameW.game.resources[Resource.oil]!;
                if (availableOil < (count - 1) / 2) {
                  store.gameW.game.resources[Resource.oil] = 0;
                  store.gameW.game.resources[Resource.coal] = Math.max(
                    0,
                    store.gameW.game.resources[Resource.coal]! -
                      (count - availableCoal)
                  );
                  return;
                }
                store.gameW.game.resources[Resource.coal]! -= Math.ceil(
                  count / 2
                );
                store.gameW.game.resources[Resource.oil]! -= Math.floor(
                  count / 2
                );
              } else {
                store.gameW.game.resources[r] = Math.max(
                  0,
                  store.gameW.game.resources[r]! - count
                );
              }
            });
        }
        store.gameW.game.currentPlayer =
          store.gameW.game.playerOrder[currentIndex - 1];
        break;
      case Phase.buying_cities:
        if (currentIndex === 0) {
          if (store.gameW.game.step === 1) {
            if (
              store.gameW.game.players.find(
                (p) =>
                  (p.cityIndices || []).length >=
                  { 2: 10, 3: 7, 4: 7, 5: 7, 6: 6 }[
                    store.gameW.game.players.length
                  ]!
              )
            ) {
              store.gameW.game.step = 2;
              utils.removeSmallest(1);
            }
          }
          store.gameW.game.phase = Phase.bureocracy;
          if (store.gameW.game.justDrewStep3) {
            store.gameW.game.step = 3;
            store.gameW.game.justDrewStep3 = false;
          }
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
        const income = incomes[numPowered] || 0;
        utils.getCurrent().money += income;
        delete store.gameW.game.bureocracyUsed;
        if (
          store.gameW.game.currentPlayer ===
          store.gameW.game.players.length - 1
        ) {
          store.gameW.game.year++;
          const recharge =
            recharges[store.gameW.game.players.length][store.gameW.game.step];
          Object.entries(recharge)
            .map(([r, count]) => ({
              r: r as unknown as Resource,
              count,
            }))
            .filter(
              ({ r }) =>
                r !== Resource.uranium ||
                !store.gameW.game.germany_uraniumPhaseOut
            )
            .forEach(
              ({ r, count }) =>
                (store.gameW.game.resources[r]! += Math.min(
                  count,
                  totalResources[r]! -
                    store.gameW.game.players
                      .map((p) => p.resources[r]!)
                      .reduce((a, b) => a + b, 0)
                ))
            );
          utils.reorderPlayers();
          store.gameW.game.currentPlayer = 0;
          if (store.gameW.game.step === 3) {
            utils.removeSmallest(1);
          } else {
            utils.removeSmallest(-1);
            if (utils.justEnteredStep3()) {
              utils.removeSmallest(1);
            }
          }
          store.update(`powered ${numPowered} for $${income} - new year`);
          return true;
        }
        store.gameW.game.currentPlayer++;
        store.update(`powered ${numPowered} for $${income}`);
        return true;
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
        power: Math.max(
          ...p.powerPlantIndices!.map((pp) => powerplants[pp].cost)
        ),
        cities: (p.cityIndices || []).length,
      }))
      .sort((a, b) => a.cities - b.cities || a.power - b.power)
      .map(({ playerIndex }) => playerIndex)
      .reverse();
  }

  startBuyingResources() {
    if (store.gameW.game.justDrewStep3) {
      store.gameW.game.step = 3;
      store.gameW.game.justDrewStep3 = false;
      utils.removeSmallest(1);
    }
    if (store.gameW.game.year === 1) {
      utils.reorderPlayers();
    }
    store.gameW.game.phase = Phase.buying_resources;
    store.gameW.game.currentPlayer = store.gameW.game.playerOrder
      .slice()
      .reverse()[0];
    if (
      Object.values(store.gameW.game.auctionPassers!).find(
        (a) => a !== AuctionState.passed
      ) === undefined
    ) {
      utils.removeSmallest(1);
    }
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
        const pp =
          store.gameW.game.powerplantIndices![store.gameW.game.auction!.i];
        const nextBidPlayer = utils.getNextBidPlayer();
        if (nextBidPlayer === -1) {
          utils.buyPowerPlant();
          if (store.gameW.game.phase === Phase.buying_resources) {
            store.update(
              `paid $${cost} for $${powerplants[pp].cost} - buying resources`
            );
            return true;
          }
          store.update(`paid $${cost} for $${powerplants[pp].cost}`);
          return true;
        }
        store.gameW.game.currentPlayer = nextBidPlayer;
        store.update(`bid $${cost} on $${powerplants[pp].cost}`);
        return true;
      }
    }
    return false;
  }

  buyCity(execute: boolean, index: number): boolean {
    const color = utils.getMap().cities[index].color;
    if (!store.gameW.game.outOfPlayZones) store.gameW.game.outOfPlayZones = [];
    if (store.gameW.game.outOfPlayZones.includes(color)) {
      return false;
    }
    if (!utils.isMyTurn()) {
      return false;
    }
    if (store.gameW.game.phase === Phase.nuking_cities) {
      if (store.gameW.game.outOfPlayZones.length > 0) {
        const neighbors = utils
          .getMap()
          .edges.map((e) =>
            [e.c1, e.c2].map(
              (c) => utils.getMap().cities.find((cc) => cc.name === c)!.color
            )
          )
          .filter((colors) => colors.includes(color))
          .map((colors) => colors.find((c) => c !== color));
        if (
          store.gameW.game.outOfPlayZones.find((z) => neighbors.includes(z)) ===
          undefined
        ) {
          return false;
        }
      }
      if (execute) {
        store.gameW.game.outOfPlayZones.push(color);
        console.log(
          6 - store.gameW.game.outOfPlayZones.length,
          { 2: 3, 3: 3, 4: 4, 5: 5, 6: 5 }[store.gameW.game.players.length]
        );
        if (
          6 - store.gameW.game.outOfPlayZones.length ===
          { 2: 3, 3: 3, 4: 4, 5: 5, 6: 5 }[store.gameW.game.players.length]
        ) {
          if (store.gameW.game.players.length === 2) {
            store.gameW.game.phase = Phase.initializing_trust;
            store.gameW.game.twoPlayer_trust = {
              userId: "",
              userName: "",
              color: "black",
              money: 0,
              powerPlantIndices: [],
              cityIndices: [],
              resources: {
                [Resource.coal]: 0,
                [Resource.oil]: 0,
                [Resource.garbage]: 0,
                [Resource.uranium]: 0,
              },
            };
          } else {
            store.gameW.game.phase = Phase.selecting_auction;
          }
        }
        store.update(`nuked ${color}`);
      }
      return true;
    }
    if (store.gameW.game.phase === Phase.initializing_trust) {
      const c = store.gameW.game.twoPlayer_trust!;
      if (!c.cityIndices) c.cityIndices = [];
      if (c.cityIndices.length > 0) {
        const name = utils.getMap().cities[index].name;
        const neighbors = utils
          .getMap()
          .edges.map((e) =>
            [e.c1, e.c2].map(
              (c) => utils.getMap().cities.find((cc) => cc.name === c)!.name
            )
          )
          .filter((cities) => cities.includes(name))
          .map((cities) => cities.find((c) => c !== name)!);
        const cityNames = c.cityIndices!.map(
          (i) => utils.getMap().cities[i].name
        );
        if (neighbors.find((n) => cityNames.includes(n)) === undefined) {
          return false;
        }
      }
      if (c.cityIndices.includes(index)) {
        return false;
      }
      if (execute) {
        c.cityIndices.push(index);
        if (c.cityIndices.length === 1) {
          store.gameW.game.currentPlayer = 1;
        } else if (c.cityIndices.length === 3) {
          store.gameW.game.currentPlayer = 0;
        } else if (c.cityIndices.length === 5) {
          store.gameW.game.currentPlayer = 1;
        } else if (c.cityIndices.length === 6) {
          store.gameW.game.currentPlayer = 0;
          store.gameW.game.phase = Phase.selecting_auction;
        }
        store.update(
          `established trust in ${utils.getMap().cities[index].name}`
        );
      }
      return true;
    }
    const step = store.gameW.game.step;
    if (store.gameW.game.phase === Phase.buying_cities) {
      const connectionCost = utils.getConnectionCost(index);
      const cost =
        connectionCost +
        {
          0: 10,
          1: step >= 2 ? 15 : Number.POSITIVE_INFINITY,
          2: step >= 3 ? 20 : Number.POSITIVE_INFINITY,
        }[
          store.gameW.game.players
            .concat(store.gameW.game.twoPlayer_trust || [])
            .filter((p) => p.cityIndices?.includes(index)).length
        ]!;
      const c = utils.getCurrent();
      if (c.money >= cost) {
        if (execute) {
          if (
            (store.gameW.game.twoPlayer_trust?.cityIndices?.length ||
              Number.POSITIVE_INFINITY) < 16
          ) {
            store.gameW.game.twoPlayer_trust!.cityIndices!.push(index);
          }
          c.money -= cost;
          if (!c.cityIndices) c.cityIndices = [];
          c.cityIndices.push(index);
          if (store.gameW.game.powerplantIndices)
            store.gameW.game.powerplantIndices.unshift(
              ...store.gameW.game.powerplantIndices
                .splice(0, 8)
                .filter(
                  (i) => i < 0 || powerplants[i].cost >= c.cityIndices!.length
                )
            );
          if (utils.justEnteredStep3()) {
            utils.removeSmallest(1);
          }
          store.update(`bought ${utils.getMap().cities[index].name}`);
        }
      }
    }
    return false;
  }

  justEnteredStep3(): boolean {
    if (store.gameW.game.step === 3 || store.gameW.game.justDrewStep3) {
      return false;
    }
    store.gameW.game.justDrewStep3 = !!store.gameW.game.powerplantIndices
      ?.slice(0, 8)
      .includes(-1);
    return store.gameW.game.justDrewStep3;
  }

  removeSmallest(factor: number) {
    if (!store.gameW.game.powerplantIndices) return;
    const index = store.gameW.game.powerplantIndices
      .map((pp, i) => ({
        pp,
        i,
        value: i < 0 ? Number.POSITIVE_INFINITY : powerplants[pp].cost * factor,
      }))
      .sort((a, b) => a.value - b.value)[0].i;
    store.gameW.game.powerplantIndices.splice(index, 1);
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
      if (resources[r]! <= -resources[Resource.hybrid]!) {
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
    if (utils.isMyTurn()) {
      const excessResources = utils.getExcessResources();
      if (
        excessResources[resource]! < 0 ||
        (excessResources[Resource.hybrid]! < 0 &&
          [Resource.coal, Resource.oil].includes(resource))
      ) {
        const cost = utils.getResourceCost(resource);
        if (utils.getCurrent().money >= cost) {
          if (execute) {
            utils.getCurrent().money -= cost;
            store.gameW.game.resources[resource]!--;
            store.update(`bought ${Resource[resource]} for $${cost}`);
          }
          return true;
        }
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
      { 2: 21, 3: 17, 4: 17, 5: 15, 6: 14 }[store.gameW.game.players.length]!
    );
  }
}

const utils = new Utils();

export default utils;

export { store };

import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { powerplants, Resource, startingBankResources } from "./bank";

export type GameType = {
  currentPlayer: number;
  players: PlayerType[];

  step: number;
  mapName: string;
  playerOrder: number[];
  deckIndices?: number[];
  costs?: { [pp: number]: number };
  outOfPlayZones?: string[]; // todo
  resources: { [r in Resource]?: number };
  auction?: { player: number; i: number; cost: number };
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

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(): Promise<GameType> {
    const numPlayers = Object.entries(store.lobby).length;
    return Promise.resolve({
      step: 1,
      currentPlayer: 0,
      mapName: "germany",
      playerOrder: utils.shuffle(utils.count(numPlayers)),
      players: Object.entries(store.lobby).map(([userId, userName], index) => ({
        userId,
        userName,
        color: ["red", "blue", "green", "pink", "yellow", "orange"][index],
        money: 50,
        powerPlantIndices: [],
        cityIndices: [2, 3, 4],
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
      store.gameW.game.auction === undefined
    ) {
      if (store.gameW.game.step === 3 || j <= 3) {
        if (utils.getMe().money >= powerplants[pp].cost) {
          if (execute) {
            store.gameW.game.auction = {
              player: utils.myIndex(),
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

  sellPowerPlant(execute: boolean, i: number): boolean {
    if (
      utils.isMyTurn() &&
      (utils.getMe().powerPlantIndices || []).length > 3
    ) {
      if (execute) {
        const spliced = utils.getMe().powerPlantIndices!.splice(i, 1)[0];
        utils.incrementPlayerTurn();
        store.update(`discarded $${powerplants[spliced].cost}`);
      }
      return true;
    }
    return false;
  }

  pass(execute: boolean): boolean {
    if (utils.isMyTurn()) {
      if (execute) {
        utils.incrementPlayerTurn();
        store.update("passed");
      }
      return true;
    }
    return false;
  }

  bidOnPowerPlant(cost: number): boolean {
    if (utils.isMyTurn()) {
      if (
        cost <= utils.getMe()!.money &&
        cost >= store.gameW.game.auction!.cost
      ) {
        utils.getMe()!.money -= cost;
        const pp = store.gameW.game.deckIndices!.splice(
          store.gameW.game.auction!.i,
          1
        )[0];
        delete store.gameW.game.auction;
        store.update(`bid $${cost} on $${powerplants[pp].cost}`);
      }
    }
    return false;
  }

  buyCity(execute: boolean, index: number): boolean {
    return false;
  }

  dumpResource(execute: boolean, resource: Resource): boolean {
    return false;
  }

  getCost(resource: Resource): number {
    const count = store.gameW.game.resources[resource]!;
    const costs = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16].reverse();
    const tier =
      resource === Resource.uranium ? count - 1 : Math.ceil(count / 3) + 3;
    return costs[tier];
  }

  buyResource(execute: boolean, resource: Resource): boolean {
    return false;
  }
}

const utils = new Utils();

export default utils;

export { store };

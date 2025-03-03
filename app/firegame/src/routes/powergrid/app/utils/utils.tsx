import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { deck, Resource, startingBankResources } from "./bank";

export type GameType = {
  currentPlayer: number;
  players: PlayerType[];

  mapName: string;
  playerOrder: number[];
  deckIndices?: number[];
  outOfPlayZones?: string[]; // todo
  resources: { [r in Resource]?: number };
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
        ))(utils.groupByF(deck, (pp) => pp.isPlug.toString())),
      outOfPlayZones: [],
      resources: startingBankResources,
    }).then(utils.sortDeckTop);
  }

  sortDeckTop(game: GameType): GameType {
    game.deckIndices &&
      game.deckIndices.splice(
        0,
        0,
        ...game.deckIndices.splice(0, 8).sort((a, b) => a - b)
      );
    return game;
  }
}

const utils = new Utils();

export default utils;

export { store };

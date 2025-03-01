import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { deck, Resource } from "./bank";

export type GameType = {
  currentPlayer: number;
  players: PlayerType[];

  deckIndices?: number[];
  outOfPlayZones?: number[]; // todo
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
    return Promise.resolve({
      currentPlayer: 0,
      players: utils
        .shuffle(Object.entries(store.lobby))
        .slice(0, 2)
        .map(([userId, userName], index) => ({
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
            .concat(utils.shuffle(plugs.concat(sockets)))
            .map(({ index }) => index)
            .concat(-1))(
          utils.shuffle(grouped["true"]),
          utils.shuffle(grouped["false"])
        ))(utils.groupByF(deck, (pp) => pp.isPlug.toString())),
      outOfPlayZones: [],
      resources: {
        [Resource.coal]: 24,
        [Resource.oil]: 18,
        [Resource.garbage]: 9,
        [Resource.uranium]: 2,
      },
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

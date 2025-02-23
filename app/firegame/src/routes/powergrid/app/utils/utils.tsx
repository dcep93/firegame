import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { deck, GameType, PlayerType, Resource } from "./bank";

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
          resources: Object.fromEntries(
            utils.enumArray(Resource).map((r) => [r, 0])
          ) as { [r in Resource]: number },
        })),
      deckIndices: undefined,
      outOfPlayZones: [],
      resources: {
        [Resource.coal]: 24,
        [Resource.oil]: 18,
        [Resource.garbage]: 9,
        [Resource.uranium]: 2,
      },
    } as GameType).then((game) => ({
      ...game,
      deckIndices: ((grouped) =>
        ((plugs, sockets) =>
          plugs
            .splice(0, 9)
            .concat(utils.shuffle(plugs.concat(sockets)))
            .map(({ index }) => index))(
          utils.shuffle(grouped["true"]),
          utils.shuffle(grouped["false"])
        ))(utils.groupByF(deck, (pp) => pp.isPlug.toString())),
    }));
  }
}

const utils = new Utils();

export default utils;

export { store };

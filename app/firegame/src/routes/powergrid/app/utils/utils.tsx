import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { deck, GameType, PlayerType, Resource } from "./bank";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(): Promise<GameType> {
    return Promise.resolve({
      currentPlayer: 0,
      players: [],
      deckIndices: undefined,
      outOfPlayZones: [],
      resources: {
        [Resource.coal]: 24,
        [Resource.oil]: 18,
        [Resource.garbage]: 9,
        [Resource.uranium]: 2,
      },
    } as GameType)
      .then((game) => ({
        ...game,
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
      }))
      .then((game) => {
        const grouped = utils.groupByF(deck, (pp) => pp.isPlug.toString());
        const plugs = utils.shuffle(grouped["true"]);
        const sockets = utils.shuffle(grouped["false"]);
        plugs.splice(0, { 2: 1, 3: 2, 4: 1 }[game.players.length] || 0);
        sockets.splice(0, { 2: 5, 3: 6, 4: 3 }[game.players.length] || 0);
        game.deckIndices = plugs
          .splice(0, 9)
          .concat(utils.shuffle(plugs.concat(sockets)))
          .map(({ index }) => index);
        return game;
      });
  }
}

const utils = new Utils();

export default utils;

export { store };

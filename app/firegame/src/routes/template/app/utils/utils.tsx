import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

const store: StoreType<GameType> = store_;

export type GameType = {
  currentPlayer: number;
  players: PlayerType[];
};

export type PlayerType = {
  userId: string;
  userName: string;
};

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
        })),
    } as GameType);
  }
}

const utils = new Utils();

export default utils;

export { store };

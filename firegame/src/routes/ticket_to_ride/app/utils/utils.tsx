import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  linkPoints(length: number): number {
    return [1, 2, 4, 7, 10, 15][length - 1];
  }
}

const utils = new Utils();

export default utils;

export { store };

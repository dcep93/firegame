import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  drawResearch(needed: number, game: GameType | undefined = undefined): void {
    game = game || store.gameW.game;
    game.buyableResearch.push(...game.researchBag.splice(0, needed));
  }
}

const utils = new Utils();

export default utils;

export { store };

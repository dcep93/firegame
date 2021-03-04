import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  getDeck(): number[] {
    return [];
  }

  dealToPlayers(deck: number[], players: PlayerType[]): void {
    var nextPlayer = 0;
    while (deck.length > 0) {
      players[nextPlayer].deck!.push(deck.pop()!);
      nextPlayer++;
      if (nextPlayer >= players.length) {
        nextPlayer = 0;
      }
    }
  }
}

const utils = new Utils();

export default utils;

export { store };

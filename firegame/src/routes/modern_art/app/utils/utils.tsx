import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { Art, AType, GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  allDraw(game: GameType): GameType {
    const num = this.getNumToDraw(game);
    game.players.forEach((p) => {
      p.hand.push(...game.deck.splice(0, num));
      p.hand.sort((a, b) => this.sortVal(a) - this.sortVal(b));
    });
    return game;
  }

  sortVal(a: Art): number {
    return a.artist * this.enumArray(AType).length + a.aType;
  }

  getNumToDraw(game: GameType): number {
    switch (game.players.length) {
      case 3:
        switch (game.round) {
          case 1:
            return 10;
          case 2:
            return 6;
          case 3:
            return 6;
        }
        break;
      case 4:
        switch (game.round) {
          case 1:
            return 9;
          case 2:
            return 4;
          case 3:
            return 4;
        }
        break;
      case 5:
        switch (game.round) {
          case 1:
            return 8;
          case 2:
            return 3;
          case 3:
            return 3;
        }
    }
    return 0;
  }
}

const utils = new Utils();

export default utils;

export { store };

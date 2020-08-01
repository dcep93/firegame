import { LobbyType } from "../../../../shared/store";
import { Game, Resources } from "./types";
import utils, { store } from "./utils";

export type Params = {
  lobby: LobbyType;
};

function NewGame(params: Params): PromiseLike<Game> {
  // @ts-ignore game being constructed
  const game: GameType = {};
  game.params = params;
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: Game): Game {
  const resources: Resources = {
    money: 0,
    steel: 0,
    titanium: 0,
    plants: 0,
    energy: 0,
    heat: 0,
  };
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      pool: utils.copy(resources),
      prod: utils.copy(resources),
      increasedTFThisTurn: false,
    }));
  game.currentPlayer = utils.myIndex(game);
  return game;
}

export default NewGame;

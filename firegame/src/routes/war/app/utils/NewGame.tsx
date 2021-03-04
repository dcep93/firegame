import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  deck?: number[];
  discard?: number[];
};

function NewGame(params: Params): PromiseLike<GameType> {
  // @ts-ignore game being constructed
  const game: GameType = {};
  game.params = params;
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  const deck = utils.getDeck();
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      deck: [],
    }));
  utils.dealToPlayers(deck, game.players);
  game.currentPlayer = utils.myIndex(game);
  return game;
}

export default NewGame;

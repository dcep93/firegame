import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  bank: string[];
};

export type Params = {
  lobby: LobbyType;
  numTeams: number;
  numWords: number;
};

export type PlayerType = {
  userId: string;
  userName: string;
  word: string;
};

function NewGame(params: Params): PromiseLike<GameType> {
  // @ts-ignore game being constructed
  const game: GameType = {};
  game.params = params;
  return Promise.resolve(game)
    .then(setPlayers)
    .then(utils.setWords.bind(utils));
}

function setPlayers(game: GameType): GameType {
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      word: "",
    }));
  game.currentPlayer = utils.myIndex(game);
  return game;
}

export default NewGame;

import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  scoreSheet:
    | { [playerName: string]: { [categoryIndex: number]: number } }
    | undefined;
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;

  index: number;
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    scoreSheet: {},
  };
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .slice(0, 7)
    .map(([userId, userName], index) => ({
      userId,
      userName,
      index,
    }));

  return game;
}

export default NewGame;

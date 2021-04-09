import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  grid: number[][];
  roll: number;
  previous: number[];
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
};

function NewGame(params: Params): PromiseLike<GameType> {
  // @ts-ignore game being constructed
  const game: GameType = {};
  game.params = params;
  game.roll = 0;
  game.grid = [
    [0, 0, 0, 0],
    [8, 10, 10, 10],
    [2, 0, 0, 0],
  ];
  game.previous = [];
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
    }));
  if (game.players.length !== 2) throw new Error("need 2 players");
  game.currentPlayer = utils.myIndex(game);
  return game;
}

export default NewGame;

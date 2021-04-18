import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export enum Action {
  Score,
  Grow,
  Claim,
  Steal,
  Block,
}

export type Turn = {
  actions: Action[];
  blocked: Action | null;
};

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  round: number;
  pot: number;
  staged?: Turn;
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  chips: number;
  lights: { [a in Action]: boolean };
  lastRound?: Action[];
  twoInARow?: Action;
  blocked?: Action;
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    round: 1,
    pot: 1,
  };
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1 * Math.random()))
    .map(([userId, userName]) => ({
      userId,
      userName,
      chips: 0,
      lights: Object.assign(
        {},
        ...utils.enumArray(Action).map((a) => ({ [a]: false }))
      ),
    }))
    .slice(0, 2);
  if (game.players.length !== 2) throw new Error("need 2 players");
  return game;
}

export default NewGame;

import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

const SIZE = 6;

export enum Tile {
  red,
  blue,
  grey,
  white,
}

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  board: Tile[][];
  isSliding: boolean;
  skippedPlacing: boolean;
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  canPlaceNeutral: boolean;
  isPlacingNeutralAtEndOfTurn: boolean;
};

function NewGame(params: Params): PromiseLike<GameType> {
  // @ts-ignore game being constructed
  const game: GameType = {};
  game.params = params;
  game.board = utils.repeat(utils.repeat(Tile.white, SIZE), SIZE);
  game.isSliding = false;
  game.skippedPlacing = false;
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1 * Math.random()))
    .map(([userId, userName], index) => ({
      userId,
      userName,
      canPlaceNeutral: index === 1,
      isPlacingNeutralAtEndOfTurn: false,
    }))
    .slice(0, 2);
  if (game.players.length !== 2) {
    throw new Error("need 2 players");
  }
  game.currentPlayer = utils.myIndex(game);
  return game;
}

export default NewGame;

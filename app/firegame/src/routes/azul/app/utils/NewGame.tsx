import { arr, LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

const NUM_TILES_OF_EACH_TYPE_IN_BAG = 20;

export enum Tile {
  blue,
  yellow,
  red,
  black,
  grey,
}

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  numFactories: number;
  bag: Tile[];
  table: arr<Tile>;
  lid: arr<Tile>;
  floor: arr<number>;
  factories: { [index: number]: arr<Tile> };
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  score: number;
  lines: arr<arr<Tile>>;
  floor: arr<Tile>;
  wall: { [index: number]: { [index: number]: Tile } };
};

function NewGame(params: Params): PromiseLike<GameType> {
  // @ts-ignore game being constructed
  const game: GameType = {};
  game.params = params;
  return Promise.resolve(game).then(setPlayers).then(setProps);
}

function setPlayers(game: GameType): GameType {
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      score: 0,
      lines: [],
      wall: [],
      floor: [],
    }));
  game.currentPlayer = utils.myIndex(game);
  return game;
}

function setProps(game: GameType): GameType {
  game.table = [];
  game.lid = [];
  game.numFactories = 5 + 2 * (game.players.length - 2);
  game.bag = utils
    .enumArray(Tile)
    .flatMap((i) => utils.repeat(i, NUM_TILES_OF_EACH_TYPE_IN_BAG));
  utils.newRound(game);
  return game;
}

export default NewGame;

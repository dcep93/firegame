import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type Resource = "wood" | "sheep" | "wheat" | "brick" | "ore" | "desert";

export type Tile = {
  resource: Resource;
  number?: number;
};

export type Params = {
  lobby: LobbyType;
  citiesAndKnights: boolean;
};

export type PlayerType = {
  userId: string;
  userName: string;
};

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  tiles: Tile[];
};

const baseResources = [
  ...utils.repeat("wood", 4),
  ...utils.repeat("sheep", 4),
  ...utils.repeat("wheat", 4),
  ...utils.repeat("brick", 3),
  ...utils.repeat("ore", 3),
  "desert",
] as Resource[];

const baseNumbers = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12,
];

function NewGame(params: Params): PromiseLike<GameType> {
  const shuffledResources = utils.shuffle([...baseResources]);
  const shuffledNumbers = utils.shuffle([...baseNumbers]);

  const tiles = shuffledResources.map((resource) => {
    if (resource === "desert") {
      return { resource };
    }
    return { resource, number: shuffledNumbers.shift() };
  });

  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    tiles,
  };

  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
    }));

  return Promise.resolve(game);
}

export default NewGame;

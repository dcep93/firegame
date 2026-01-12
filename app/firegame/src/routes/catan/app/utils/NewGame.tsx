import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type Resource = "wood" | "sheep" | "wheat" | "brick" | "ore" | "desert";
export type ResourceCard = Exclude<Resource, "desert">;
export type ResourceCounts = Record<ResourceCard, number>;

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
  resources: ResourceCounts;
  settlements: number;
  cities: number;
  roads: number;
  victoryPoints: number;
};

export type RollType = {
  dice: [number, number];
  total: number;
  playerIndex: number;
};

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  tiles: Tile[];
  hasRolled: boolean;
  lastRoll?: RollType;
};

const baseNumbers = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12,
];

function NewGame(params: Params): PromiseLike<GameType> {
  const baseResources = [
    ...utils.repeat("wood", 4),
    ...utils.repeat("sheep", 4),
    ...utils.repeat("wheat", 4),
    ...utils.repeat("brick", 3),
    ...utils.repeat("ore", 3),
    "desert",
  ] as Resource[];
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
    hasRolled: false,
  };

  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      resources: {
        wood: 0,
        sheep: 0,
        wheat: 0,
        brick: 0,
        ore: 0,
      },
      settlements: 2,
      cities: 0,
      roads: 2,
      victoryPoints: 2,
    }));

  return Promise.resolve(game);
}

export default NewGame;

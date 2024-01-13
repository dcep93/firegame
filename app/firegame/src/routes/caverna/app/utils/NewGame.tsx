import { LobbyType } from "../../../../shared/store";
import { Action } from "./Actions";
import { Tile } from "./Tiles";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  startingPlayer: number;
  year: number;
  remainingHarvests: boolean[] | undefined;

  storeSoldOut: Tile[] | undefined;

  actions: Action[];
  upcomingActions: Action[] | undefined;
  actionBonuses: { [a in Action]?: ResourcesType } | undefined;
  takenActions:
    | {
        [a in Action]?: { playerIndex: number; weaponLevel: number };
      }
    | undefined;
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;

  // -1: baby, 0: no weapon, 1+: weapon level
  usedDwarves: number[] | undefined;
  availableDwarves: number[] | undefined;

  resources: ResourcesType | undefined;

  begging: number;

  farm: undefined;
  cavern: undefined;
};

export type AnimalResourcesType = {
  dogs?: number;
  sheep?: number;
  donkeys?: number;
  boars?: number;
  cows?: number;
};

export type ResourcesType = {
  food?: number;
  stone?: number;
  wood?: number;
  ore?: number;
  rubies?: number;
  gold?: number;
  grain?: number;
  vegetables?: number;
} & AnimalResourcesType;

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],

    startingPlayer: 0,
    year: 1,
    remainingHarvests: undefined,
    storeSoldOut: undefined,
    actions: [],
    upcomingActions: undefined,
    actionBonuses: undefined,
    takenActions: undefined,
  };
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName], index) => ({
      userId,
      userName,

      usedDwarves: undefined,
      availableDwarves: [0, 0],

      resources: { food: index === 0 ? 1 : index },

      begging: 0,

      farm: undefined,
      cavern: undefined,
    }));

  return game;
}

export default NewGame;

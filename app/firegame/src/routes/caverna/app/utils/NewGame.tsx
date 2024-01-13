import { LobbyType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import { Tile } from "./Tiles";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  startingPlayer: number;
  year: number;
  remainingHarvests: boolean[] | undefined;

  purchasedTiles: { [t in Tile]?: boolean } | undefined;

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

  begging?: number;

  boughtTiles: { [t in Tile]?: {} } | undefined;

  cave:
    | {
        [row: number]: {
          [column: number]: {
            resources: ResourcesType | undefined;
            isTunnel: boolean;
            isOreTunnel: boolean;
            isOreMine: boolean;
            isRubyMine: boolean;
          };
        };
      }
    | undefined;

  farm:
    | {
        [row: number]: {
          [column: number]: {
            resources: ResourcesType | undefined;
            // if stable and not pasture,
            // must be stable in forest
            isStable: boolean;
            isPasture: boolean;
            isFence: boolean;
            doubleFenceAngleDeg?: number;
          };
        };
      }
    | undefined;
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
    remainingHarvests: [true, true, true, true, false, false, false],
    purchasedTiles: {},
    actions: utils
      .enumArray(Action)
      .map((a) => ({ a, o: Actions[a] }))
      .filter(
        ({ o }) =>
          o.availability[0] <= Object.keys(store.lobby).length &&
          o.availability[1] >= Object.keys(store.lobby).length
      )
      .map(({ a }) => a),
    upcomingActions: utils
      .enumArray(Action)
      .filter((a) => Actions[a].availability[0] < 0),
    actionBonuses: {},
    takenActions: {},
  };
  return Promise.resolve(game).then(setPlayers).then(utils.enrichAndReveal);
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .slice(0, 7)
    .map(([userId, userName], index) => ({
      userId,
      userName,

      availableDwarves: [],
      usedDwarves: [0, 0],

      resources: { food: [1, 1, 2, 3, 3, 3, 3][index] },

      boughtTiles: {},

      farm: {},
      cave: {},
    }));

  return game;
}

export default NewGame;

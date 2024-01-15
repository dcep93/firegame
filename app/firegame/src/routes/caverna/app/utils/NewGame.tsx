import { LobbyType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import { ExpeditionAction } from "./ExpeditionActions";
import { Tile } from "./Tiles";
import utils, { store } from "./utils";

export enum Task {
  action,
  imitate,
  feed,
  finish_year,
  furnish_dwelling,
  furnish_cavern,
  expedition,
  forge,
  wish_for_children,
  sow,
  have_baby,
  ore_trading,
  build,
  growth,
  breed,
  peaceful_cave,
  choose_excavation,
  beer_parlor,
}

export enum Buildable {
  fence,
  double_fence,
  stable,
  farm_tile,
  cavern_tunnel,
  double_cavern,
  tunnel,
  pasture,
  field,
  cavern,
  ore_mine,
  ruby_mine,
}

export type TaskType = {
  t: Task;
  d?: {
    num?: number;
    builderResource?: keyof ResourcesType;
    toBuild?: Buildable;
    expeditionsTaken?: { [e in ExpeditionAction]?: boolean };
  };
};

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  tasks: TaskType[];

  startingPlayer: number;
  remainingHarvests?: boolean[];

  purchasedTiles?: { [t in Tile]?: number };

  actions: Action[];
  upcomingActions?: Action[];
  actionBonuses?: { [a in Action]?: ResourcesType };
  takenActions?:
    | {
        [a in Action]?: { playerIndex: number; weaponLevel: number };
      };
};

export type Params = {
  lobby: LobbyType;
};

export type CaveTileType = {
  resources?: ResourcesType;
  tile?: Tile;
  isCavern?: boolean;
  isOreTunnel?: boolean;
  isMine?: boolean;
  isRubyMine?: boolean;
};

export type FarmTileType = {
  resources?: ResourcesType;
  isStable?: boolean;
  isPasture?: boolean;
  isFence?: boolean;
  doubleFenceAngleDeg?: number;
};

export type PlayerType = {
  userId: string;
  userName: string;

  index: number;

  // -1: baby, 0: no weapon, 1+: weapon level
  usedDwarves?: number[];
  availableDwarves?: number[];

  resources?: ResourcesType;

  begging?: number;

  boughtTiles: { [t in Tile]?: boolean };

  cave: {
    [row: number]: {
      [column: number]: CaveTileType;
    };
  };

  farm?: {
    [row: number]: {
      [column: number]: FarmTileType;
    };
  };
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

    tasks: [],

    startingPlayer: 0,
    remainingHarvests: [true, true, true, true, false, false, false],
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
      index,

      usedDwarves: [0, 0],

      resources: { food: [1, 1, 2, 3, 3, 3, 3][index] },

      boughtTiles: { [Tile.starting_dwelling]: true },

      cave: {
        2: { 0: { isCavern: true } },
        3: { 0: { tile: Tile.starting_dwelling } },
      },
    }));

  return game;
}

export default NewGame;

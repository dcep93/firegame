import { LobbyType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import { Cavern } from "./Caverns";
import { ExpeditionAction } from "./ExpeditionActions";
import utils, { store } from "./utils";

export enum Task {
  action,
  forge,
  expedition,
  imitate,
  furnish_cavern,
  furnish_dwelling,
  build,
  beer_parlor,
  sow,
  eat_gold,
  slaughter,
  ore_trading,
  peaceful_cave,
  choose_excavation,
  extension,

  feed_tmp, // TODO
  finish_year_tmp, // TODO
  wish_for_children, // TODO
  growth, // TODO
  weekly_market, // TODO
  breed_2, // TODO
  family_life, // TODO
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
    resource?: keyof ResourcesType;
    sow?: ResourcesType;
    build?: Buildable;
    expeditionsTaken?: { [e in ExpeditionAction]?: boolean };
  };
};

export enum Harvest {
  nothing,
  harvest,
  one_per,
  random,
  green,
  red,
}

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  startingPlayer: number;

  tasks: TaskType[];

  remainingHarvests?: Harvest[];
  upcomingHarvests?: Harvest[];

  purchasedTiles?: { [t in Cavern]?: number };

  actions: Action[];
  actionBonuses?: { [a in Action]?: ResourcesType };
  upcomingActions?: Action[];
  takenActions?:
    | {
        [a in Action]?: { playerIndex: number; dwarfIndex: number };
      };
};

export type Params = {
  lobby: LobbyType;
};

export type CaveTileType = {
  resources?: ResourcesType;
  isCavern?: boolean; // false for tunnel
  tile?: Cavern;
  supply?: ResourcesType;
  isOreTunnel?: boolean;
  isRubyMine?: boolean; // false if ore mine
};

export type FarmTileType = {
  resources?: ResourcesType;
  isStable?: boolean;
  isPasture?: boolean; // false for field
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

  boughtTiles: { [t in Cavern]?: boolean };

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

  tileBonuses?: {
    [k: string]: ResourcesType;
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
    remainingHarvests: [
      Harvest.green,
      Harvest.green,
      Harvest.green,
      Harvest.green,
      Harvest.red,
      Harvest.red,
      Harvest.red,
    ],
    upcomingHarvests: [
      Harvest.nothing,
      Harvest.nothing,
      Harvest.harvest,
      Harvest.one_per,
      Harvest.harvest,
      Harvest.random,
      Harvest.random,
      Harvest.random,
      Harvest.random,
      Harvest.random,
      Harvest.random,
      Harvest.random,
    ],
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

      boughtTiles: { [Cavern.starting_dwelling]: true },

      cave: {
        2: { 0: { isCavern: true } },
        3: { 0: { isCavern: true, tile: Cavern.starting_dwelling } },
      },

      tileBonuses: {
        "0_2_0": { boars: 1 },
        "2_0_0": { boars: 1 },
        "3_1_0": { food: 1 },
        "0_2_1": { food: 1 },
        "3_1_1": { food: 1 },
      },
    }));

  return game;
}

export default NewGame;

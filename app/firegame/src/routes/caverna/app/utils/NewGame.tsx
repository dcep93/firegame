import { LobbyType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import { Cavern } from "./Caverns";
import { ExpeditionAction } from "./ExpeditionActions";
import utils, { store } from "./utils";

export enum Task {
  game_end,
  action,
  forge,
  expedition,
  furnish,
  build,
  sow,
  slaughter,
  imitate,
  have_baby,
  harvest,
  growth,
  choose_excavation,
  eat_gold,
  breed_2,
  resource,

  wish_for_children,
  ruby_mine_construction,
  ore_trading,
  extension,
  weekly_market,

  beer_parlor,
  peaceful_cave,
}

export enum Buildable {
  fence,
  stable,
  pasture,
  field,

  tunnel,
  cavern,
  ore_tunnel,
  ore_mine,
  ruby_mine,

  farm_tile,
  double_fence,
  cavern_tunnel,
  excavation,
  ore_mine_construction,

  dwelling_2_2,
  dwelling,
}

export type TaskType = {
  t: Task;
  d?: {
    num?: number;
    r?: keyof ResourcesType;
    rs?: ResourcesType;
    build?: Buildable;
    buildData?: number[];
    expeditionsTaken?: { [e in ExpeditionAction]?: boolean };
  };
};

export enum Harvest {
  nothing,
  one_per,
  skip_one,
  harvest,
  random,
}

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  startingPlayer: number;
  harvest?: Harvest;

  tasks: TaskType[];

  randomHarvests?: Harvest[];
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

// TODO buildable
export type CaveTileType = {
  resources?: ResourcesType;
  isCavern?: boolean; // false for tunnel
  cavern?: Cavern;
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

  caverns: { [t in Cavern]?: boolean };

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
    randomHarvests: [
      Harvest.harvest,
      Harvest.harvest,
      Harvest.harvest,
      Harvest.harvest,
      Harvest.nothing,
      Harvest.one_per,
      Harvest.skip_one,
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

      caverns: { [Cavern.starting_dwelling]: true },

      cave: {
        2: { 0: { isCavern: true } },
        3: { 0: { isCavern: true, cavern: Cavern.starting_dwelling } },
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

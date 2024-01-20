import { firebaseId } from "../../../../firegame/firebase";
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

  save_actions, // single player
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
  fence_2,
  cavern_tunnel,
  excavation,
  ore_mine_construction,

  expedition_dwelling_2_2,
  wish_for_children,
}

export type TaskType = {
  t: Task;
  d?: {
    expeditionsTaken?: { [e in ExpeditionAction]?: boolean };
    magicBoolean?: boolean; // Buildable.ruby_mine | Harvest.skip_one
    remaining?: number; // Action.ore_trading | Task.expedition
    canSkip?: boolean; //  Cavern.guest_room | Action.housework | Task.build(Action.slash_and_burn | Action.sheep/donkey_farming | Action.fence_building)
    availableResources?: ResourcesType; // Task.resource(*) | Task.weekly_market | Task.sow | Cavern.builder | Task.breed_2
    build?: Buildable; // Task.build | Task.furnish
    buildReward?: ResourcesType; // Task.extension | Task.ore_mine_construction
    buildData?: [number, number, number, number]; // [BuildableA, BuildableB, isRow ? 0 : 1, isBuildableA ? 0 : 1]
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

  log: {
    time: number;
    playerIndex: number;
    score: number;
    move: string;
    firebaseId: string;
  }[];

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
  singlePlayerSavedActions?: { [a in Action]?: boolean };
};

export type Params = {
  lobby: LobbyType;
};

export type Coords = { i: number; j: number; k: number };
export type TileType = {
  built: { [b in Buildable]?: boolean };

  resources?: ResourcesType;
  supply?: ResourcesType;
  cavern?: Cavern;
  doubleFenceCoords?: Coords;
};

export type PlayerType = {
  userId: string;
  userName: string;

  index: number;

  // -1: baby, 0: no weapon, 1+: weapon level
  usedDwarves?: number[];
  availableDwarves?: number[];

  resources?: ResourcesType;

  begging: number;

  caverns: { [t in Cavern]?: boolean };

  grid: { [side: number]: { [row: number]: { [column: number]: TileType } } };

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
    log: [
      {
        playerIndex: 0,
        score: 0,
        move: "<NEW_GAME>",
        firebaseId,
        time: Date.now(),
      },
    ],

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

      begging: 0,
      resources: { food: [1, 1, 2, 3, 3, 3, 3][index] },

      caverns: { [Cavern.starting_dwelling]: true },

      grid: {
        1: {
          0: {
            0: {
              resources: {},
              built: { [Buildable.cavern]: true },
              cavern: Cavern.starting_dwelling,
            },
          },
          1: { 0: { resources: {}, built: { [Buildable.cavern]: true } } },
        },
      },

      tileBonuses: Object.fromEntries(
        [
          { c: { k: 0, i: 3, j: 0 }, b: { boars: 1 } },
          { c: { k: 0, i: 1, j: 2 }, b: { boars: 1 } },
          { c: { k: 0, i: 0, j: 1 }, b: { food: 1 } },
          { c: { k: 1, i: 0, j: 1 }, b: { food: 1 } },
          { c: { k: 1, i: 3, j: 2 }, b: { food: 2 } },
        ].map(({ c, b }) => [utils.coordsToKey(c), b])
      ),
    }));

  if (game.players.length <= 2) {
    game.randomHarvests!.shift();
    game.upcomingHarvests!.pop();

    if (game.players.length === 1) {
      game.upcomingHarvests = game.upcomingHarvests!.map((h) =>
        h === Harvest.random ? Harvest.harvest : h
      );
      game.players[0].resources!.food = 2;
    }
  }

  return game;
}

export default NewGame;

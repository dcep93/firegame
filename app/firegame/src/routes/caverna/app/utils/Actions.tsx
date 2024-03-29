import { Cavern } from "./Caverns";
import { Buildable, PlayerType, ResourcesType, Task } from "./NewGame";
import utils, { store } from "./utils";

export enum Action {
  // 0-1
  blacksmithing,
  sheep_farming,
  ore_mine_construction,
  // 0-2
  wish_for_children,
  donkey_farming,
  ruby_mine_construction,
  // 0-3
  ore_delivery,
  family_life,
  exploration,
  // 0-4
  ore_trading,
  ruby_delivery,
  adventure,
  // 1-3
  drift_mining__1_3,
  drift_mining__1,
  logging__1_3,
  wood_gathering,
  excavation__1_3,
  supplies,
  suppies__1,
  clearing__1_3,
  clearing__1,
  starting_player__1_3,
  starting_player__1,
  ore_mining__1_3,
  sustenance__1_3,
  // 3
  strip_mining,
  imitation__3,
  forest_exploration__3,
  // 4-7
  drift_mining__4_7,
  imitation__4_7,
  logging__4_7,
  forest_exploration__4_7,
  excavation__4_7,
  growth,
  clearing__4_7,
  starting_player__4_7,
  ore_mining__4_7,
  sustenance__4_7,
  // 5
  depot_5,
  weekly_market__5,
  hardware_rental__5,
  small_scale_drift_mining,
  imitation__5,
  fence_building__5,
  // 6-7
  depot__6_7,
  weekly_market__6_7,
  hardware_rental__6_7,
  drift_mining__6_7,
  imitation__6_7,
  fence_building__6_7,
  // 7
  large_depot,
  imitation__7,
  extension,
  // 1-7
  ruby_mining,
  housework,
  slash_and_burn,
}

const growthRewards = {
  wood: 1,
  stone: 1,
  ore: 1,
  food: 1,
  gold: 2,
};

export type ActionType = {
  availability: [number, number];
  title: string | null;
  foodCost?: number;
  enrichment?: ResourcesType[];
  action?: (p: PlayerType) => void;
};

const Actions: { [a in Action]: ActionType } = {
  [Action.blacksmithing]: {
    availability: [-1, 0],
    title: "forge\nx3 expedition",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.forge },
        { t: Task.expedition, d: { remaining: 3 } },
      ]),
  },
  [Action.ore_mine_construction]: {
    availability: [-1, 0],
    title: "construct an ore mine on two adjacent tunnels\nx2 expedition",
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: {
            canSkip: true,
            build: Buildable.ore_mine_construction,
            buildReward: { ore: 3 },
          },
        },
        { t: Task.expedition, d: { remaining: 2 } },
      ]),
  },
  [Action.sheep_farming]: {
    availability: [-1, 0],
    title: "construct a fence\nconstruct a double fence\nconstruct a stable",
    enrichment: [{ sheep: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { canSkip: true, build: Buildable.fence },
        },
        {
          t: Task.build,
          d: { canSkip: true, build: Buildable.fence_2 },
        },
        {
          t: Task.build,
          d: { canSkip: true, build: Buildable.stable },
        },
      ]),
  },
  [Action.wish_for_children]: {
    availability: [-1.5, 0],
    title:
      "furnish a dwelling OR have a baby\nonce family life is revealed,\ntransforms to urgent_wish_for_children\n(furnish a dwelling AND THEN have a baby) OR +3 gold",
    action: (p: PlayerType) =>
      store.gameW.game.actions.includes(Action.family_life)
        ? // urgent wish
          p.caverns[Cavern.guest_room]
          ? utils.queueTasks([
              { t: Task.resource, d: { availableResources: { gold: 3 } } },
              {
                t: Task.furnish,
                d: { build: Buildable.wish_for_children, canSkip: true },
              },
              { t: Task.have_baby },
            ])
          : utils.queueTasks([{ t: Task.wish_for_children }])
        : // wish
        p.caverns[Cavern.guest_room]
        ? utils.queueTasks([
            {
              t: Task.furnish,
              d: { build: Buildable.wish_for_children, canSkip: true },
            },
            { t: Task.have_baby },
          ])
        : utils.haveChild(false)
        ? utils.queueTasks([{ t: Task.wish_for_children }])
        : // no room for a baby, must build dwelling
          utils.queueTasks([
            { t: Task.furnish, d: { build: Buildable.wish_for_children } },
          ]),
  },
  [Action.ruby_mine_construction]: {
    availability: [-2, 0],
    title:
      "build a ruby mine on a tunnel OR (build a ruby mine on an ore tunnel AND +1 ruby)",
    action: (p: PlayerType) =>
      p.caverns[Cavern.guest_room]
        ? utils.queueTasks([
            {
              t: Task.build,
              d: {
                canSkip: true,
                build: Buildable.ruby_mine,
                magicBoolean: true,
              },
            },
            {
              t: Task.build,
              d: {
                canSkip: true,
                build: Buildable.ruby_mine,
                magicBoolean: false,
              },
            },
          ])
        : utils.queueTasks([
            { t: Task.build, d: { build: Buildable.ruby_mine } },
          ]),
  },
  [Action.donkey_farming]: {
    availability: [-2, 0],
    title: "construct a fence\nconstruct a double fence\nconstruct a stable",
    enrichment: [{ donkeys: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { canSkip: true, build: Buildable.fence } },
        {
          t: Task.build,
          d: { canSkip: true, build: Buildable.fence_2 },
        },
        {
          t: Task.build,
          d: { canSkip: true, build: Buildable.stable },
        },
      ]),
  },
  [Action.exploration]: {
    availability: [-3, 0],
    title: "x4 expedition",
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.expedition, d: { remaining: 4 } }]),
  },
  [Action.family_life]: {
    availability: [-3, 0],
    title:
      "when revealed, upgrade wish_for_children -> urgent_wish_for_children\nhave a baby\nsow",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.have_baby },
        { t: Task.sow, d: { availableResources: { grain: 2, vegetables: 2 } } },
      ]),
  },
  [Action.ore_delivery]: {
    availability: [-3, 0],
    title: "+2 ore for each ore_mine",
    enrichment: [{ stone: 1, ore: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => t.built[Buildable.ore_mine])
            .length,
      }),
  },
  [Action.ore_trading]: {
    availability: [-4, 0],
    title: "up to 3 times,\ntrade 2 ore for 2 gold and 1 food",
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.ore_trading, d: { remaining: 3 } }]),
  },
  [Action.ruby_delivery]: {
    availability: [-4, 0],
    title: "+1 ruby if at least 2 ruby mines",
    enrichment: [{ rubies: 2 }, { rubies: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        rubies:
          utils
            .getGrid(p)
            .filter(({ t }) => t.built[Buildable.ruby_mine] === true).length >=
          2
            ? 1
            : 0,
      }),
  },
  [Action.adventure]: {
    availability: [-4, 0],
    title: "forge\nx1 expedition\nx1 expedition",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.forge },
        { t: Task.expedition, d: { remaining: 1 } },
        { t: Task.expedition, d: { remaining: 1 } },
      ]),
  },
  [Action.ruby_mining]: {
    availability: [1, 7],
    title: "+1 ruby if at least 1 ruby mine",
    enrichment: [{ rubies: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        rubies:
          utils
            .getGrid(p)
            .filter(({ t }) => t.built[Buildable.ruby_mine] === true).length >=
          1
            ? 1
            : 0,
      }),
  },
  [Action.housework]: {
    availability: [1, 7],
    title: "furnish a cavern\n+1 dog",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.furnish, d: { canSkip: true } },
        { t: Task.resource, d: { availableResources: { dogs: 1 } } },
      ]),
  },
  [Action.slash_and_burn]: {
    availability: [1, 7],
    title: "place pasture+field\nsow",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { canSkip: true, build: Buildable.farm_tile } },
        { t: Task.sow, d: { availableResources: { grain: 2, vegetables: 2 } } },
      ]),
  },
  [Action.drift_mining__1_3]: {
    availability: [2, 3],
    title: "place cavern+tunnel",
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { build: Buildable.cavern_tunnel } },
      ]),
  },
  [Action.excavation__1_3]: {
    availability: [1, 3],
    title: "place cavern+tunnel\nOR\nplace cavern+cavern",
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.build, d: { build: Buildable.excavation } }]),
  },
  [Action.starting_player__1_3]: {
    availability: [2, 3],
    title: "+2 ore",
    enrichment: [{ food: 1 }],
    action: (p: PlayerType) => {
      utils.addResourcesToMe({ ore: 2 });
      store.gameW.game.startingPlayer = utils.myIndex();
    },
  },
  [Action.logging__1_3]: {
    availability: [1, 3],
    title: "x1 expedition",
    enrichment: [{ wood: 3 }, { wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.expedition,
          d: { remaining: 1 },
        },
      ]),
  },
  [Action.supplies]: {
    availability: [2, 3],
    title: "+1 wood,stone,ore,food\n+2 gold",
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        wood: 1,
        stone: 1,
        ore: 1,
        food: 1,
        gold: 2,
      }),
  },
  [Action.ore_mining__1_3]: {
    availability: [1, 3],
    title: "+2 ore for each ore mine",
    enrichment: [{ ore: 2 }, { ore: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => t.built[Buildable.ore_mine])
            .length,
      }),
  },
  [Action.wood_gathering]: {
    availability: [1, 3],
    title: null,
    enrichment: [{ wood: 1 }],
  },
  [Action.clearing__1_3]: {
    availability: [2, 3],
    title: "place pasture+field",
    enrichment: [{ wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { build: Buildable.farm_tile },
        },
      ]),
  },
  [Action.sustenance__1_3]: {
    availability: [1, 3],
    enrichment: [{ food: 1 }],
    title: "place pasture+field\n+1 grain",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.resource, d: { availableResources: { grain: 1 } } },
        {
          t: Task.build,
          d: { build: Buildable.farm_tile },
        },
      ]),
  },
  [Action.strip_mining]: {
    availability: [3, 3],
    title: "+2 wood",
    enrichment: [{ ore: 1 }, { stone: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        wood: 2,
      }),
  },
  [Action.forest_exploration__3]: {
    availability: [3, 3],
    title: "+1 vegetables",
    enrichment: [{ wood: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        vegetables: 1,
      }),
  },
  [Action.imitation__3]: {
    availability: [3, 3],
    title: null,
    foodCost: 4,
  },
  [Action.drift_mining__4_7]: {
    availability: [4, 7],
    title: "place cavern+tunnel",
    enrichment: [{ stone: 2 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { build: Buildable.cavern_tunnel },
        },
      ]),
  },
  [Action.excavation__4_7]: {
    availability: [4, 7],
    title: "place cavern+tunnel\nOR\nplace cavern+cavern",
    enrichment: [{ stone: 2 }, { stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.choose_excavation,
        },
      ]),
  },
  [Action.starting_player__4_7]: {
    availability: [4, 7],
    title: "+1 ruby",
    enrichment: [{ food: 1 }],
    action: (p: PlayerType) => {
      utils.addResourcesToMe({ rubies: 1 });
      store.gameW.game.startingPlayer = utils.myIndex();
    },
  },
  [Action.imitation__4_7]: {
    availability: [4, 7],
    title: null,
    foodCost: 2,
  },
  [Action.logging__4_7]: {
    availability: [4, 7],
    title: "x2 expedition",
    enrichment: [{ wood: 3 }],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.expedition, d: { remaining: 2 } }]),
  },
  [Action.forest_exploration__4_7]: {
    availability: [4, 7],
    title: "+2 food",
    enrichment: [{ wood: 2 }, { wood: 1 }],
    action: (p: PlayerType) => utils.addResourcesToMe({ food: 2 }),
  },
  [Action.growth]: {
    availability: [4, 7],
    title: [
      Object.entries(growthRewards)
        .map(([k, v]) => `+${v} ${k}`)
        .join(" , "),
      "OR",
      "have a baby",
    ].join("\n"),
    action: (p: PlayerType) =>
      p.caverns[Cavern.guest_room]
        ? utils.queueTasks([
            { t: Task.resource, d: { availableResources: growthRewards } },
            {
              t: Task.have_baby,
            },
          ])
        : utils.haveChild(false)
        ? utils.queueTasks([
            {
              t: Task.growth,
            },
          ])
        : utils.addResourcesToMe(growthRewards),
  },
  [Action.clearing__4_7]: {
    availability: [4, 7],
    title: "place pasture+field",
    enrichment: [{ wood: 2 }],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.build, d: { build: Buildable.farm_tile } }]),
  },
  [Action.ore_mining__4_7]: {
    availability: [4, 7],
    title: "+2 ore for each ore mine",
    enrichment: [{ ore: 3 }, { ore: 2 }],
    action: (p: PlayerType) =>
      utils.addResourcesToMe({
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => t.built[Buildable.ore_mine])
            .length,
      }),
  },
  [Action.sustenance__4_7]: {
    availability: [4, 7],
    title: "place pasture+field",
    enrichment: [{ grain: 1 }, { vegetables: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { build: Buildable.farm_tile },
        },
      ]),
  },
  [Action.depot_5]: {
    availability: [5, 5],
    title: null,
    enrichment: [{ wood: 1, ore: 1 }],
  },
  [Action.small_scale_drift_mining]: {
    availability: [5, 5],
    title: "place cavern+tunnel",
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { build: Buildable.cavern_tunnel } },
      ]),
  },
  [Action.weekly_market__5]: {
    availability: [5, 5],
    title: "+4 gold\ngo to market!",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.resource, d: { availableResources: { gold: 4 } } },
        {
          t: Task.weekly_market,
          d: {
            availableResources: {
              dogs: 2,
              sheep: 1,
              donkeys: 1,
              boars: 2,
              cows: 3,
              wood: 1,
              stone: 1,
              ore: 1,
              grain: 1,
              vegetables: 2,
            },
          },
        },
      ]),
  },
  [Action.imitation__5]: {
    availability: [5, 5],
    title: null,
    foodCost: 4,
  },
  [Action.hardware_rental__5]: {
    availability: [5, 5],
    title: "x2 expedition\nsow",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.expedition, d: { remaining: 2 } },
        { t: Task.sow, d: { availableResources: { grain: 2, vegetables: 2 } } },
      ]),
  },
  [Action.fence_building__5]: {
    availability: [5, 5],
    title: "construct a fence\nconstruct a double fence",
    enrichment: [{ wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { canSkip: true, build: Buildable.fence } },
        {
          t: Task.build,
          d: { canSkip: true, build: Buildable.fence_2 },
        },
      ]),
  },
  [Action.depot__6_7]: {
    availability: [6, 7],
    title: null,
    enrichment: [{ wood: 1, ore: 1 }],
  },
  [Action.drift_mining__6_7]: {
    availability: [6, 7],
    title: "place cavern+tunnel",
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { build: Buildable.cavern_tunnel } },
      ]),
  },
  [Action.weekly_market__6_7]: {
    availability: [6, 7],
    title: "+4 gold\ngo to market!",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.resource, d: { availableResources: { gold: 4 } } },
        {
          t: Task.weekly_market,
          d: {
            availableResources: {
              dogs: 2,
              sheep: 1,
              donkeys: 1,
              boars: 2,
              cows: 3,
              wood: 1,
              stone: 1,
              ore: 1,
              grain: 1,
              vegetables: 2,
            },
          },
        },
      ]),
  },
  [Action.imitation__6_7]: {
    availability: [6, 7],
    title: null,
    foodCost: 1,
  },
  [Action.hardware_rental__6_7]: {
    availability: [6, 7],
    title: "+2 wood\nx2 expedition\nsow",
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.resource, d: { availableResources: { wood: 2 } } },
        {
          t: Task.sow,
          d: { availableResources: { grain: 2, vegetables: 2 } },
        },
      ]),
  },
  [Action.fence_building__6_7]: {
    availability: [6, 7],
    title: "construct a fence\nconstruct a double fence",
    enrichment: [{ wood: 2 }, { wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { remaining: 2, canSkip: true, build: Buildable.fence },
        },
        {
          t: Task.build,
          d: { remaining: 4, canSkip: true, build: Buildable.fence_2 },
        },
      ]),
  },
  [Action.large_depot]: {
    availability: [7, 7],
    title: null,
    enrichment: [
      { wood: 2, stone: 1, ore: 1 },
      { wood: 1, stone: 1, ore: 1 },
    ],
  },
  [Action.imitation__7]: {
    availability: [7, 7],
    title: null,
    foodCost: 0,
  },
  [Action.extension]: {
    availability: [7, 7],
    title:
      "place pasture+field AND +1 wood\nOR\nplace cavern+tunnel AND +1 stone",
    action: (p: PlayerType) =>
      p.caverns[Cavern.guest_room]
        ? utils.queueTasks([
            {
              t: Task.build,
              d: {
                canSkip: true,
                build: Buildable.farm_tile,
                buildReward: { wood: 1 },
              },
            },
            {
              t: Task.build,
              d: {
                canSkip: true,
                build: Buildable.cavern_tunnel,
                buildReward: { stone: 1 },
              },
            },
          ])
        : utils.queueTasks([
            {
              t: Task.extension,
            },
          ]),
  },
  [Action.drift_mining__1]: {
    availability: [1, 1],
    title: "drift_mining not available in 1p",
  },
  [Action.starting_player__1]: {
    availability: [1, 1],
    title: "starting_player not available in 1p",
  },
  [Action.suppies__1]: {
    availability: [1, 1],
    title: "suppies not available in 1p",
  },
  [Action.clearing__1]: {
    availability: [1, 1],
    title: "clearing not available in 1p",
  },
};

export { growthRewards };

export default Actions;

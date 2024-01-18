import { Cavern } from "./Caverns";
import { Buildable, PlayerType, ResourcesType, Task } from "./NewGame";
import utils, { store } from "./utils";

export enum Action {
  // 0-1
  blacksmithing,
  ore_mine_construction,
  sheep_farming,
  // 0-2
  wish_for_children,
  ruby_mine_construction,
  donkey_farming,
  // 0-3
  exploration,
  family_life,
  ore_delivery,
  // 0-4
  ore_trading,
  ruby_delivery,
  adventure,
  // 1-7
  ruby_mining,
  housework,
  slash_and_burn,
  // 1-3
  drift_mining__1_3,
  excavation__1_3,
  starting_player__1_3,
  logging__1_3,
  supplies,
  ore_mining__1_3,
  wood_gathering,
  clearing__1_3,
  sustenance__1_3,
  // 3
  strip_mining,
  forest_exploration__3,
  imitation__3,
  // 4-7
  drift_mining__4_7,
  excavation__4_7,
  starting_player__4_7,
  imitation__4_7,
  logging__4_7,
  forest_exploration__4_7,
  growth,
  clearing__4_7,
  ore_mining__4_7,
  sustenance__4_7,
  // 5
  depot_5,
  small_scale_drift_mining,
  weekly_market__5,
  imitation__5,
  hardware_rental__5,
  fence_building__5,
  // 6-7
  depot__6_7,
  drift_mining__6_7,
  weekly_market__6_7,
  imitation__6_7,
  hardware_rental__6_7,
  fence_building__6_7,
  // 7
  large_depot,
  imitation__7,
  extension,
}

export type ActionType = {
  availability: [number, number];
  title?: string;
  foodCost?: number;
  enrichment?: ResourcesType[];
  action?: (p: PlayerType) => void;
};

const Actions: { [a in Action]: ActionType } = {
  [Action.blacksmithing]: {
    availability: [-1, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.forge },
        { t: Task.expedition, d: { num: 3 } },
      ]),
  },
  [Action.ore_mine_construction]: {
    availability: [-1, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: {
            canSkip: true,
            build: Buildable.ore_mine_construction,
            rs: { ore: 3 },
          },
        },
        { t: Task.expedition, d: { num: 2 } },
      ]),
  },
  [Action.sheep_farming]: {
    availability: [-1, 0],
    enrichment: [{ sheep: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { num: 2, canSkip: true, build: Buildable.fence },
        },
        {
          t: Task.build,
          d: { num: 4, canSkip: true, build: Buildable.fence_2 },
        },
        {
          t: Task.build,
          d: { num: 1, canSkip: true, build: Buildable.stable },
        },
      ]),
  },
  [Action.wish_for_children]: {
    availability: [-1.5, 0],
    action: (p: PlayerType) =>
      store.gameW.game.actions.includes(Action.family_life)
        ? // urgent wish
          p.caverns[Cavern.guest_room]
          ? Promise.resolve()
              .then(() => utils.addResourcesToPlayer(p, { gold: 3 }))
              .then(() =>
                utils.queueTasks([
                  {
                    t: Task.furnish,
                    d: { build: Buildable.dwelling, canSkip: true },
                  },
                  { t: Task.have_baby },
                ])
              )
          : utils.queueTasks([{ t: Task.wish_for_children }])
        : // wish
        p.caverns[Cavern.guest_room]
        ? utils.queueTasks([
            {
              t: Task.furnish,
              d: { build: Buildable.dwelling, canSkip: true },
            },
            { t: Task.have_baby },
          ])
        : utils.haveChild(p, false)
        ? utils.queueTasks([{ t: Task.wish_for_children }])
        : // no room for a baby, must build dwelling
          utils.queueTasks([
            { t: Task.furnish, d: { build: Buildable.dwelling } },
          ]),
  },
  [Action.ruby_mine_construction]: {
    availability: [-2, 0],
    action: (p: PlayerType) =>
      p.caverns[Cavern.guest_room]
        ? utils.queueTasks([
            {
              t: Task.build,
              d: { canSkip: true, build: Buildable.ruby_mine, r: "stone" },
            },
            {
              t: Task.build,
              d: { canSkip: true, build: Buildable.ruby_mine, r: "ore" },
            },
          ])
        : utils.queueTasks([
            { t: Task.build, d: { build: Buildable.ruby_mine } },
          ]),
  },
  [Action.donkey_farming]: {
    availability: [-2, 0],
    enrichment: [{ donkeys: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 2, canSkip: true, build: Buildable.fence } },
        {
          t: Task.build,
          d: { num: 4, canSkip: true, build: Buildable.fence_2 },
        },
        {
          t: Task.build,
          d: { num: 1, canSkip: true, build: Buildable.stable },
        },
      ]),
  },
  [Action.exploration]: {
    availability: [-3, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.expedition, d: { num: 4 } }]),
  },
  [Action.family_life]: {
    availability: [-3, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.have_baby },
        { t: Task.sow, d: { rs: { grain: 2, vegetables: 2 } } },
      ]),
  },
  [Action.ore_delivery]: {
    availability: [-3, 0],
    enrichment: [{ stone: 1, ore: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => t.built[Buildable.ore_mine])
            .length,
      }),
  },
  [Action.ore_trading]: {
    availability: [-4, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.ore_trading, d: { num: 3 } }]),
  },
  [Action.ruby_delivery]: {
    availability: [-4, 0],
    enrichment: [{ rubies: 2 }, { rubies: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
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
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.forge },
        { t: Task.expedition, d: { num: 1 } },
        { t: Task.expedition, d: { num: 1 } },
      ]),
  },
  [Action.ruby_mining]: {
    availability: [1, 7],
    enrichment: [{ rubies: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
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
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.furnish, d: { canSkip: true } },
        { t: Task.resource, d: { rs: { dogs: 1 } } },
      ]),
  },
  [Action.slash_and_burn]: {
    availability: [1, 7],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { canSkip: true, build: Buildable.farm_tile } },
        { t: Task.sow, d: { rs: { grain: 2, vegetables: 2 } } },
      ]),
  },
  [Action.drift_mining__1_3]: {
    availability: [1, 3],
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { build: Buildable.cavern_tunnel } },
      ]),
  },
  [Action.excavation__1_3]: {
    availability: [1, 3],
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.build, d: { build: Buildable.excavation } }]),
  },
  [Action.starting_player__1_3]: {
    availability: [1, 3],
    enrichment: [{ food: 1 }],
    action: (p: PlayerType) => {
      utils.addResourcesToPlayer(p, { ore: 2 });
      store.gameW.game.currentPlayer = utils.myIndex();
    },
  },
  [Action.logging__1_3]: {
    availability: [1, 3],
    enrichment: [{ wood: 3 }, { wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.expedition,
          d: { num: 1 },
        },
      ]),
  },
  [Action.supplies]: {
    availability: [1, 3],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        wood: 1,
        stone: 1,
        ore: 1,
        food: 1,
        gold: 2,
      }),
  },
  [Action.ore_mining__1_3]: {
    availability: [1, 3],
    enrichment: [{ ore: 2 }, { ore: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => t.built[Buildable.ore_mine])
            .length,
      }),
  },
  [Action.wood_gathering]: {
    availability: [1, 3],
    enrichment: [{ wood: 1 }],
  },
  [Action.clearing__1_3]: {
    availability: [1, 3],
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
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { build: Buildable.farm_tile },
        },
      ]),
  },
  [Action.strip_mining]: {
    availability: [3, 3],
    enrichment: [{ ore: 1 }, { stone: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        wood: 2,
      }),
  },
  [Action.forest_exploration__3]: {
    availability: [3, 3],
    enrichment: [{ wood: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        vegetables: 1,
      }),
  },
  [Action.imitation__3]: {
    availability: [3, 3],
    foodCost: 4,
  },
  [Action.drift_mining__4_7]: {
    availability: [4, 7],
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
    enrichment: [{ food: 1 }],
    action: (p: PlayerType) => utils.addResourcesToPlayer(p, { rubies: 1 }),
  },
  [Action.imitation__4_7]: {
    availability: [4, 7],
    foodCost: 2,
  },
  [Action.logging__4_7]: {
    availability: [4, 7],
    enrichment: [{ wood: 3 }],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.expedition, d: { num: 2 } }]),
  },
  [Action.forest_exploration__4_7]: {
    availability: [4, 7],
    enrichment: [{ wood: 2 }, { wood: 1 }],
    action: (p: PlayerType) => utils.addResourcesToPlayer(p, { food: 2 }),
  },
  [Action.growth]: {
    availability: [4, 7],
    action: (p: PlayerType) =>
      p.caverns[Cavern.guest_room]
        ? Promise.resolve()
            .then(() => utils.addResourcesToPlayer(p, utils.growthRewards()))
            .then(() =>
              utils.queueTasks([
                {
                  t: Task.have_baby,
                },
              ])
            )
        : utils.haveChild(p, false)
        ? utils.queueTasks([
            {
              t: Task.growth,
            },
          ])
        : utils.addResourcesToPlayer(p, utils.growthRewards()),
  },
  [Action.clearing__4_7]: {
    availability: [4, 7],
    enrichment: [{ wood: 2 }],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.build, d: { build: Buildable.farm_tile } }]),
  },
  [Action.ore_mining__4_7]: {
    availability: [4, 7],
    enrichment: [{ ore: 3 }, { ore: 2 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => t.built[Buildable.ruby_mine])
            .length,
      }),
  },
  [Action.sustenance__4_7]: {
    availability: [4, 7],
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
    enrichment: [{ wood: 1, ore: 1 }],
  },
  [Action.small_scale_drift_mining]: {
    availability: [5, 5],
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { build: Buildable.cavern_tunnel } },
      ]),
  },
  [Action.weekly_market__5]: {
    availability: [5, 5],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { gold: 4 }) &&
      utils.queueTasks([
        {
          t: Task.weekly_market,
          d: {
            rs: {
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
    foodCost: 4,
  },
  [Action.hardware_rental__5]: {
    availability: [5, 5],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.expedition, d: { num: 2 } },
        { t: Task.sow, d: { rs: { grain: 2, vegetables: 2 } } },
      ]),
  },
  [Action.fence_building__5]: {
    availability: [5, 5],
    enrichment: [{ wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 2, canSkip: true, build: Buildable.fence } },
        {
          t: Task.build,
          d: { num: 4, canSkip: true, build: Buildable.fence_2 },
        },
      ]),
  },
  [Action.depot__6_7]: {
    availability: [6, 7],
    enrichment: [{ wood: 1, ore: 1 }],
  },
  [Action.drift_mining__6_7]: {
    availability: [6, 7],
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { build: Buildable.cavern_tunnel } },
      ]),
  },
  [Action.weekly_market__6_7]: {
    availability: [6, 7],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { gold: 4 }) &&
      utils.queueTasks([
        { t: Task.weekly_market, d: { num: Action.weekly_market__6_7 } },
      ]),
  },
  [Action.imitation__6_7]: {
    availability: [6, 7],
    foodCost: 1,
  },
  [Action.hardware_rental__6_7]: {
    availability: [6, 7],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { wood: 2 }) &&
      utils.queueTasks([
        { t: Task.expedition, d: { num: 2 } },
        { t: Task.sow, d: { rs: { grain: 2, vegetables: 2 } } },
      ]),
  },
  [Action.fence_building__6_7]: {
    availability: [6, 7],
    enrichment: [{ wood: 2 }, { wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 2, canSkip: true, build: Buildable.fence } },
        {
          t: Task.build,
          d: { num: 4, canSkip: true, build: Buildable.fence_2 },
        },
      ]),
  },
  [Action.large_depot]: {
    availability: [7, 7],
    enrichment: [
      { wood: 2, stone: 1, ore: 1 },
      { wood: 1, stone: 1, ore: 1 },
    ],
  },
  [Action.imitation__7]: {
    availability: [7, 7],
    foodCost: 0,
  },
  [Action.extension]: {
    availability: [7, 7],
    action: (p: PlayerType) =>
      p.caverns[Cavern.guest_room]
        ? utils.queueTasks([
            {
              t: Task.build,
              d: { canSkip: true, build: Buildable.farm_tile, rs: { wood: 1 } },
            },
            {
              t: Task.build,
              d: {
                canSkip: true,
                build: Buildable.cavern_tunnel,
                rs: { stone: 1 },
              },
            },
          ])
        : utils.queueTasks([
            {
              t: Task.extension,
            },
          ]),
  },
};
export default Actions;

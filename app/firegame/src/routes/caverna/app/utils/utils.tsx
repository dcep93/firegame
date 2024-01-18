import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import ExpeditionActions, { ExpeditionAction } from "./ExpeditionActions";

import Caverns, { Cavern, CavernCategory } from "./Caverns";
import {
  AnimalResourcesType,
  Buildable,
  Coords,
  GameType,
  Harvest,
  PlayerType,
  ResourcesType,
  Task,
  TaskType,
  TileType,
} from "./NewGame";
import RubyActions, { RubyAction } from "./RubyActions";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  // GRID COORDS

  numRows = 4;
  numCols = 3;

  coordsToKey(c: Coords): string {
    return [c.i, c.j, c.k].join("_");
  }

  keyToCoords(key: string): Coords {
    const [i, j, k] = key.split("_").map((i) => parseInt(i));
    return { i, j, k };
  }

  getGrid(p: PlayerType): {
    c: Coords;
    t: TileType;
  }[] {
    return Object.entries(p.grid).flatMap(([k, g]) =>
      Object.entries(g).flatMap(([i, r]) =>
        Object.entries(r).flatMap(([j, t]) => ({
          c: { i: parseInt(i), j: parseInt(j), k: parseInt(k) },
          t: utils._sanitize(t)!,
        }))
      )
    );
  }

  getTile(coords: Coords, p: PlayerType): TileType | undefined {
    return utils._sanitize(
      ((p.grid[coords.k] || {})[coords.i] || {})[coords.j]
    );
  }

  setTile(coords: Coords, t: TileType | undefined) {
    const p = utils.getMe();
    if (p.grid[coords.k] === undefined) p.grid[coords.k] = {};
    if (p.grid[coords.k][coords.i] === undefined)
      p.grid[coords.k][coords.i] = {};
    if (t !== undefined) p.grid[coords.k][coords.i][coords.j] = t;
  }

  _sanitize(t: TileType | undefined): TileType | undefined {
    if (t === undefined) return t;
    if (t.built === undefined) t.built = {};
    return t;
  }

  getAdjacents(coords: Coords, p: PlayerType): (TileType | undefined)[] {
    return [
      [-1, 0],
      [1, 0],
      [0, 1],
      [0, -1],
    ]
      .map(([i, j]) => ({ i: coords.i + i, j: coords.j + j, k: coords.k }))
      .map((cc) => utils.getTile(cc, p));
  }

  _notConnectedToHome(coords: Coords): boolean {
    const p = utils.getMe();
    if (utils.coordsToKey(coords) === utils.coordsToKey({ i: 0, j: 0, k: 0 }))
      return false;
    return (
      utils
        .getAdjacents(coords, p)
        .find(
          (t) =>
            t !== undefined &&
            [
              Buildable.cavern,
              Buildable.tunnel,
              Buildable.pasture,
              Buildable.field,
            ].find((b) => t.built[b])
        ) === undefined
    );
  }

  isOutOfBounds(coords: Coords): boolean {
    return (
      coords.i < 0 ||
      coords.i >= utils.numRows ||
      coords.j < 0 ||
      coords.j >= utils.numCols
    );
  }

  isFarm(coords: Coords): boolean {
    return coords.k === 0;
  }

  // TASKS

  getTask(): TaskType {
    return store.gameW.game.tasks[0];
  }

  queueTasks(ts: TaskType[]) {
    store.gameW.game.tasks.splice(0, 0, ...ts);
  }

  shiftTask(): TaskType {
    return store.gameW.game.tasks.shift()!;
  }

  prepareNextTask(toUpdate: string) {
    while (true) {
      if (utils.canUpcomingTask()) break;
      utils.shiftTask();
    }
    store.update(toUpdate);
  }

  canUpcomingTask(): boolean {
    const task = utils.getTask();
    const p = utils.getCurrent();
    if (task === undefined) {
      utils.finishTurn();
      return true;
    }
    if (task.t === Task.housework_dog) {
      utils.addResourcesToPlayer({ dogs: 1 });
      return false;
    }
    if (task.t === Task.have_baby) {
      return utils.haveChild(false);
    }
    if (task.t === Task.breed_2) {
      return task.d!.num! > 0 && utils.getBreedables().length > 0;
    }
    if (task.t === Task.ore_trading) {
      return task.d!.num! > 0 && (p.resources?.ore || 0) >= 2;
    }
    if (task.t === Task.slaughter) {
      return Object.keys(utils._toSlaughter()).length > 0;
    }
    if (task.t === Task.forge) {
      return (
        p.usedDwarves![0] === 0 &&
        (p.caverns[Cavern.blacksmith] || (p.resources?.ore || 0) > 0)
      );
    }
    if (task.t === Task.expedition) {
      return task.d!.num! > 0 && p.usedDwarves![0] !== 0;
    }
    if (task.t === Task.sow) {
      return (
        Object.entries(task.d!.rs!).filter(
          ([resourceName, count]) =>
            (p.resources || {})[resourceName as keyof ResourcesType]! * count >
            0
        ).length > 0
      );
    }
    if (task.t === Task.build) {
      // TODO skip/allowed build stable
      if (
        task.d!.build === Buildable.stable &&
        utils.getGrid(p).filter(({ t }) => (t.built || {})[Buildable.stable])
          .length === 3
      )
        return false;
      if (
        task.d?.canSkip &&
        utils.addResources(
          utils._getBuildCost(task) || {},
          p.resources || {}
        ) === undefined
      )
        return false;
    }
    return true;
  }

  // EXECUTABLES

  harvest(execute: boolean): boolean {
    const p = utils.getMe();
    if (!utils.isMyTurn()) return false;
    const task = utils.getTask();
    if (task.t !== Task.harvest) return false;
    if (
      store.gameW.game.harvest === Harvest.skip_one &&
      task.d?.num === undefined
    )
      return false;
    const numToFeed =
      store.gameW.game.harvest === Harvest.one_per
        ? p.usedDwarves!.length
        : Math.max(
            0,
            p.usedDwarves!.map((d) => (d < 0 ? 1 : 2)).sum() -
              (!p.caverns[Cavern.mining_cave]
                ? 0
                : utils
                    .getGrid(p)
                    .filter(
                      ({ t }) =>
                        t.resources?.donkeys !== undefined &&
                        (t.built[Buildable.ruby_mine] ||
                          t.built[Buildable.ore_mine])
                    ).length)
          );
    if ((p.resources?.food || 0) < numToFeed) return false;
    if (execute) {
      if (store.gameW.game.harvest !== Harvest.one_per) {
        if (task.d?.num !== 1) {
          const bs = utils.getBreedables();
          bs.forEach((r) => utils.addResourcesToPlayer({ [r]: 1 }));
          if (p.caverns[Cavern.breeding_cave]) {
            utils.addResourcesToPlayer({ food: [0, 1, 2, 3, 5][bs.length] });
          }
          if (p.caverns[Cavern.quarry] && bs.includes("donkeys")) {
            utils.addResourcesToPlayer({ stone: 1 });
          }
        }
      }
      delete (task.d! || {}).num;
      utils.addResourcesToPlayer({ food: -numToFeed });
      utils.shiftTask();
      utils.prepareNextTask(`fed ${numToFeed}`);
    }
    return true;
  }

  action(a: Action, execute: boolean): boolean {
    if (!utils.isMyTurn()) return false;
    const p = utils.getMe();
    const task = utils.getTask().t;
    const playerIndex = (store.gameW.game.takenActions || {})[a]?.playerIndex;
    if (task === Task.action) {
      if (playerIndex !== undefined) return false;
    } else if (task === Task.imitate) {
      if (playerIndex === undefined || playerIndex === p.index) return false;
    } else {
      return false;
    }
    const foodCost = Actions[a].foodCost;
    if (
      foodCost !== undefined &&
      utils.addResources(p.resources || {}, {
        food: foodCost,
      }) === undefined
    )
      return false;
    if (execute) {
      utils.shiftTask();
      p.usedDwarves = p
        .availableDwarves!.splice(0, 1)
        .concat(p.usedDwarves || []);
      if (store.gameW.game.takenActions === undefined)
        store.gameW.game.takenActions = {};
      store.gameW.game.takenActions![a] = {
        playerIndex: utils.myIndex(),
        dwarfIndex: p.usedDwarves.length,
      };
      const bonus = (store.gameW.game.actionBonuses || {})[a];
      if (bonus !== undefined) {
        utils.addResourcesToPlayer(bonus);
        delete store.gameW.game.actionBonuses![a];
      }
      const at = Actions[a];
      if (at.foodCost !== undefined) {
        utils.addResourcesToPlayer({ food: -at.foodCost });
        utils.queueTasks([{ t: Task.imitate }]);
      }
      if (at.action !== undefined) {
        at.action(p);
      }
      utils.prepareNextTask(`action: ${Action[a]}`);
    }
    return true;
  }

  furnish(c: Cavern, selected: Coords | undefined, execute: boolean): boolean {
    const p = utils.getMe();
    if (!utils.isMyTurn()) return false;
    if ((store.gameW.game.purchasedTiles || {})[c] !== undefined) {
      return false;
    }
    if (selected === undefined) return false;
    if (utils.isFarm(selected)) return false;
    const tile = utils.getTile(selected, p);
    if (tile === undefined) return false;
    if (tile.cavern !== undefined) return false;
    if (tile.built[Buildable.tunnel]) {
      if (tile.built[Buildable.ore_mine] || tile.built[Buildable.ruby_mine])
        return false;
      if (!p.caverns[Cavern.work_room]) return false;
    }
    const task = utils.getTask();
    if (task.t !== Task.furnish) return false;
    if (
      task.d?.build === Buildable.dwelling &&
      Caverns[c].category !== CavernCategory.dwelling
    )
      return false;
    if (task.d?.build === Buildable.dwelling_2_2 && c !== Cavern.dwelling)
      return false;
    var oppCost =
      task.d?.build === Buildable.dwelling_2_2
        ? { stone: 2, wood: 2 }
        : Caverns[c].cost;
    if (oppCost.wood !== undefined && p.caverns[Cavern.carpenter]) {
      oppCost = utils.addResources(oppCost, { wood: -1 })!;
    }
    if (oppCost.stone !== undefined && p.caverns[Cavern.stone_carver]) {
      oppCost = utils.addResources(oppCost, { stone: -1 })!;
    }

    const cost = utils.flipResources(oppCost);
    if (utils.addResources(p.resources || {}, cost) === undefined) return false;
    if (task.d?.rs !== undefined) {
      if (cost[Object.keys(task.d?.rs)[0] as keyof ResourcesType] === undefined)
        return false;
    }
    if (execute) {
      utils.shiftTask();
      if (c !== Cavern.dwelling) {
        if (store.gameW.game.purchasedTiles === undefined)
          store.gameW.game.purchasedTiles = {};
        store.gameW.game.purchasedTiles[c] = p.index;
      }
      utils.addResourcesToPlayer(cost);
      p.caverns[c] = true;
      Object.assign(tile, {
        cavern: c,
        supply: Caverns[c].supply || {},
      });
      utils.prepareNextTask(`furnished ${Cavern[c]}`);
    }
    return true;
  }

  rubyTrade(a: RubyAction, execute: boolean): boolean {
    const p = utils.getMe();
    if (!utils.isMyTurn()) return false;
    const cost = utils.flipResources(RubyActions[a].cost || { rubies: 1 });
    if (utils.addResources(p.resources || {}, cost) === undefined) return false;
    if (execute) {
      const ra = RubyActions[a];
      utils.addResourcesToPlayer(cost);
      if (ra.action) ra.action(p);
      if (ra.reward) utils.addResourcesToPlayer(ra.reward);
      utils.prepareNextTask(`traded ruby for ${RubyAction[a]}`);
    }
    return true;
  }

  expedition(a: ExpeditionAction, execute: boolean): boolean {
    const p = utils.getMe();
    if (!utils.isMyTurn()) return false;
    const t = utils.getTask();
    if (t.t !== Task.expedition) return false;
    if ((t.d!.expeditionsTaken || {})[a] !== undefined) return false;
    if (a === ExpeditionAction.strength && t.d!.num !== 1) return false;
    const e = ExpeditionActions[a];
    if (p.usedDwarves![0] < e.level) return false;
    if (execute) {
      t.d!.num!--;
      if (t.d!.expeditionsTaken === undefined) t.d!.expeditionsTaken = {};
      t.d!.expeditionsTaken[a] = true;
      const e = ExpeditionActions[a];
      if (e.reward !== undefined) {
        utils.addResourcesToPlayer(e.reward);
      }
      if (e.action !== undefined) {
        e.action(p);
      }
      utils.prepareNextTask(`expedition: ${ExpeditionAction[a]}`);
    }
    return true;
  }

  payRubyOutOfOrder(index: number, execute: boolean): boolean {
    if (!utils.isMyTurn()) return false;
    const p = utils.getMe();
    if (index <= 0) return false;
    if (p.availableDwarves![index] <= 0) return false;
    if (p.resources?.rubies === undefined) return false;
    if (execute) {
      utils.addResourcesToPlayer({ rubies: -1 });
      p.availableDwarves!.unshift(p.availableDwarves!.splice(index, 1)[0]);
      utils.prepareNextTask("paid a ruby to play out of order");
    }
    return true;
  }

  _toSlaughter(): AnimalResourcesType {
    const p = utils.getMe();
    return Object.fromEntries(
      Object.entries(p.resources || {})
        .map(([r, c]) => ({ c, r: r as keyof ResourcesType }))
        .filter(({ r }) => ["sheep", "donkeys", "boars", "cows"].includes(r))
        .map(({ r, c }) => [r, -c])
    );
  }

  slaughter(execute: boolean): boolean {
    if (!utils.isMyTurn()) return false;
    const toSlaughter = utils._toSlaughter();
    if (Object.keys(toSlaughter).length === 0) return false;
    if (execute) {
      utils.addResourcesToPlayer({
        food:
          Object.entries(toSlaughter)
            .map(([r, c]) => ({
              c: -c,
              r: r as keyof AnimalResourcesType,
            }))
            .map(({ r, c }) => {
              if (r === "sheep") {
                return c;
              }
              if (r === "donkeys") {
                return Math.floor(c * 1.5);
              }
              if (r === "boars") {
                return c * 2;
              }
              if (r === "cows") {
                return c * 3;
              }
              return 0;
            })
            .sum() +
          (!utils.getMe().caverns[Cavern.slaughtering_cave]
            ? 0
            : -Object.values(toSlaughter).sum()),
      });
      utils.addResourcesToPlayer(toSlaughter);
      utils.prepareNextTask(`slaughtered ${JSON.stringify(toSlaughter)}`);
    }
    return true;
  }

  haveChild(execute: boolean): boolean {
    if (!utils.isMyTurn()) return false;
    const p = utils.getMe();
    const numDwarves = (p.availableDwarves || []).concat(
      p.usedDwarves || []
    ).length;
    if (numDwarves > 5) {
      return false;
    }
    if (numDwarves === 5) {
      if (!p.caverns[Cavern.additional_dwelling]) return false;
    } else {
      const numDwellingSpaces = Object.keys(p.caverns)
        .map((t) => parseInt(t) as Cavern)
        .filter((t) => Caverns[t].category === CavernCategory.dwelling)
        .map(
          (t) =>
            ((
              {
                [Cavern.additional_dwelling]: 0,
                [Cavern.couple_dwelling]: 2,
                [Cavern.starting_dwelling]: 2,
              } as { [c in Cavern]?: number }
            )[t])
        )
        .map((space) => (space === undefined ? 1 : space))
        .sum();
      if (numDwellingSpaces <= numDwarves) return false;
    }
    if (execute) {
      p.usedDwarves!.unshift(-1);
    }
    return true;
  }

  forge(level: number, execute: boolean) {
    if (!utils.isMyTurn()) return false;
    const p = utils.getMe();
    const ore = -level + (p.caverns[Cavern.blacksmith] ? 2 : 0);
    if ((p.resources?.ore || 0) < ore) return false;
    if (execute) {
      utils.shiftTask();
      p.usedDwarves![0] = level;
      utils.addResourcesToPlayer({
        ore,
      });
      utils.prepareNextTask(`forged ${level}`);
    }
    return true;
  }

  // BUILD

  build(coords: Coords, execute: boolean): boolean {
    const p = utils.getMe();
    if (!utils.isMyTurn()) return false;
    if (utils._notConnectedToHome(coords)) return false;
    const task = utils.getTask();
    if (task.t !== Task.build) return false;

    if (task.d!.buildData !== undefined) {
      const [b1, b2, rowColumn, tileIndex] = task.d!.buildData;
      const cs = utils.count(2).map(() => Object.assign({}, coords));
      cs[1 - rowColumn][1 - tileIndex === 0 ? "i" : "j"] +=
        rowColumn === 0 ? -1 : 1;
      if (!utils._buildHelper(b1, cs[0], execute)) return false;
      if (!utils._buildHelper(b2, cs[1], execute)) return false;
      if (execute) {
        // TODO can I build double fence
        if (task.d!.build === Buildable.fence_2) {
          this.getTile(cs[0], p)!.doubleFenceCoords = cs[1];
          const tt = utils.getTile(cs[1], p)!;
          if (tt.resources !== undefined) {
            utils.addResourcesToPlayer(tt.resources);
            tt.resources = {};
          }
        }
      }
    } else {
      if (!utils._buildHelper(task.d!.build!, coords, execute)) return false;
    }
    if (execute) {
      utils.shiftTask();
      if (task.d?.rs !== undefined) utils.addResourcesToPlayer(task.d!.rs);
      utils.addResourcesToPlayer(utils._getBuildCost(task) || {});
      utils.prepareNextTask(`built ${Buildable[task.d!.build!]}`);
    }
    return true;
  }

  _buildHelper(
    buildable: Buildable,
    coords: Coords,
    execute: boolean
  ): boolean {
    const p = utils.getMe();
    if (utils.isOutOfBounds(coords)) {
      if (coords.j < 0 || !p.caverns[Cavern.office_room]) return false;
      if (execute) {
        utils.addResourcesToPlayer({ gold: 2 });
      }
    }
    if (utils.getTile(coords, p) === undefined)
      utils.setTile(coords, execute ? { resources: {}, built: {} } : undefined);
    const t = utils.getTile(coords, p);
    if ((t?.built || {})[buildable]) return false;
    if (execute) {
      t!.built[buildable] = true;

      if (buildable !== Buildable.stable) {
        const coordsKey = utils.coordsToKey(coords);
        const b = (p.tileBonuses || {})[coordsKey];
        if (b !== undefined) {
          utils.addResourcesToPlayer(b);
          delete p.tileBonuses![coordsKey];
        }
      }

      if (buildable === Buildable.ruby_mine) {
        if (t!.built[Buildable.ore_tunnel])
          utils.addResourcesToPlayer({ rubies: 1 });
      }

      return true;
    }
    return utils._canBuild(t, buildable, coords);
  }

  _canBuild(
    tile: TileType | undefined,
    buildable: Buildable,
    coords: Coords
  ): boolean {
    switch (buildable) {
      case Buildable.fence_2:
      case Buildable.fence:
      case Buildable.stable:
      case Buildable.pasture:
      case Buildable.field:
        if (!utils.isFarm(coords)) return false;
        switch (buildable) {
          case Buildable.fence_2:
          case Buildable.fence:
            if (tile === undefined) return false;
            if (!tile.built[Buildable.pasture]) return false;
            return true;
          case Buildable.stable:
            return true;
          case Buildable.pasture:
            if (tile !== undefined) {
              const numBuilt = Object.keys(tile.built).length;
              if (numBuilt === 1 && tile.built[Buildable.stable]) {
                return true;
              }
              return false;
            }
            return true;
          case Buildable.field:
            if (tile !== undefined) return false;
            return true;
        }
    }
    if (utils.isFarm(coords)) return false;
    switch (buildable) {
      case Buildable.tunnel:
        if (tile !== undefined) return false;
        return true;
      case Buildable.cavern:
        if (tile !== undefined) return false;
        return true;
      case Buildable.ruby_mine:
        if (tile === undefined) return false;
        if (!tile.built[Buildable.tunnel] || tile.built[Buildable.ore_mine])
          return false;
        const num = utils.getTask().d!.num;
        if (num !== undefined) {
          if ((tile.built[Buildable.ore_tunnel] || false) !== (num === 1))
            return false;
        }
        return true;
    }
    return false;
  }

  _getBuildCost(task: TaskType): ResourcesType | undefined {
    const p = utils.getMe();
    switch (task.d!.build!) {
      case Buildable.fence:
      case Buildable.fence_2:
        return {
          wood: -task.d!.num! + (p.caverns[Cavern.carpenter] ? 1 : 0),
        };
      case Buildable.stable:
        return {
          stone: Math.min(
            0,
            -task.d!.num! + (p.caverns[Cavern.stone_carver] ? 1 : 0)
          ),
        };
    }
  }

  // RESOURCES

  flipResources(rs: ResourcesType): ResourcesType {
    return Object.fromEntries(Object.entries(rs).map(([k, v]) => [k, -v]));
  }

  addResources(
    _addTo: ResourcesType,
    addFrom: ResourcesType
  ): ResourcesType | undefined {
    const addTo = Object.assign({}, _addTo);
    Object.entries(addFrom)
      .map(([k, v]) => ({ k, v } as { k: keyof ResourcesType; v: number }))
      .forEach(({ k, v }) => {
        addTo[k] = v + (addTo[k] || 0);
        if (addTo[k] === 0) {
          delete addTo[k];
        }
      });
    if (Object.values(addTo).filter((c) => c < 0).length > 0) {
      return undefined;
    }
    return addTo;
  }

  addResourcesToPlayer(r: ResourcesType): boolean {
    return utils._addResourcesToPlayer(r, false);
  }

  moveResources(r: ResourcesType): boolean {
    return utils._addResourcesToPlayer(r, true);
  }

  _addResourcesToPlayer(r: ResourcesType, isMoving: boolean): boolean {
    const p = utils.getMe();
    const addedResources = utils.addResources(p.resources || {}, r);
    if (addedResources === undefined) return false;
    p.resources = addedResources;
    if ((r.dogs || 0) > 0 && p.caverns[Cavern.dog_school])
      utils.addResourcesToPlayer({ wood: r.dogs! });
    if (
      (r.stone || 0) > 0 &&
      p.caverns[Cavern.seam] &&
      Object.values(r).filter((v) => v < 0).length === 0
    )
      utils.addResourcesToPlayer({ ore: r.stone! });
    if (!isMoving) {
      Object.keys(utils._toSlaughter())
        .map((r) => r as keyof ResourcesType)
        .forEach((r) => {
          while (true) {
            if (p.resources![r] === undefined) break;
            const destinations = utils
              .getGrid(p)
              .filter(({ c }) => utils.resourceToTile(c, r, false))
              .map(({ c, t }) => ({
                t,
                rank: [
                  c.k * 1000, // 1000 points if cave
                  Caverns[t.cavern!]?.category === CavernCategory.dwelling
                    ? -100
                    : 0, // -100 points for dwelling
                  t.doubleFenceCoords ? 100 : 0, // 100 points for double fence
                  t.built[Buildable.pasture] ? 500 : 0, // 500 points for pasture
                  10 * (t.resources?.sheep || 0), // 10 points for sheep
                  Object.values(t.resources || {}).sum(), // points for existing resources
                ].sum(),
              }))
              .sort((a, b) => b.rank - a.rank);
            if (destinations.length === 0) break;
            destinations[0].t.resources = utils.addResources(
              destinations[0].t.resources || {},
              { [r]: 1 }
            )!;
            utils.moveResources({ [r]: -1 });
          }
        });
    }
    return true;
  }

  resourceToTile(
    selected: Coords | undefined,
    resourceName: keyof ResourcesType,
    execute: boolean
  ): boolean {
    if (!utils.isMyTurn()) return false;
    const p = utils.getMe();
    const task = utils.getTask();
    const tile =
      selected === undefined ? undefined : utils.getTile(selected, p);
    switch (resourceName) {
      case "food":
        return utils.harvest(execute);
      case "rubies":
        return false;
      case "gold":
        if (execute) {
          utils.queueTasks([{ t: Task.eat_gold }]);
          utils.prepareNextTask(`is about to eat gold`);
        }
        return true;
      case "grain":
      case "vegetables":
        if (execute) {
          if (
            task.t === Task.sow &&
            task.d!.rs![resourceName] &&
            tile !== undefined &&
            tile.resources === undefined &&
            !tile.built[Buildable.pasture]
          ) {
            tile.resources = {
              [resourceName]: resourceName === "grain" ? 3 : 2,
            };
            task.d!.rs![resourceName]!--;
            utils.prepareNextTask(`planted ${resourceName}`);
          } else {
            utils.addResourcesToPlayer({
              food: resourceName === "vegetables" ? 2 : 1,
              [resourceName]: -1,
            });
            utils.prepareNextTask(`ate ${resourceName}`);
          }
        }
        return true;
      case "dogs":
      case "sheep":
      case "donkeys":
      case "boars":
      case "cows":
        if (tile === undefined) return false;
        if (
          Object.keys(tile.resources || {}).filter(
            (r) => !["dogs", resourceName].includes(r)
          ).length !== 0
        )
          return false;
        var allowed = false;
        const cavern = tile.cavern;
        if (cavern !== undefined) {
          const c = Caverns[cavern];
          if (
            c.animalRoom !== undefined &&
            c.animalRoom(
              utils.addResources(tile.resources || {}, { [resourceName]: 1 })!,
              p
            )
          ) {
            allowed = true;
          }
        } else {
          if (tile.built[Buildable.pasture]) {
            if (tile.built[Buildable.fence]) {
              var numAllowed = 2;
              if (tile.built[Buildable.stable]) numAllowed *= 2;
              if (tile.built[Buildable.fence_2]) {
                numAllowed *= 2;
                if (tile.doubleFenceCoords === undefined) return false;
                if (
                  utils.getTile(tile.doubleFenceCoords, p)!.built[
                    Buildable.stable
                  ]
                )
                  numAllowed *= 2;
              }
              if (numAllowed > ((tile.resources || {})[resourceName] || 0))
                allowed = true;
            } else if (
              tile.built[Buildable.stable] &&
              tile.resources === undefined
            ) {
              allowed = true;
            }
          } else if (
            p.caverns[Cavern.stubble_room] &&
            tile.resources === undefined &&
            tile.built[Buildable.field] === false
          ) {
            allowed = true;
          }
        }
        if (!allowed) {
          switch (resourceName) {
            case "dogs":
              allowed = true;
              break;
            case "sheep":
              if ((tile.resources?.dogs || -1) >= (tile.resources?.sheep || 0))
                allowed = true;
              break;
            case "donkeys":
              if (
                tile.resources === undefined &&
                (tile.built[Buildable.ore_mine] ||
                  tile.built[Buildable.ruby_mine])
              )
                allowed = true;
              break;
            case "boars":
              if (tile.resources === undefined && tile.built[Buildable.stable])
                allowed = true;
              break;
            case "cows":
              break;
          }
        }
        if (!allowed) return false;
        if (execute) {
          if (!tile.resources) tile.resources = {};
          tile.resources[resourceName] =
            1 + (tile.resources[resourceName] || 0);
          utils.moveResources({ [resourceName]: -1 });
          utils.prepareNextTask(`moved down ${resourceName}`);
        }
        return true;
      case "stone":
      case "wood":
      case "ore":
        if (
          !p.caverns[Cavern.working_cave] ||
          task.t !== Task.harvest ||
          store.gameW.game.harvest === Harvest.one_per ||
          task.d?.rs !== undefined
        )
          return false;
        const cost = {
          food: 2,
          [resourceName]: resourceName === "ore" ? -2 : -1,
        };
        if (utils.addResources(p.resources || {}, cost) === undefined)
          return false;
        if (execute) {
          utils.addResourcesToPlayer(cost);
          store.gameW.game.tasks[0].d!.rs = { [resourceName]: 1 };
          utils.prepareNextTask(`ate ${resourceName}`);
        }
        return true;
    }
  }

  getBreedables(): (keyof AnimalResourcesType)[] {
    const p = utils.getMe();
    return Object.entries(utils.getAllResources(p))
      .map(([r, c]) => ({ r: r as keyof AnimalResourcesType, c }))
      .filter(({ r }) => ["sheep", "donkeys", "boars", "cows"].includes(r))
      .filter(({ r }) => (utils.getTask()!.d!.rs || {})[r] === undefined)
      .filter(({ c }) => c >= 2)
      .map(({ r }) => r);
  }

  // TODO make sure we pull
  pullOffFields(p: PlayerType) {
    utils
      .getGrid(p)
      .filter(
        ({ t }) =>
          t.resources?.grain !== undefined ||
          t.resources?.vegetables !== undefined
      )
      .map(({ t }) => ({ t, r: Object.keys(t)[0] }))
      .forEach(({ t, r }) => {
        utils.addResourcesToPlayer({ [r]: 1 });
        t.resources = utils.addResources(t.resources!, { [r]: -1 })!;
      });
  }

  // GAME FLOW

  finishTurn() {
    if (Object.keys(utils._toSlaughter()).length > 0) {
      utils.queueTasks([{ t: Task.slaughter }]);
      return;
    }
    if (store.gameW.game.harvest !== undefined) {
      utils.incrementPlayerTurn();
      if (store.gameW.game.currentPlayer === store.gameW.game.startingPlayer) {
        if (store.gameW.game.upcomingHarvests === undefined) {
          utils.queueTasks([{ t: Task.game_end }]);
        } else {
          utils.enrichAndReveal(store.gameW.game);
        }
      } else {
        utils.queueTasks([{ t: Task.harvest }]);
      }
      return;
    }
    while (true) {
      utils.incrementPlayerTurn();
      if ((utils.getCurrent().availableDwarves || []).length > 0) {
        utils.queueTasks([{ t: Task.action }]);
        break;
      }
      if (utils.isMyTurn()) {
        store.gameW.game.currentPlayer = store.gameW.game.startingPlayer;
        var h = store.gameW.game.upcomingHarvests!.shift();
        if (h === Harvest.random) {
          const hs = utils.shuffle(store.gameW.game.randomHarvests!);
          if (hs[0] < Harvest.harvest) hs.sort((a, b) => a - b);
          h = hs.shift()!;
          hs.sort((a, b) => a - b);
        }
        if (h === Harvest.nothing) {
          utils.enrichAndReveal(store.gameW.game);
        } else {
          store.gameW.game.harvest = h;
          utils.queueTasks([{ t: Task.harvest }]);
        }
        break;
      }
    }
  }

  enrichAndReveal(g: GameType): GameType {
    g.currentPlayer = g.startingPlayer;
    delete g.harvest;
    delete g.takenActions;
    g.players.forEach(
      (p) =>
        (p.availableDwarves = p
          .usedDwarves!.splice(0)
          .map((d) => Math.max(d, 0))
          .sort((a, b) => a - b))
    );
    g.players.forEach((p) =>
      utils
        .getGrid(p)
        .filter(({ t }) => t.supply !== undefined)
        .map(({ t }) => ({ t, r: Object.keys(t.supply!)[0] }))
        .forEach(({ t, r }) => {
          utils.addResourcesToPlayer({ [r]: 1 });
          t.supply = utils.addResources(t.supply!, { [r]: -1 }) || {};
        })
    );
    g.players
      .map((p) => ({
        p,
        num: utils
          .getGrid(p)
          .filter(
            ({ t }) =>
              t.resources?.donkeys !== undefined && t.built[Buildable.ore_mine]
          ).length,
      }))
      .filter(({ p, num }) => num > 0 && p.caverns[Cavern.miner])
      .forEach(({ p, num }) => utils.addResourcesToPlayer({ ore: num }));

    g.tasks = [{ t: Task.action }];
    g.actions.push(
      utils
        .shuffle(g.upcomingActions!)
        .sort((a, b) => Actions[a].availability[0] - Actions[b].availability[0])
        .pop()!
    );
    if (g.actionBonuses === undefined) {
      g.actionBonuses = {};
    }
    g.actions
      .map((a) => ({ a, e: Actions[a].enrichment }))
      .filter(({ e }) => e)
      .forEach(
        ({ a, e }) =>
          (g.actionBonuses![a] =
            g.actionBonuses![a] === undefined
              ? Object.assign({}, e![0])
              : utils.addResources(g.actionBonuses![a]!, e![e!.length - 1]))
      );

    return g;
  }

  // PLAYER

  getAllResources(p: PlayerType): ResourcesType {
    return utils
      .getGrid(p)
      .filter(({ t }) => t.resources !== undefined)
      .map(({ t }) => t.resources!)
      .concat(p.resources || {})
      .reduce(
        (prev, curr) => utils.addResources(prev, curr)!,
        {} as ResourcesType
      );
  }

  getScoreDict(p: PlayerType): { [k: string]: number } {
    const allResources = this.getAllResources(p);
    return {
      animal: Object.entries(allResources)
        .map(([r, c]) => ({ r: r as keyof ResourcesType, c }))
        .filter(({ r }) =>
          (
            [
              "dogs",
              "sheep",
              "donkeys",
              "boars",
              "cows",
            ] as (keyof ResourcesType)[]
          ).includes(r)
        )
        .map(({ c }) => c)
        .sum(),
      grain: Math.ceil((allResources.grain || 0) / 2),
      vegetables: allResources.vegetables || 0,
      rubies: allResources.rubies || 0,
      dwarves: (p.availableDwarves || []).concat(p.usedDwarves || []).length,
      unusedSpaceMissingAnimal: Math.min(
        0,
        ((p.caverns || {})[Cavern.writing_chamber] ? 7 : 0) +
          -2 *
            (4 -
              Object.keys(allResources)
                .map((r) => r as keyof ResourcesType)
                .filter((r) =>
                  (
                    [
                      "sheep",
                      "donkeys",
                      "boars",
                      "cows",
                    ] as (keyof ResourcesType)[]
                  ).includes(r)
                ).length) -
          [0, 1]
            .flatMap((k) =>
              utils
                .count(utils.numRows)
                .flatMap((i) =>
                  utils.count(utils.numCols).map((j) => ({ i, j, k }))
                )
            )
            .filter((coords) => utils.getTile(coords, p) === undefined).length
      ),
      furnishingPasturesMines:
        Object.keys(p.caverns || {})
          .map((t) => parseInt(t) as Cavern)
          .map((t) => Caverns[t])
          .filter((t) => t.category !== CavernCategory.yellow)
          .map((tile) => tile.points!)
          .sum() +
        2 *
          utils
            .getGrid(p)
            .map(({ t }) =>
              t.doubleFenceCoords ? 4 : t.built[Buildable.fence] ? 2 : 0
            )
            .sum() +
        utils
          .getGrid(p)
          .map(({ t }) =>
            t.built[Buildable.ruby_mine] === true
              ? 4
              : t.built[Buildable.ore_mine] === false
              ? 3
              : 0
          )
          .sum(),
      parlorsStoragesChambers: Object.keys(p.caverns || {})
        .map((t) => parseInt(t) as Cavern)
        .map((t) => Caverns[t])
        .filter((t) => t.category === CavernCategory.yellow)
        .map((tile) =>
          tile.points !== undefined ? tile.points : tile.pointsF!(p)
        )
        .sum(),
      goldBegging: (p.resources || {}).gold || 0 - 3 * (p.begging || 0),
    };
  }

  getColor(index: number): string {
    return [
      "pink",
      "lightblue",
      "lightgreen",
      "yellow",
      "violet",
      "lightcoral",
      "lightsalmon",
    ][index];
  }
}

const utils = new Utils();

export default utils;

export { store };

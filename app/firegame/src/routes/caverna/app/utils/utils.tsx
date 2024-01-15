import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import ExpeditionActions, { ExpeditionAction } from "./ExpeditionActions";

import Caverns, { Cavern, CavernCategory } from "./Caverns";
import {
  AnimalResourcesType,
  Buildable,
  CaveTileType,
  FarmTileType,
  GameType,
  PlayerType,
  ResourcesType,
  Task,
  TaskType,
} from "./NewGame";
import RubyActions, { RubyAction } from "./RubyActions";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  getGrid(p: PlayerType): {
    i: number;
    j: number;
    k: number;
    t: CaveTileType | FarmTileType;
  }[] {
    return [p.cave, p.farm || {}].flatMap((g, k) =>
      Object.entries(g).flatMap(([i, r]) =>
        Object.entries(r).flatMap(([j, t]) => ({
          i: parseInt(i),
          j: parseInt(j),
          k,
          t: t as CaveTileType | FarmTileType,
        }))
      )
    );
  }
  getScoreDict(p: PlayerType): { [k: string]: number } {
    const allResources = this.getGrid(p)
      .filter(({ t }) => t.resources !== undefined)
      .map(({ t }) => t.resources!)
      .concat(p.resources || {})
      .reduce(
        (prev, curr) => utils.addResources(prev, curr)!,
        {} as ResourcesType
      );
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
        ((p.boughtTiles || {})[Cavern.writing_chamber] ? 7 : 0) +
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
          [p.cave, p.farm]
            .flatMap((g) =>
              utils
                .count(4)
                .flatMap((r) => utils.count(3).map((c) => ({ g, r, c })))
            )
            .filter(({ g, r, c }) => ((g || {})[r] || {})[c] === undefined)
            .length
      ),
      furnishingPasturesMines:
        Object.keys(p.boughtTiles || {})
          .map((t) => parseInt(t) as Cavern)
          .map((t) => Caverns[t])
          .filter((t) => t.category !== CavernCategory.yellow)
          .map((tile) => tile.points!)
          .sum() +
        2 *
          this.getGrid(p)
            .map(({ t }) => ((t as FarmTileType).isFence ? 2 : 0))
            .sum() +
        this.getGrid(p)
          .map(({ t }) =>
            (t as CaveTileType).isOreMine === true
              ? 3
              : (t as CaveTileType).isOreMine === false
              ? 4
              : 0
          )
          .sum(),
      parlorsStoragesChambers: Object.keys(p.boughtTiles || {})
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

  addResourcesToPlayer(p: PlayerType, r: ResourcesType): boolean {
    const addedResources = this.addResources(p.resources || {}, r);
    if (addedResources === undefined) return false;
    p.resources = addedResources;
    if ((r.dogs || 0) > 0 && p.boughtTiles[Cavern.dog_school])
      this.addResourcesToPlayer(p, { wood: r.dogs! });
    if (
      (r.stone || 0) > 0 &&
      p.boughtTiles[Cavern.seam] &&
      Object.values(r).filter((v) => v < 0).length === 0
    )
      this.addResourcesToPlayer(p, { ore: r.stone! });
    return true;
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

  enrichAndReveal(g: GameType): GameType {
    g.tasks = [{ t: Task.action }];
    g.actions.push(
      utils
        .shuffle(g.upcomingActions!)
        .sort((a, b) => Actions[a].availability[0] - Actions[b].availability[0])
        .pop()!
    );
    g.players.forEach(
      (p) =>
        (p.availableDwarves = p
          .usedDwarves!.splice(0)
          .map((d) => Math.max(d, 0))
          .sort((a, b) => a - b))
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
    g.currentPlayer = g.startingPlayer;

    g.players
      .map((p) => ({
        p,
        num: utils
          .getGrid(p)
          .map(
            ({ t }) =>
              t.resources?.donkeys !== undefined &&
              (t as CaveTileType).isOreMine === true
          ).length,
      }))
      .filter(({ p, num }) => num > 0 && p.boughtTiles[Cavern.miner])
      .forEach(({ p, num }) => this.addResourcesToPlayer(p, { ore: num }));
    return g;
  }

  chunk<T>(ts: T[], num: number): T[][] {
    return ts
      .reduce(
        (prev, curr: T) => {
          if (prev[0].length === num) {
            prev.unshift([]);
          }
          prev[0].push(curr);
          return prev;
        },
        [[]] as T[][]
      )
      .reverse();
  }

  getTask(): TaskType {
    return store.gameW.game.tasks[0];
  }

  canAction(a: Action): boolean {
    if (!utils.isMyTurn()) return false;
    const foodCost = Actions[a].foodCost;
    if (
      foodCost !== undefined &&
      utils.addResources(utils.getCurrent().resources || {}, {
        food: foodCost,
      }) === undefined
    )
      return false;
    const task = this.getTask().t;
    const playerIndex = (store.gameW.game.takenActions || {})[a]?.playerIndex;
    if (task === Task.action) {
      return playerIndex === undefined;
    }
    if (task === Task.imitate) {
      return playerIndex !== undefined && playerIndex !== utils.myIndex();
    }
    return false;
  }

  action(a: Action, p: PlayerType) {
    this.shiftTask();
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
      utils.addResourcesToPlayer(p, bonus);
      delete store.gameW.game.actionBonuses![a];
    }
    const at = Actions[a];
    if (at.foodCost !== undefined) {
      utils.addResourcesToPlayer(p, { food: -at.foodCost });
      utils.queueTasks([{ t: Task.imitate }]);
    }
    if (at.action !== undefined) {
      at.action(p);
    }
    this.prepareNextTask(`action: ${Action[a]}`);
  }

  furnishCost(t: Cavern, p: PlayerType): ResourcesType {
    var cost = Caverns[t].cost;
    if (cost.wood !== undefined && p.boughtTiles[Cavern.carpenter]) {
      cost = this.addResources(cost, { wood: -1 })!;
    }
    if (cost.stone !== undefined && p.boughtTiles[Cavern.stone_carver]) {
      cost = this.addResources(cost, { stone: -1 })!;
    }
    return cost;
  }

  canFurnish(
    t: Cavern,
    p: PlayerType,
    selected: [number, number, number]
  ): boolean {
    if ((store.gameW.game.purchasedTiles || {})[t] !== undefined) {
      return false;
    }
    if (!utils.isMyTurn()) return false;
    if (selected[2] !== 1) return false;
    if (p.cave[selected[0]] === undefined) p.cave[selected[0]] = [];
    const caveTile = p.cave[selected[0]][selected[1]];
    if (caveTile !== undefined) {
      if (
        caveTile.tile !== undefined ||
        p.cave[selected[0]][selected[1]].isOreMine ||
        (!p.cave[selected[0]][selected[1]].isCavern &&
          p.boughtTiles[Cavern.work_room] === undefined)
      ) {
        return false;
      }
    }
    const cost = this.furnishCost(t, p);
    if (this.addResources(p.resources || {}, cost) === undefined) return false;
    const task = this.getTask();
    if (task.d?.resource !== undefined) {
      if ((cost[task.d?.resource] || 0) < 1) return false;
    }
    if (task.t === Task.furnish_dwelling) {
      return Caverns[t].category === CavernCategory.dwelling;
    }
    return task.t === Task.furnish_cavern;
  }

  furnish(t: Cavern, p: PlayerType, selected: [number, number, number]) {
    this.shiftTask();
    if (store.gameW.game.purchasedTiles === undefined)
      store.gameW.game.purchasedTiles = {};
    store.gameW.game.purchasedTiles[t] = p.index;
    this.addResourcesToPlayer(p, this.furnishCost(t, p));
    p.boughtTiles[t] = true;
    p.cave[selected[0]]![selected[1]] = { tile: t };
    this.prepareNextTask(`furnished ${Cavern[t]}`);
  }

  canRubyTrade(a: RubyAction, p: PlayerType): boolean {
    return (
      this.addResources(
        p.resources || {},
        RubyActions[a].cost || { rubies: -1 }
      ) !== undefined
    );
  }

  rubyTrade(a: RubyAction, p: PlayerType) {
    const ra = RubyActions[a];
    this.addResourcesToPlayer(p, ra.cost || { rubies: -1 });
    if (ra.action) ra.action(p);
    if (ra.reward) this.addResourcesToPlayer(p, ra.reward);
    store.update(`traded ruby for ${RubyAction[a]}`);
  }

  canExpedition(a: ExpeditionAction, p: PlayerType): boolean {
    if (!utils.isMyTurn()) return false;
    const taskObj = this.getTask();
    if (taskObj.t !== Task.expedition) return false;
    if ((taskObj.d!.expeditionsTaken || {})[a] !== undefined) return false;
    if (a === ExpeditionAction.strength && taskObj.d!.num !== 1) return false;
    const e = ExpeditionActions[a];
    return p.usedDwarves![0] >= e.level;
  }

  expedition(a: ExpeditionAction, p: PlayerType) {
    const t = this.getTask();
    if (--t.d!.num! === 0) {
      this.shiftTask();
    } else {
      if (t.d!.expeditionsTaken === undefined) t.d!.expeditionsTaken = {};
      t.d!.expeditionsTaken[a] = true;
    }
    const e = ExpeditionActions[a];
    if (e.reward !== undefined) {
      this.addResourcesToPlayer(p, e.reward);
    }
    if (e.action !== undefined) {
      e.action(p);
    }
    this.prepareNextTask(`expedition: ${ExpeditionAction[a]}`);
  }

  canPayRubyOutOfOrder(p: PlayerType, index: number): boolean {
    return (
      index > 0 &&
      p.availableDwarves![index] > 0 &&
      ((p.resources || {}).rubies || 0) >= 1
    );
  }

  payRubyOutOfOrder(p: PlayerType, index: number) {
    p.availableDwarves!.unshift(p.availableDwarves!.splice(index, 1)[0]);
    store.update("paid a ruby to play out of order");
  }

  _toSlaughter(p: PlayerType): AnimalResourcesType {
    return Object.fromEntries(
      Object.entries(p.resources || {})
        .map(([r, c]) => ({ c, r: r as keyof ResourcesType }))
        .filter(({ r }) => ["sheep", "donkeys", "boars", "cows"].includes(r))
        .map(({ r, c }) => [r, -c])
    );
  }

  canSlaughter(p: PlayerType): boolean {
    return Object.keys(this._toSlaughter(p)).length > 0;
  }

  slaughter(p: PlayerType) {
    const toSlaughter = this._toSlaughter(p);
    this.addResourcesToPlayer(p, {
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
        (!p.boughtTiles[Cavern.slaughtering_cave]
          ? 0
          : -Object.values(toSlaughter).sum()),
    });
    this.addResourcesToPlayer(p, toSlaughter);
  }

  // TODO cant finish turn if animals to slaughter
  finishTurn() {
    while (true) {
      utils.incrementPlayerTurn();
      if ((utils.getCurrent().availableDwarves || []).length > 0) {
        this.queueTasks([{ t: Task.action }]);
        return;
      }
      if (utils.isMyTurn()) {
        store.gameW.game.currentPlayer = store.gameW.game.startingPlayer;
        this.queueTasks([{ t: Task.feed }]);
        return;
      }
    }
  }

  _numToFeed(p: PlayerType): number {
    return Math.max(
      0,
      p.usedDwarves!.map((d) => (d < 0 ? 1 : 2)).sum() -
        (!p.boughtTiles[Cavern.mining_cave]
          ? 0
          : this.getGrid(p).filter(
              ({ t }) =>
                t.resources?.donkeys !== undefined &&
                (t as CaveTileType).isOreMine !== undefined
            ).length)
    );
  }

  canFeed(p: PlayerType): boolean {
    return ((p.resources || {}).food || 0) >= this._numToFeed(p);
  }

  feed(p: PlayerType) {
    const numToFeed = this._numToFeed(p);
    this.addResourcesToPlayer(p, { food: -numToFeed });
    utils.incrementPlayerTurn();
    if (store.gameW.game.currentPlayer === store.gameW.game.startingPlayer) {
      store.gameW.game.tasks = [{ t: Task.breed }];
    }
    store.update(`fed ${numToFeed}`);
  }

  canHaveChild(p: PlayerType): boolean {
    const numDwarves = (p.availableDwarves || []).concat(
      p.usedDwarves || []
    ).length;
    if (numDwarves > 5) {
      return false;
    }
    if (numDwarves === 5) {
      if (p.boughtTiles[Cavern.additional_dwelling] === undefined) return false;
    }
    const numDwellingSpaces = Object.keys(p.boughtTiles)
      .map((t) => parseInt(t) as Cavern)
      .filter((t) => Caverns[t].category === CavernCategory.dwelling)
      .map((t) =>
        [Cavern.couple_dwelling, Cavern.starting_dwelling].includes(t) ? 2 : 1
      )
      .sum();
    return numDwellingSpaces > numDwarves;
  }

  queueTasks(ts: TaskType[]) {
    store.gameW.game.tasks.splice(0, 0, ...ts);
  }

  shiftTask(): TaskType {
    return store.gameW.game.tasks.shift()!;
  }

  prepareNextTask(toUpdate: string) {
    while (true) {
      if (this.canUpcomingTask()) break;
      this.shiftTask();
    }
    store.update(toUpdate);
  }

  canUpcomingTask(): boolean {
    const task = this.getTask();
    if (task === undefined) {
      this.finishTurn();
      return true;
    }
    const p = utils.getCurrent();
    if (task.t === Task.forge) {
      return (
        p.usedDwarves![0] === 0 &&
        (p.boughtTiles[Cavern.blacksmith] || (p.resources?.ore || 0) > 0)
      );
    }
    if (task.t === Task.expedition) {
      return utils.getCurrent().usedDwarves![0] !== 0;
    }
    if (task.t === Task.sow) {
      return (
        Object.entries(task.d!.canSow!).filter(
          ([resourceName, count]) =>
            (p.resources || {})[resourceName as keyof ResourcesType]! * count >
            0
        ).length > 0
      );
    }
    if (task.t === Task.build) {
      if (
        task.d!.toBuild === Buildable.stable &&
        this.getGrid(p).filter(({ t }) => (t as FarmTileType).isStable)
          .length === 3
      )
        return false;
      return (
        this.addResources(
          this.getBuildCost(task, p) || {},
          p.resources || {}
        ) !== undefined
      );
    }
    return true;
  }

  getBuildCost(task: TaskType, p: PlayerType): ResourcesType | undefined {
    switch (task.d!.toBuild!) {
      case Buildable.fence:
      case Buildable.double_fence:
        return {
          wood: task.d!.num! - (p.boughtTiles[Cavern.carpenter] ? 1 : 0),
        };
      case Buildable.stable:
        return {
          stone: Math.max(
            0,
            task.d!.num! - (p.boughtTiles[Cavern.stone_carver] ? 1 : 0)
          ),
        };
    }
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

  numAdjacentToStateParlor(p: PlayerType): number {
    const coords = this.getGrid(p).find(
      ({ t }) => (t as CaveTileType).tile === Cavern.state_parlor
    )!;
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map(([i, j]) => (p.cave[coords.i + i] || {})[coords.j + j]?.tile)
      .filter(
        (t) =>
          t !== undefined && Caverns[t]?.category === CavernCategory.dwelling
      ).length;
  }

  forge(p: PlayerType, level: number) {
    this.shiftTask();
    p.usedDwarves![0] = level;
    this.addResourcesToPlayer(p, {
      ore: -level + (p.boughtTiles[Cavern.blacksmith] ? 2 : 0),
    });
    this.prepareNextTask(`forged ${level}`);
  }

  skipBuild() {
    const task = this.shiftTask();
    this.prepareNextTask(`skipped building ${Task[task.d!.toBuild!]}`);
  }

  workingCave(p: PlayerType, resourceName: keyof ResourcesType) {
    this.addResourcesToPlayer(p, {
      food: 2,
      [resourceName]: resourceName === "ore" ? -2 : -1,
    });
    store.gameW.game.tasks[0].d = { num: 1 };
    store.update(`ate ${resourceName}`);
  }

  beerParlor(p: PlayerType, message: string, reward: ResourcesType) {
    this.shiftTask();
    this.addResourcesToPlayer(p, reward);
    this.prepareNextTask(`earned ${message}`);
  }

  builderExchange(p: PlayerType, builderResource: keyof ResourcesType) {
    this.addResourcesToPlayer(p, { [builderResource]: 1, ore: -1 });
    store.gameW.game.tasks[0].d = {
      resource: builderResource,
    };
    store.update(`converted ore for ${builderResource}`);
  }

  _buildHereBeforePaying(
    task: TaskType,
    p: PlayerType,
    coords: [number, number, number],
    execute: boolean
  ): boolean {
    if (task.t !== Task.build) return false;
    const t = this.getGrid(p).find(({ i, j, k }) =>
      this.objEqual([i, j, k], coords)
    );
    switch (task.d!.toBuild) {
      case Buildable.fence:
      case Buildable.double_fence:
      case Buildable.stable:
      case Buildable.farm_tile:
      case Buildable.pasture:
      case Buildable.field:
        if (coords[2] !== 0) return false;
        const farmTile = t as FarmTileType;
        switch (task.d!.toBuild) {
          case Buildable.fence:
            if (farmTile === undefined) return false;
            if (farmTile.isFence || !farmTile.isPasture) return false;
            if (execute) {
              farmTile.isFence = true;
            }
            return true;
          case Buildable.double_fence:
            // TODO double_fence
            break;
          case Buildable.stable:
            if (farmTile === undefined) {
              if (execute) {
                p.farm![coords[0]][coords[1]] = { isStable: true };
              }
              return true;
            }
            if (farmTile.isStable) return false;
            if (execute) {
              farmTile.isStable = true;
            }
            return true;
          case Buildable.farm_tile:
            // TODO farm_tile
            break;
          case Buildable.pasture:
            if (farmTile === undefined) {
              if (execute) {
                p.farm![coords[0]][coords[1]] = { isPasture: true };
              }
              return true;
            }
            if (farmTile.isPasture !== undefined) return false;
            if (execute) {
              farmTile.isPasture = true;
            }
            return true;
          case Buildable.field:
            if (farmTile !== undefined) return false;
            if (execute) {
              p.farm![coords[0]][coords[1]] = { isPasture: false };
            }
            return true;
        }
    }
    if (coords[2] !== 1) return false;
    const caveTile = t as CaveTileType;
    switch (task.d!.toBuild) {
      case Buildable.cavern_tunnel:
        // TODO cavern_tunnel
        break;
      case Buildable.double_cavern:
        // TODO double_cavern
        break;
      case Buildable.tunnel:
        if (caveTile !== undefined) return false;
        if (execute) {
          p.cave[coords[0]][coords[1]] = { isCavern: false };
        }
        return true;
      case Buildable.cavern:
        if (caveTile !== undefined) return false;
        if (execute) {
          p.cave[coords[0]][coords[1]] = { isCavern: true };
        }
        return true;
      case Buildable.ore_mine:
        // TODO ore_mine
        break;
      case Buildable.ruby_mine:
        if (caveTile?.isCavern !== false || caveTile.isOreMine !== undefined)
          return false;
        if (execute) {
          caveTile.isOreMine = false;
        }
        return true;
    }
    return false;
  }

  buildHere(
    p: PlayerType,
    coords: [number, number, number],
    execute: boolean
  ): boolean {
    if (execute) {
      p.farm = {};
      const g = [p.farm, p.cave][coords[2]];
      if (g[coords[1]] === undefined) {
        g[coords[1]] = {};
      }
    }
    const task = this.getTask();
    return (
      this._buildHereBeforePaying(task, p, coords, execute) &&
      execute &&
      this.addResourcesToPlayer(p, this.getBuildCost(task, p) || {}) &&
      this.addResourcesToPlayer(
        p,
        {
          "0.2.0": { boars: 1 },
          "2.0.0": { boars: 1 },
          "3.1.0": { food: 1 },
          "0.2.1": { food: 1 },
          "3.1.1": { food: 1 },
        }[coords.join(".")] || {}
      )
    );
  }

  doResource(
    p: PlayerType,
    selected: [number, number, number] | undefined,
    resourceName: keyof ResourcesType,
    execute: boolean
  ): boolean {
    const task = this.getTask();
    const t = this.getGrid(p).find(({ i, j, k }) =>
      this.objEqual([i, j, k], selected)
    )?.t;
    switch (resourceName) {
      case "food":
      case "rubies":
        return false;
      case "gold":
        // TODO eat gold
        return false;
      case "grain":
      case "vegetables":
        if (execute) {
          if (
            this.isMyTurn() &&
            task.t === Task.sow &&
            task.d!.canSow![resourceName] &&
            t !== undefined &&
            t.resources === undefined &&
            (t as FarmTileType).isPasture === false
          ) {
            t.resources = { [resourceName]: resourceName === "grain" ? 3 : 2 };
            task.d!.canSow![resourceName]!--;
            this.prepareNextTask(`planted ${resourceName}`);
          } else {
            this.addResourcesToPlayer(p, {
              food: resourceName === "vegetables" ? 2 : 1,
              [resourceName]: -1,
            });
            store.update(`ate ${resourceName}`);
          }
        }
        return true;
      case "dogs":
      case "sheep":
      case "donkeys":
      case "boars":
      case "cows":
        if (t === undefined) return false;
        var allowed = false;
        const cavern = (t as CaveTileType).tile;
        if (cavern !== undefined) {
          const c = Caverns[cavern];
          if (
            c.animalRoom !== undefined &&
            c.animalRoom(
              this.addResources(t.resources || {}, { [resourceName]: 1 })!,
              p
            )
          ) {
            allowed = true;
          }
        } else {
          const farmTile = t as FarmTileType;
          if (farmTile.isPasture) {
            if (farmTile.isFence) {
              if (
                Object.keys(t.resources || {}).filter(
                  (r) => !["dogs", resourceName].includes(r)
                ).length === 0 &&
                ((t.resources || {})[resourceName] || 0) <=
                  (farmTile.isStable ? 3 : 1)
              ) {
                allowed = true;
              }
              // TODO double_fence stable allowed animal
            } else if (farmTile.isStable && t.resources === undefined) {
              allowed = true;
            }
          } else if (
            p.boughtTiles[Cavern.stubble_room] &&
            t.resources === undefined &&
            farmTile.isPasture === false
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
              allowed = (t.resources?.dogs || -1) >= (t.resources?.sheep || 0);
              break;
            case "donkeys":
              allowed =
                t.resources === undefined &&
                (t as CaveTileType).isOreMine !== undefined;
              break;
            case "boars":
              allowed =
                t.resources === undefined &&
                (t as FarmTileType).isStable === true;
              break;
            case "cows":
              break;
          }
        }
        if (!allowed) return false;
        if (execute) {
          if (!t.resources) t.resources = {};
          t.resources[resourceName] = 1 + (t.resources[resourceName] || 0);
          this.addResourcesToPlayer(p, { [resourceName]: -1 });
          store.update(`moved ${resourceName}`);
        }
        return true;
      case "stone":
      case "wood":
      case "ore":
        if (
          p.boughtTiles[Cavern.working_cave] &&
          task.t === Task.feed &&
          task.d?.num === undefined
        ) {
          if (execute) {
            this.workingCave(p, resourceName);
          }
          return true;
        }
        return false;
    }
  }
}

const utils = new Utils();

export default utils;

export { store };

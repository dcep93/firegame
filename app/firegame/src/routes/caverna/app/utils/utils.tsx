import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import ExpeditionActions, { ExpeditionAction } from "./ExpeditionActions";

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
import Tiles, { Tile, TileCategory } from "./Tiles";

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
        ((p.boughtTiles || {})[Tile.writing_chamber] ? 7 : 0) +
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
          .map((t) => parseInt(t) as Tile)
          .map((t) => Tiles[t])
          .filter((t) => t.category !== TileCategory.yellow)
          .map((tile) => tile.points!)
          .sum() +
        2 *
          this.getGrid(p)
            .map(({ t }) => ((t as FarmTileType).isFence ? 2 : 0))
            .sum() +
        this.getGrid(p)
          .map(({ t }) =>
            (t as CaveTileType).isRubyMine
              ? 4
              : (t as CaveTileType).isMine
              ? 3
              : 0
          )
          .sum(),
      parlorsStoragesChambers: Object.keys(p.boughtTiles || {})
        .map((t) => parseInt(t) as Tile)
        .map((t) => Tiles[t])
        .filter((t) => t.category === TileCategory.yellow)
        .map((tile) =>
          tile.points !== undefined ? tile.points : tile.pointsF!(p)
        )
        .sum(),
      goldBegging: (p.resources || {}).gold || 0 - 3 * (p.begging || 0),
    };
  }

  addResourcesToPlayer(p: PlayerType, r: ResourcesType): PlayerType {
    p.resources = this.addResources(p.resources || {}, r);
    if ((r.dogs || 0) > 0 && p.boughtTiles[Tile.dog_school])
      this.addResourcesToPlayer(p, { wood: r.dogs! });
    if (
      (r.stone || 0) > 0 &&
      p.boughtTiles[Tile.seam] &&
      Object.values(r).filter((v) => v < 0).length === 0
    )
      this.addResourcesToPlayer(p, { ore: r.stone! });
    return p;
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

  convert(p: PlayerType, conversion: ResourcesType) {
    const newResources = this.addResources(conversion, p.resources || {});
    if (newResources === undefined) return;
    p.resources = newResources;
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
        num: this.getGrid(p).map(
          ({ t }) =>
            t.resources?.donkeys !== undefined &&
            (t as CaveTileType).isMine &&
            !(t as CaveTileType).isRubyMine
        ).length,
      }))
      .filter(({ p, num }) => num > 0 && p.boughtTiles[Tile.miner])
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
      weaponLevel: p.usedDwarves![0],
    };
    const bonus = (store.gameW.game.actionBonuses || {})[a];
    if (bonus !== undefined) {
      utils.addResourcesToPlayer(p, bonus);
      delete store.gameW.game.actionBonuses![a];
    }
    const at = Actions[a];
    if (at.action !== undefined) {
      at.action(p);
    }
    this.prepareNextTask(`action: ${Action[a]}`);
  }

  canFurnish(
    t: Tile,
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
        p.cave[selected[0]][selected[1]].isMine ||
        (!p.cave[selected[0]][selected[1]].isCavern &&
          p.boughtTiles[Tile.work_room] === undefined)
      ) {
        return false;
      }
    }
    if (this.addResources(p.resources || {}, Tiles[t].cost) === undefined)
      return false;
    const task = this.getTask().t;
    if (task === Task.furnish_dwelling) {
      return Tiles[t].category === TileCategory.dwelling;
    }
    return task === Task.furnish_cavern;
  }

  furnish(t: Tile, p: PlayerType, selected: [number, number, number]) {
    this.shiftTask();
    if (store.gameW.game.purchasedTiles === undefined)
      store.gameW.game.purchasedTiles = {};
    store.gameW.game.purchasedTiles[t] = p.index;
    this.addResourcesToPlayer(p, Tiles[t].cost);
    p.boughtTiles[t] = true;
    p.cave[selected[0]]![selected[1]] = { tile: t };
    this.prepareNextTask(`furnished ${Tile[t]}`);
  }

  canRubyTrade(a: RubyAction, p: PlayerType): boolean {
    return (
      this.addResources(
        p.resources || {},
        RubyActions[a].cost || { rubies: -1 }
      ) !== undefined
    );
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
        (!p.boughtTiles[Tile.slaughtering_cave]
          ? 0
          : -Object.values(toSlaughter).sum()),
    });
    this.addResourcesToPlayer(p, toSlaughter);
  }

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
        (!p.boughtTiles[Tile.mining_cave]
          ? 0
          : this.getGrid(p).filter(
              ({ t }) =>
                t.resources?.donkeys !== undefined && (t as CaveTileType).isMine
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
      if (p.boughtTiles[Tile.additional_dwelling] === undefined) return false;
    }
    const numDwellingSpaces = Object.keys(p.boughtTiles)
      .map((t) => parseInt(t) as Tile)
      .filter((t) => Tiles[t].category === TileCategory.dwelling)
      .map((t) =>
        [Tile.couple_dwelling, Tile.starting_dwelling].includes(t) ? 2 : 1
      )
      .sum();
    return numDwellingSpaces > numDwarves;
  }

  queueTasks(ts: TaskType[]) {
    store.gameW.game.tasks.splice(0, 0, ...ts);
  }

  shiftTask() {
    store.gameW.game.tasks.shift();
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
      return (p.resources?.ore || 0) > 0 && p.usedDwarves![0] === 0;
    }
    if (task.t === Task.expedition) {
      return utils.getCurrent().usedDwarves![0] !== 0;
    }
    if (task.t === Task.build) {
      switch (task.d!.toBuild) {
        case Buildable.fence:
          return false;
      }
    }
    return true;
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
      ({ t }) => (t as CaveTileType).tile === Tile.state_parlor
    )!;
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map(([i, j]) => (p.cave[coords.i + i] || {})[coords.j + j]?.tile)
      .filter(
        (t) => t !== undefined && Tiles[t]?.category === TileCategory.dwelling
      ).length;
  }

  forge(p: PlayerType, level: number) {
    this.shiftTask();
    p.usedDwarves![0] = level;
    this.addResourcesToPlayer(p, { ore: -level });
    this.prepareNextTask(`forged ${level}`);
  }
}

const utils = new Utils();

export default utils;

export { store };

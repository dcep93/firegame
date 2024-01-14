import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import { ExpeditionAction } from "./ExpeditionActions";

import {
  AnimalResourcesType,
  CaveTileType,
  FarmTileType,
  GameType,
  PlayerType,
  ResourcesType,
  Task,
} from "./NewGame";
import { RubyAction } from "./RubyActions";
import Tiles, { Tile, TileCategory } from "./Tiles";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  getScoreDict(p: PlayerType): { [k: string]: number } {
    const allResources = [p.cave, p.farm]
      .flatMap((grid) =>
        Object.values(grid || {})
          .flatMap((r) => Object.values(r))
          .flatMap(
            (tile) => (tile as CaveTileType | FarmTileType).resources || {}
          )
      )
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
        Object.values(p.farm || {})
          .flatMap((r) => Object.values(r))
          .map((t) => (t.isFence ? 2 : 0))
          .sum() +
        Object.values(p.cave || {})
          .flatMap((r) => Object.values(r))
          .map((t) => (t.isOreMine ? 3 : t.isRubyMine ? 4 : 0))
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

  canAction(a: Action): boolean {
    if (!utils.isMyTurn()) return false;
    const task = store.gameW.game.tasks[0].t;
    const playerIndex = (store.gameW.game.takenActions || {})[a]?.playerIndex;
    if (task === Task.action) {
      return playerIndex === undefined;
    }
    if (task === Task.imitate) {
      return playerIndex !== undefined && playerIndex !== utils.myIndex();
    }
    return false;
  }

  canBuy(t: Tile, p: PlayerType): boolean {
    if (!utils.isMyTurn()) return false;
    if (this.addResources(p.resources || {}, Tiles[t].cost) === undefined)
      return false;
    const task = store.gameW.game.tasks[0].t;
    if (task === Task.furnishDwelling) {
      return Tiles[t].category === TileCategory.dwelling;
    }
    return task === Task.furnishCavern;
  }

  canRubyTrade(a: RubyAction): boolean {
    return false;
  }

  canExpedition(a: ExpeditionAction): boolean {
    return false;
  }

  payRubyOutOfOrder(p: PlayerType, index: number) {}

  canPayRubyOutOfOrder(p: PlayerType, index: number): boolean {
    return (
      index > 0 &&
      p.availableDwarves![index] > 0 &&
      ((p.resources || {}).rubies || 0) >= 1
    );
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
      food: Object.entries(toSlaughter)
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
        .sum(),
    });
    this.addResourcesToPlayer(p, toSlaughter);
  }
}

const utils = new Utils();

export default utils;

export { store };

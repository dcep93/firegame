import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import { ExpeditionAction } from "./ExpeditionActions";

import {
  CaveTileType,
  FarmTileType,
  GameType,
  PlayerType,
  ResourcesType,
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
        (prev, curr) => utils.addResources(prev, curr),
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

  addResources(addTo: ResourcesType, addFrom: ResourcesType): ResourcesType {
    Object.entries(addFrom)
      .map(([k, v]) => ({ k, v } as { k: keyof ResourcesType; v: number }))
      .forEach(({ k, v }) => {
        addTo[k] = v + (addTo[k] || 0);
        if (addTo[k] === 0) {
          delete addTo[k];
        }
      });
    return addTo;
  }

  convert(p: PlayerType, conversion: ResourcesType) {
    const newResources = this.addResources(conversion, p.resources || {});
    if (Object.values(newResources).filter((c) => c < 0).length > 0) {
      return;
    }
    p.resources = newResources;
  }

  enrichAndReveal(g: GameType): GameType {
    g.year++;
    g.actions.push(
      utils
        .shuffle(g.upcomingActions!)
        .sort((a, b) => Actions[a].availability[0] - Actions[b].availability[0])
        .pop()!
    );
    if (g.actionBonuses === undefined) {
      g.actionBonuses = {};
    }
    g.players.forEach(
      (p) =>
        (p.availableDwarves = p
          .usedDwarves!.splice(0)
          .map((d) => Math.max(d, 0))
          .sort())
    );
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
    return true;
  }

  canBuy(t: Tile): boolean {
    return true;
  }

  canRubyTrade(a: RubyAction): boolean {
    return true;
  }

  canExpedition(a: ExpeditionAction): boolean {
    return true;
  }

  payRubyOutOfOrder(p: PlayerType, index: number) {}

  canPayRubyOutOfOrder(p: PlayerType, index: number): boolean {
    return (
      index > 0 &&
      p.availableDwarves![index] > 0 &&
      ((p.resources || {}).rubies || 0) >= 1
    );
  }

  canSlaughter(p: PlayerType): boolean {
    return true;
  }

  slaughter(p: PlayerType) {}
}

const utils = new Utils();

export default utils;

export { store };

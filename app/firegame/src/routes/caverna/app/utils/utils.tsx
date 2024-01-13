import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import Actions, { Action } from "./Actions";
import { ExpeditionAction } from "./ExpeditionActions";

import { GameType, PlayerType, ResourcesType } from "./NewGame";
import { RubyAction } from "./RubyActions";
import { Tile } from "./Tiles";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  addResourcesToPlayer(p: PlayerType, r: ResourcesType): PlayerType {
    p.resources = this.addResources(p.resources || {}, r);
    return p;
  }

  addResources(addTo: ResourcesType, addFrom: ResourcesType): ResourcesType {
    Object.entries(addFrom)
      .map(([k, v]) => ({ k, v } as { k: keyof ResourcesType; v: number }))
      .forEach(({ k, v }) => (addTo[k] = v + (addTo[k] || 0)));
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
    g.actions.push(
      utils
        .shuffle(g.upcomingActions!)
        .sort((a, b) => Actions[a].availability[0] - Actions[b].availability[0])
        .pop()!
    );
    if (g.actionBonuses === undefined) {
      g.actionBonuses = {};
    }
    g.players.forEach((p) => (p.availableDwarves = p.usedDwarves!.splice(0)));
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

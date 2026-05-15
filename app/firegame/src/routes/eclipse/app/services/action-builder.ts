/**
 * Helpers to construct GameAction objects from UI interaction steps.
 */

import type {
  GameAction,
  ExploreActivation,
  UpgradeActivation,
  BuildActivation,
  MoveActivation,
  InfluenceActivation,
  ColonyShipUsage,
} from '@eclipse/shared';

export type { GameAction };

export function buildExploreAction(activations: ExploreActivation[]): GameAction {
  return { type: 'EXPLORE', activations };
}

export function buildResearchAction(techId: string): GameAction {
  return { type: 'RESEARCH', activations: [{ techId }] };
}

export function buildUpgradeAction(activations: UpgradeActivation[]): GameAction {
  return { type: 'UPGRADE', activations };
}

export function buildBuildAction(activations: BuildActivation[]): GameAction {
  return { type: 'BUILD', activations };
}

export function buildMoveAction(activations: MoveActivation[]): GameAction {
  return { type: 'MOVE', activations };
}

export function buildInfluenceAction(
  activations: InfluenceActivation[],
  colonyShipFlips: number = 0,
): GameAction {
  return { type: 'INFLUENCE', activations, colonyShipFlips };
}

export function buildPassAction(): GameAction {
  return { type: 'PASS' };
}

export function buildTradeAction(fromResource: string, toResource: string, amount: number): GameAction {
  return { type: 'TRADE', fromResource, toResource, amount } as GameAction;
}

export function buildColonyShipAction(usages: ColonyShipUsage[]): GameAction {
  return { type: 'COLONY_SHIP', usages } as GameAction;
}

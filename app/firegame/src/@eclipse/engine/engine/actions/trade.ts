import { PhaseType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import type { GameState, TradeAction, PlayerId } from '../types';
import { adjustResources } from '../state/state-helpers';

export function validateTrade(
  state: GameState,
  playerId: PlayerId,
  action: TradeAction,
): string | null {
  if (state.phase !== PhaseType.Action && state.phase !== PhaseType.Upkeep) {
    return 'Can only trade during Action or Upkeep phase.';
  }
  const player = state.players[playerId];
  if (!player) {
    return 'Player not found.';
  }
  if (action.amount <= 0) {
    return 'Trade amount must be positive.';
  }
  if (player.resources[action.fromResource] < action.amount) {
    return `Not enough ${action.fromResource}. Have ${player.resources[action.fromResource]}, need ${action.amount}.`;
  }
  if (action.fromResource === action.toResource) {
    return 'Cannot trade a resource for itself.';
  }
  return null;
}

export function executeTrade(
  state: GameState,
  playerId: PlayerId,
  action: TradeAction,
): GameState {
  const player = state.players[playerId]!;
  const species = SPECIES[player.speciesId]!;
  const gained = Math.floor(action.amount / species.tradeRate);

  const result = adjustResources(state, playerId, {
    [action.fromResource]: -action.amount,
    [action.toResource]: gained,
  });

  return result;
}

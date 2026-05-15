import { PhaseType } from '@data/enums';
import { PASS_BONUS_MONEY } from '@data/constants';
import type { GameState, PassAction, PlayerId } from '../types';
import { updatePlayer } from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';

export function validatePass(
  state: GameState,
  playerId: PlayerId,
  _action: PassAction,
): string | null {
  if (state.phase !== PhaseType.Action) {
    return 'Can only pass during the Action phase.';
  }
  const player = state.players[playerId];
  if (!player) {
    return 'Player not found.';
  }
  // Already-passed players can pass again (skip their reaction window)
  const currentPlayer = state.turnOrder[state.currentPlayerIndex];
  if (currentPlayer !== playerId) {
    return 'Not this player\'s turn.';
  }
  return null;
}

export function executePass(
  state: GameState,
  playerId: PlayerId,
  _action: PassAction,
): GameState {
  const player = state.players[playerId]!;

  // Already-passed player: just skip their reaction window (advance turn)
  if (player.hasPassed) {
    let result = state;
    result = advanceToNextPlayer(result);
    return result;
  }

  // First-time pass
  const isFirst = state.passOrder.length === 0;

  // Mark player as passed
  let result = updatePlayer(state, playerId, { hasPassed: true });

  // Add to pass order
  result = { ...result, passOrder: [...result.passOrder, playerId] };

  // First to pass: +2 money and becomes start player for next round
  if (isFirst) {
    const p = result.players[playerId]!;
    result = updatePlayer(result, playerId, {
      resources: {
        ...p.resources,
        money: p.resources.money + PASS_BONUS_MONEY,
      },
    });
    result = { ...result, startPlayer: playerId };
  }

  // Log event
  const event = createEvent('PLAYER_PASSED', { playerId, isFirst });
  result = { ...result, eventLog: appendEvent(result.eventLog, event) };

  // Check if all non-eliminated players have passed → end Action Phase
  const allPassed = result.turnOrder.every(
    (pid) => result.players[pid]!.hasPassed || result.players[pid]!.eliminated,
  );
  if (allPassed) {
    result = { ...result, actionPhaseComplete: true };
  }

  // Advance to next player (includes passed players for reaction windows)
  result = advanceToNextPlayer(result);

  return result;
}

function advanceToNextPlayer(state: GameState): GameState {
  if (state.actionPhaseComplete) return state;

  const { turnOrder } = state;
  let idx = (state.currentPlayerIndex + 1) % turnOrder.length;

  // Include passed players in turn order — they get reaction windows.
  // Only skip eliminated players.
  for (let i = 0; i < turnOrder.length; i++) {
    const pid = turnOrder[idx]!;
    const p = state.players[pid]!;
    if (!p.eliminated) {
      return { ...state, currentPlayerIndex: idx };
    }
    idx = (idx + 1) % turnOrder.length;
  }

  return state;
}

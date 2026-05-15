import type { GameState, GameEvent } from './types';
import { createGame } from './state/create-game';
import { executeAction } from './dispatch';

/**
 * Replay a game from its event log.
 * The first event must be GAME_CREATED.
 * ACTION_TAKEN events are re-executed through the dispatcher.
 */
export function replayGame(events: readonly GameEvent[]): GameState {
  if (events.length === 0 || events[0]!.type !== 'GAME_CREATED') {
    throw new Error('Event log must start with GAME_CREATED');
  }

  let state = createGame(events[0].config);

  for (let i = 1; i < events.length; i++) {
    const event = events[i]!;
    if (event.type === 'ACTION_TAKEN') {
      state = executeAction(state, event.playerId, event.action);
    }
  }

  return state;
}

/**
 * Replay a game up to a specific turn number.
 * Stops processing ACTION_TAKEN events once the target turn is reached.
 */
export function replayToTurn(
  events: readonly GameEvent[],
  targetTurn: number,
): GameState {
  if (events.length === 0 || events[0]!.type !== 'GAME_CREATED') {
    throw new Error('Event log must start with GAME_CREATED');
  }

  let state = createGame(events[0].config);

  for (let i = 1; i < events.length; i++) {
    if (state.turnNumber >= targetTurn) break;
    const event = events[i]!;
    if (event.type === 'ACTION_TAKEN') {
      state = executeAction(state, event.playerId, event.action);
    }
  }

  return state;
}

/**
 * Extract the event log from a game state.
 */
export function getEventLog(state: GameState): readonly GameEvent[] {
  return state.eventLog;
}

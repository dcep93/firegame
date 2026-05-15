import type { GameEvent } from '../types';

/** Append an event to the log (immutable — returns new array) */
export function appendEvent(
  log: readonly GameEvent[],
  event: GameEvent,
): readonly GameEvent[] {
  return [...log, event];
}

/** Type-safe event factory */
export function createEvent<T extends GameEvent['type']>(
  type: T,
  data: Omit<Extract<GameEvent, { type: T }>, 'type'>,
): Extract<GameEvent, { type: T }> {
  return { type, ...data } as Extract<GameEvent, { type: T }>;
}

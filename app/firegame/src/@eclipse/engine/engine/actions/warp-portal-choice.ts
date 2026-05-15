import type {
  GameState,
  PlayerId,
  WarpPortalChoiceAction,
} from '../types';
import { updateSector } from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';

export function validateWarpPortalChoice(
  state: GameState,
  playerId: PlayerId,
  action: WarpPortalChoiceAction,
): string | null {
  if (state.subPhase?.type !== 'WARP_PORTAL_CHOICE') {
    return 'No WARP_PORTAL_CHOICE sub-phase active';
  }

  if (state.subPhase.playerId !== playerId) {
    return 'Not your warp portal choice';
  }

  if (!state.subPhase.eligibleSectors.includes(action.sectorKey)) {
    return `Sector ${action.sectorKey} is not eligible for warp portal placement`;
  }

  return null;
}

export function executeWarpPortalChoice(
  state: GameState,
  _playerId: PlayerId,
  action: WarpPortalChoiceAction,
): GameState {
  let result = updateSector(state, action.sectorKey, { hasWarpPortal: true });

  const evt = createEvent('INSTANT_EFFECT', {
    playerId: state.subPhase!.type === 'WARP_PORTAL_CHOICE' ? state.subPhase.playerId : _playerId,
    techId: 'warp_portal',
    effectType: 'instant_warp_portal',
    description: `Placed Warp Portal on chosen sector`,
  });
  result = { ...result, eventLog: appendEvent(result.eventLog, evt) };

  // Clear sub-phase
  result = { ...result, subPhase: null };

  return result;
}

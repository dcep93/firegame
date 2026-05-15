import { ReputationSlotType } from '@data/enums';
import type {
  GameState,
  PlayerId,
  ReputationSelectionAction,
} from '../types';
import {
  selectReputationTile,
} from '../combat/reputation';
import { continueReputationProcessing } from './combat-step';

export function validateReputationSelection(
  state: GameState,
  playerId: PlayerId,
  action: ReputationSelectionAction,
): string | null {
  if (state.subPhase?.type !== 'REPUTATION_SELECTION') {
    return 'No reputation selection pending.';
  }
  if (state.subPhase.playerId !== playerId) {
    return 'Not your reputation selection turn.';
  }

  const drawn = state.subPhase.drawn;
  const player = state.players[playerId]!;
  const track = player.reputationTrack;

  if (action.keptIndex === null) {
    // Declining all — targetSlotIndex must be null
    if (action.targetSlotIndex !== null) {
      return 'Cannot specify target slot when declining all tiles.';
    }
    return null;
  }

  // Validate keptIndex
  if (action.keptIndex < 0 || action.keptIndex >= drawn.length) {
    return 'Invalid drawn tile index.';
  }

  // Validate targetSlotIndex
  if (action.targetSlotIndex === null) {
    return 'Must specify a target slot when keeping a tile.';
  }
  if (action.targetSlotIndex < 0 || action.targetSlotIndex >= track.length) {
    return 'Invalid target slot index.';
  }

  const targetSlot = track[action.targetSlotIndex]!;
  // Cannot place reputation tile in ambassador-only slot
  if (targetSlot.slotType === ReputationSlotType.Ambassador) {
    return 'Cannot place reputation tile in ambassador-only slot.';
  }
  // Cannot swap out an ambassador tile
  if (targetSlot.tile !== null && targetSlot.tile.fromAmbassador) {
    return 'Cannot replace an ambassador tile with a reputation tile.';
  }

  return null;
}

export function executeReputationSelection(
  state: GameState,
  playerId: PlayerId,
  action: ReputationSelectionAction,
): GameState {
  const drawn = (state.subPhase as { drawn: readonly number[] }).drawn;

  // Place tile or decline
  let result = selectReputationTile(
    state,
    playerId,
    drawn,
    action.keptIndex,
    action.targetSlotIndex,
  );

  // Clear sub-phase
  result = { ...result, subPhase: { type: 'COMBAT_STEP' } };

  // Continue processing remaining reputation participants
  return continueReputationProcessing(result);
}

import { PhaseType } from '@data/enums';
import type {
  GameState,
  PlayerId,
  InfluenceSectorChoiceAction,
} from '../types';
import {
  canInfluenceSector,
  influenceSector,
} from '../combat/post-battle';
import {
  collectEligibleInfluences,
  finishPostBattleCleanup,
  endCombatPhase,
} from '../phases/combat-phase';

export function validateInfluenceSectorChoice(
  state: GameState,
  playerId: PlayerId,
  action: InfluenceSectorChoiceAction,
): string | null {
  if (state.subPhase?.type !== 'INFLUENCE_SECTOR_CHOICE') {
    return 'No INFLUENCE_SECTOR_CHOICE sub-phase active';
  }

  if (state.subPhase.playerId !== playerId) {
    return 'Not your influence sector choice';
  }

  const eligible = new Set(state.subPhase.eligibleSectors);

  // All chosen sectors must be in the eligible set
  for (const key of action.sectorKeys) {
    if (!eligible.has(key)) {
      return `Sector ${key} is not eligible for influence`;
    }
  }

  // No duplicates
  if (new Set(action.sectorKeys).size !== action.sectorKeys.length) {
    return 'Duplicate sector keys';
  }

  // Verify each chosen sector is still influenceable
  for (const key of action.sectorKeys) {
    if (!canInfluenceSector(state, key, playerId)) {
      return `Cannot influence sector ${key}`;
    }
  }

  return null;
}

export function executeInfluenceSectorChoice(
  state: GameState,
  playerId: PlayerId,
  action: InfluenceSectorChoiceAction,
): GameState {
  let result = state;

  // Apply chosen influences
  for (const sectorKey of action.sectorKeys) {
    result = influenceSector(result, sectorKey, playerId);
  }

  // Track which players have been offered the choice (to prevent re-offering on decline)
  const prevOffered = state.subPhase?.type === 'INFLUENCE_SECTOR_CHOICE'
    ? state.subPhase.offeredPlayerIds : [];
  const newOffered = [...prevOffered, playerId];

  // Clear the sub-phase
  result = { ...result, subPhase: null };

  // Check for more players with eligible sectors (skipping already-offered players)
  const nextChoice = collectEligibleInfluences(result, newOffered);
  if (nextChoice) {
    return {
      ...result,
      subPhase: {
        type: 'INFLUENCE_SECTOR_CHOICE',
        playerId: nextChoice.playerId,
        eligibleSectors: nextChoice.sectorKeys,
        offeredPlayerIds: newOffered,
      },
    };
  }

  // All influence choices resolved — finish post-battle cleanup
  result = finishPostBattleCleanup(result);

  // If a sub-phase was set (discovery decision or colony ship placement), halt
  if (result.subPhase) {
    return result;
  }

  // Otherwise end combat phase
  if (result.phase === PhaseType.Combat) {
    return endCombatPhase(result);
  }

  return result;
}

import { PhaseType } from '@data/enums';
import type { ResourceType } from '@data/enums';
import type {
  GameState,
  PlayerId,
  PopulationGraveyardChoiceAction,
} from '../types';
import {
  sendBoardCubeToGraveyard,
  updateSector,
} from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';
import { advanceToNextBattleOrComplete } from './combat-step';
import { postBattleCleanup, endCombatPhase } from '../phases/combat-phase';

export function validatePopulationGraveyardChoice(
  state: GameState,
  playerId: PlayerId,
  action: PopulationGraveyardChoiceAction,
): string | null {
  if (!state.subPhase || state.subPhase.type !== 'POPULATION_GRAVEYARD_CHOICE') {
    return 'No population graveyard choice pending.';
  }
  if (state.subPhase.playerId !== playerId) {
    return 'Not your population graveyard choice.';
  }

  const { choices } = state.subPhase;

  if (action.assignments.length !== choices.length) {
    return `Must provide exactly ${choices.length} assignments, got ${action.assignments.length}.`;
  }

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i]!;
    const assignment = action.assignments[i]!;
    if (!choice.validTracks.includes(assignment)) {
      return `Assignment ${i} (${assignment}) is not a valid track for ${choice.source} cube. Valid: ${choice.validTracks.join(', ')}.`;
    }
  }

  return null;
}

export function executePopulationGraveyardChoice(
  state: GameState,
  _playerId: PlayerId,
  action: PopulationGraveyardChoiceAction,
): GameState {
  const subPhase = state.subPhase!;
  if (subPhase.type !== 'POPULATION_GRAVEYARD_CHOICE') {
    throw new Error('No population graveyard choice subPhase active');
  }

  const { sectorKey, playerId: defenderId, attackerId, choices } = subPhase;
  const sector = state.board.sectors[sectorKey]!;

  let result = state;

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i]!;
    const track = action.assignments[i]! as ResourceType;

    // Move cube to the defender's chosen graveyard
    result = sendBoardCubeToGraveyard(result, defenderId, track);

    // Log POPULATION_DESTROYED event
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('POPULATION_DESTROYED', {
          sector: sector.position,
          track,
          destroyedBy: attackerId,
        }),
      ),
    };

    // For orbital, clear orbitalPopulation from sector
    if (choice.source === 'orbital') {
      const currentSector = result.board.sectors[sectorKey]!;
      result = updateSector(result, sectorKey, {
        structures: { ...currentSector.structures, orbitalPopulation: null },
      });
    }
  }

  // Clear subPhase
  result = { ...result, subPhase: null };

  // Continue flow based on battle vs non-battle context
  if (subPhase.isNonBattle) {
    const skipSectors = [...(subPhase.skipSectors ?? [])];
    const afterCleanup = postBattleCleanup(result, skipSectors);
    if (afterCleanup.subPhase) return afterCleanup;
    if (afterCleanup.phase === PhaseType.Combat) return endCombatPhase(afterCleanup);
    return afterCleanup;
  }

  // Battle flow: advance to next battle or complete
  result = advanceToNextBattleOrComplete(result);

  // Restore COMBAT_STEP so the phase driver doesn't reset combatState
  if (result.combatState && !result.subPhase) {
    result = { ...result, subPhase: { type: 'COMBAT_STEP' } };
  }

  return result;
}

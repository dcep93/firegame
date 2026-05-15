import { PhaseType, PopulationSquareType, ResourceType } from '@data/enums';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  PlayerId,
  BombardmentChoiceAction,
} from '../types';
import {
  sendBoardCubeToGraveyard,
  updateSector,
} from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';
import { advanceToNextBattleOrComplete } from './combat-step';
import { postBattleCleanup, endCombatPhase } from '../phases/combat-phase';

export function validateBombardmentChoice(
  state: GameState,
  playerId: PlayerId,
  action: BombardmentChoiceAction,
): string | null {
  if (!state.subPhase || state.subPhase.type !== 'BOMBARDMENT_CHOICE') {
    return 'No bombardment choice pending.';
  }
  if (state.subPhase.playerId !== playerId) {
    return 'Not your bombardment choice.';
  }

  const { sectorKey, totalDamage, hasOrbitalPop } = state.subPhase;
  const sector = state.board.sectors[sectorKey];
  if (!sector) return 'Invalid sector.';

  // Validate destroyOrbital flag
  if (action.destroyOrbital && !hasOrbitalPop) {
    return 'No orbital population to destroy.';
  }

  const orbitalCount = hasOrbitalPop ? 1 : 0;
  const totalTargets = sector.populations.length + orbitalCount;
  const expectedCount = Math.min(totalDamage, totalTargets);
  const actualCount = action.cubesToDestroy.length + (action.destroyOrbital ? 1 : 0);

  if (actualCount !== expectedCount) {
    return `Must destroy exactly ${expectedCount} targets, got ${actualCount}.`;
  }

  // Build a count map of available populations by track
  const availableByTrack = new Map<ResourceType, number>();
  for (const pop of sector.populations) {
    availableByTrack.set(
      pop.sourceTrack,
      (availableByTrack.get(pop.sourceTrack) ?? 0) + 1,
    );
  }

  // Validate each chosen track against available populations
  const chosenByTrack = new Map<ResourceType, number>();
  for (const track of action.cubesToDestroy) {
    chosenByTrack.set(track, (chosenByTrack.get(track) ?? 0) + 1);
  }

  for (const [track, count] of Array.from(chosenByTrack.entries())) {
    const available = availableByTrack.get(track) ?? 0;
    if (count > available) {
      return `Cannot destroy ${count} ${track} cubes, only ${available} available.`;
    }
  }

  return null;
}

export function executeBombardmentChoice(
  state: GameState,
  playerId: PlayerId,
  action: BombardmentChoiceAction,
): GameState {
  const subPhase = state.subPhase!;
  if (subPhase.type !== 'BOMBARDMENT_CHOICE') {
    throw new Error('No bombardment choice subPhase active');
  }

  const { sectorKey } = subPhase;
  const sector = state.board.sectors[sectorKey]!;
  const sectorOwner = sector.influenceDisc!;
  const sectorDef = SECTORS_BY_ID[sector.sectorId];

  let result = state;

  // Separate destroyed cubes into auto (non-wild) and deferred (wild) lists
  const deferredChoices: { source: 'orbital' | 'wild'; validTracks: readonly ResourceType[] }[] = [];
  const remainingPops = [...sector.populations];

  for (const track of action.cubesToDestroy) {
    // Find matching population and check if it's on a wild slot
    const idx = remainingPops.findIndex(p => p.sourceTrack === track);
    if (idx === -1) continue;

    const pop = remainingPops[idx]!;
    const squareDef = sectorDef?.populationSquares[pop.slotIndex];
    const isWild = squareDef?.type === PopulationSquareType.Wild;

    // Remove from sector populations
    remainingPops.splice(idx, 1);

    if (isWild) {
      // Wild cube: defer graveyard choice to defender
      // Don't send to graveyard yet — just remove from sector
      deferredChoices.push({
        source: 'wild',
        validTracks: [ResourceType.Materials, ResourceType.Science, ResourceType.Money],
      });
    } else {
      // Non-wild cube: auto-send to graveyard using sourceTrack
      result = sendBoardCubeToGraveyard(result, sectorOwner, track);
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('POPULATION_DESTROYED', {
            sector: sector.position,
            track,
            destroyedBy: playerId,
          }),
        ),
      };
    }
  }

  // Update sector populations
  if (action.cubesToDestroy.length > 0) {
    result = updateSector(result, sectorKey, { populations: remainingPops });
  }

  // Orbital: defer to defender for graveyard choice
  if (action.destroyOrbital) {
    deferredChoices.push({
      source: 'orbital',
      validTracks: [ResourceType.Science, ResourceType.Money],
    });
  }

  // If any deferred choices, create POPULATION_GRAVEYARD_CHOICE sub-phase
  if (deferredChoices.length > 0) {
    return {
      ...result,
      subPhase: {
        type: 'POPULATION_GRAVEYARD_CHOICE',
        playerId: sectorOwner,
        sectorKey,
        attackerId: playerId,
        choices: deferredChoices,
        isNonBattle: subPhase.isNonBattle,
        skipSectors: subPhase.skipSectors,
      },
    };
  }

  // Clear subPhase
  result = { ...result, subPhase: null };

  // Non-battle flow: re-enter postBattleCleanup to process remaining sectors
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

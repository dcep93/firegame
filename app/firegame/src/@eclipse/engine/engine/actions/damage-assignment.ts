import { DICE_DAMAGE } from '@data/constants';
import { PhaseType } from '@data/enums';
import type { DieColor } from '@data/enums';
import type {
  GameState,
  PlayerId,
  DamageAssignmentAction,
} from '../types';
import { applyDamage } from '../combat/damage';
import type { DamageAssignment } from '../combat/damage';
import type { RollResult } from '../combat/hit-determination';
import { continueAfterDamage } from './combat-step';

export function validateDamageAssignmentAction(
  state: GameState,
  playerId: PlayerId,
  action: DamageAssignmentAction,
): string | null {
  if (state.phase !== PhaseType.Combat) return 'Not in combat phase.';
  if (state.subPhase?.type !== 'DAMAGE_ASSIGNMENT') return 'Not in damage assignment phase.';
  if (state.subPhase.playerId !== playerId) return 'Not your damage assignment.';

  const subPhase = state.subPhase;
  const totalHits = subPhase.hits.length;

  // Collect all assigned hit indices
  const assignedIndices = new Set<number>();
  for (const assignment of action.assignments) {
    for (const idx of assignment.hitIndices) {
      if (idx < 0 || idx >= totalHits) {
        return `Hit index ${idx} is out of range (0-${totalHits - 1}).`;
      }
      if (assignedIndices.has(idx)) {
        return `Hit index ${idx} assigned more than once.`;
      }
      assignedIndices.add(idx);
    }
  }

  // Every hit must be assigned
  if (assignedIndices.size !== totalHits) {
    return `All ${totalHits} hits must be assigned (got ${assignedIndices.size}).`;
  }

  // All target ships must exist in the sub-phase
  const validShipIds = new Set(subPhase.targetShips.map(s => s.shipId));
  for (const assignment of action.assignments) {
    if (!validShipIds.has(assignment.targetShipId)) {
      return `Ship ${assignment.targetShipId} is not a valid target.`;
    }
  }

  return null;
}

export function executeDamageAssignment(
  state: GameState,
  _playerId: PlayerId,
  action: DamageAssignmentAction,
): GameState {
  const subPhase = state.subPhase!;
  if (subPhase.type !== 'DAMAGE_ASSIGNMENT') return state;

  // Reconstruct DamageAssignment[] from player's hit mapping
  const assignments: DamageAssignment[] = [];
  for (const entry of action.assignments) {
    const hits: RollResult[] = entry.hitIndices.map(idx => {
      const hit = subPhase.hits[idx]!;
      return {
        dieColor: hit.dieColor as DieColor,
        faceIndex: hit.faceIndex,
        faceValue: hit.faceValue,
        isBurst: hit.isBurst,
        isMiss: hit.isMiss,
      };
    });
    let totalDamage = 0;
    for (const h of hits) {
      totalDamage += DICE_DAMAGE[h.dieColor];
    }
    assignments.push({
      targetShipId: entry.targetShipId,
      hits,
      totalDamage,
    });
  }

  // Apply damage
  let result = applyDamage(state, subPhase.sectorKey, assignments, subPhase.attackerOwner);

  // Clear sub-phase and continue combat
  result = { ...result, subPhase: { type: 'COMBAT_STEP' } };
  return continueAfterDamage(result, subPhase.isMissile ? 'missile' : 'engagement');
}

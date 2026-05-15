import { PhaseType } from '@data/enums';
import type {
  GameState,
  PlayerId,
  RetreatDecisionAction,
} from '../types';
import { positionToKey } from '../hex/hex-math';
import { initiateRetreatByIds } from '../combat/retreat';
import { getActiveShipsInSector } from '../combat/combat-helpers';

export function validateRetreatDecision(
  state: GameState,
  playerId: PlayerId,
  action: RetreatDecisionAction,
): string | null {
  if (state.phase !== PhaseType.Combat) return 'Not in combat phase.';
  if (state.subPhase?.type !== 'RETREAT_DECISION') return 'Not in retreat decision phase.';
  if (state.subPhase.playerId !== playerId) return 'Not your retreat decision.';

  // Empty retreatingShipIds = continue fighting (always valid)
  if (action.retreatingShipIds.length === 0) return null;

  // Non-empty: validate retreatTarget
  if (!action.retreatTarget) {
    return 'Must specify retreat target when retreating ships.';
  }

  const targetKey = positionToKey(action.retreatTarget);
  const validTargetKeys = state.subPhase.validTargets.map(t => positionToKey(t));
  if (!validTargetKeys.includes(targetKey)) {
    return 'Invalid retreat target sector.';
  }

  // Validate all shipIds belong to player and are in sector and not already retreating
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const sector = state.board.sectors[battle.sectorKey];
  if (!sector) return 'Invalid sector.';

  const playerShipIds = new Set(
    sector.ships
      .filter(s => s.owner === playerId && !s.isRetreating)
      .map(s => s.id),
  );

  for (const shipId of action.retreatingShipIds) {
    if (!playerShipIds.has(shipId)) {
      return `Ship ${shipId} is not a valid retreatable ship.`;
    }
  }

  return null;
}

export function executeRetreatDecision(
  state: GameState,
  playerId: PlayerId,
  action: RetreatDecisionAction,
): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;

  // Restore COMBAT_STEP sub-phase so drivePhases halts (subPhase check)
  // and the next COMBAT_STEP action continues the battle with our combatState intact.
  // Setting subPhase to null would cause drivePhases → processCombatPhase → recreate CombatState.
  let result: GameState = { ...state, subPhase: { type: 'COMBAT_STEP' } };

  // Mark player as having made their decision
  result = {
    ...result,
    combatState: {
      ...result.combatState!,
      retreatDecisionOfferedTo: [...cs.retreatDecisionOfferedTo, playerId],
    },
  };

  // Process retreat if ships were selected
  if (action.retreatingShipIds.length > 0 && action.retreatTarget) {
    result = initiateRetreatByIds(
      result,
      playerId,
      action.retreatingShipIds,
      action.retreatTarget,
      battle.sectorKey,
    );

    // Mark the round in which retreat was declared so ships escape after one more round
    result = {
      ...result,
      combatState: {
        ...result.combatState!,
        retreatDeclaredInRound: result.combatState!.engagementRound,
      },
    };

    // Track if ALL remaining active ships are now retreating (retreat penalty per rules:
    // "If all of your remaining Ships attempt to Retreat, you do not draw a
    // Reputation Tile for participating in the battle")
    const activeAfterRetreat = getActiveShipsInSector(result, battle.sectorKey, playerId);
    if (activeAfterRetreat.length === 0) {
      result = {
        ...result,
        combatState: {
          ...result.combatState!,
          retreatedPlayerIds: [...result.combatState!.retreatedPlayerIds, playerId],
        },
      };
    }
  }

  // COMBAT_STEP sub-phase is restored — the next COMBAT_STEP action will
  // re-enter the !currentUnit branch in executeEngagementFire, which will either:
  // - Offer retreat to the next player (if they haven't decided yet)
  // - Start the next round (if all players have decided)
  return result;
}

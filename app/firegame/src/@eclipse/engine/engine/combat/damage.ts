import { DICE_DAMAGE } from '@data/constants';
import type { NpcType } from '@data/enums';
import type { GameState, PlayerId, ShipOnBoard } from '../types';
import { removeShipFromSector, updateSector } from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';
import {
  getShipCombatStats,
  isNpcOwner,
} from './combat-helpers';
import type { RollResult } from './hit-determination';

export interface DamageAssignment {
  readonly targetShipId: string;
  readonly hits: readonly RollResult[];
  readonly totalDamage: number;
}

export function calculateTotalDamage(hits: readonly RollResult[]): number {
  let total = 0;
  for (const hit of hits) {
    total += DICE_DAMAGE[hit.dieColor];
  }
  return total;
}

export function wouldDestroyShip(
  ship: ShipOnBoard,
  additionalDamage: number,
  hullValue: number,
): boolean {
  return ship.damage + additionalDamage > hullValue;
}

export function validateDamageAssignment(
  assignments: readonly DamageAssignment[],
  availableHits: readonly RollResult[],
  targetShips: readonly ShipOnBoard[],
): string | null {
  // Check that all assigned hits are from availableHits
  const usedHits = new Set<number>();
  for (const assignment of assignments) {
    for (const hit of assignment.hits) {
      // Find a matching unused hit
      const idx = availableHits.findIndex(
        (h, i) =>
          !usedHits.has(i) &&
          h.dieColor === hit.dieColor &&
          h.faceIndex === hit.faceIndex,
      );
      if (idx === -1) return 'Assigned hit not found in available hits';
      usedHits.add(idx);
    }
  }

  // Check targets exist
  const targetIds = new Set(targetShips.map((s) => s.id));
  for (const assignment of assignments) {
    if (!targetIds.has(assignment.targetShipId)) {
      return `Target ship ${assignment.targetShipId} not found`;
    }
  }

  // Check totalDamage matches
  for (const assignment of assignments) {
    const expected = calculateTotalDamage(assignment.hits);
    if (assignment.totalDamage !== expected) {
      return 'Total damage does not match hits';
    }
  }

  return null;
}

export function applyDamage(
  state: GameState,
  sectorKey: string,
  assignments: readonly DamageAssignment[],
  attackerOwner: PlayerId | NpcType,
): GameState {
  let result = state;

  for (const assignment of assignments) {
    const sector = result.board.sectors[sectorKey]!;
    const ship = sector.ships.find((s) => s.id === assignment.targetShipId);
    if (!ship) continue;

    const stats = getShipCombatStats(ship, result);
    const newDamage = ship.damage + assignment.totalDamage;

    // Log damage event
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('DAMAGE_DEALT', {
          targetShipId: ship.id,
          damage: assignment.totalDamage,
          source: isNpcOwner(attackerOwner) ? attackerOwner : `player:${attackerOwner}`,
        }),
      ),
    };

    if (newDamage > stats.hullValue) {
      // Ship destroyed
      result = removeShipFromSector(result, ship.id, sectorKey);

      // Decrement ancients count when NPC ship destroyed
      if (isNpcOwner(ship.owner)) {
        const sectorAfterRemove = result.board.sectors[sectorKey]!;
        if (sectorAfterRemove.ancients > 0) {
          result = updateSector(result, sectorKey, {
            ancients: sectorAfterRemove.ancients - 1,
          });
        }
      }

      // Return to supply if player-owned
      if (!isNpcOwner(ship.owner)) {
        const player = result.players[ship.owner]!;
        result = {
          ...result,
          players: {
            ...result.players,
            [ship.owner]: {
              ...player,
              shipSupply: {
                ...player.shipSupply,
                [ship.type]: player.shipSupply[ship.type] + 1,
              },
            },
          },
        };
      }

      // Log destruction
      const destroyedBy = isNpcOwner(attackerOwner) ? attackerOwner : attackerOwner;
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('SHIP_DESTROYED', {
            shipId: ship.id,
            owner: ship.owner,
            destroyedBy: destroyedBy as PlayerId,
          }),
        ),
      };
    } else {
      // Apply damage to surviving ship
      // Get fresh sector since state may have changed
      const currentSector = result.board.sectors[sectorKey]!;
      result = updateSector(result, sectorKey, {
        ships: currentSector.ships.map((s) =>
          s.id === ship.id ? { ...s, damage: newDamage } : s,
        ),
      });
    }
  }

  return result;
}

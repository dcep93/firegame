import type { NpcType } from '@data/enums';
import type { GameState, PlayerId } from '../types';
import {
  getActiveShipsInSector,
  getShipCombatStats,
} from './combat-helpers';

export function isStalemate(
  state: GameState,
  sectorKey: string,
  attackerId: PlayerId | NpcType,
  defenderId: PlayerId | NpcType,
): boolean {
  const attackerShips = getActiveShipsInSector(state, sectorKey, attackerId);
  const defenderShips = getActiveShipsInSector(state, sectorKey, defenderId);

  if (attackerShips.length === 0 || defenderShips.length === 0) return false;

  // If either side has retreating ships, it's not a stalemate — they're leaving
  const sector = state.board.sectors[sectorKey];
  if (sector?.ships.some(s => s.isRetreating)) return false;

  const attackerHasWeapons = attackerShips.some((ship) => {
    const stats = getShipCombatStats(ship, state);
    return stats.weapons.length > 0;
  });

  const defenderHasWeapons = defenderShips.some((ship) => {
    const stats = getShipCombatStats(ship, state);
    return stats.weapons.length > 0;
  });

  return !attackerHasWeapons && !defenderHasWeapons;
}

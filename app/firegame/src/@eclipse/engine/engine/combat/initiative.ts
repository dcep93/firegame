import type { NpcType, ShipType } from '@data/enums';
import type { GameState, PlayerId, ShipOnBoard } from '../types';
import {
  getActiveShipsInSector,
  getNpcVariant,
  getShipCombatStats,
  isNpcOwner,
} from './combat-helpers';

export interface CombatUnit {
  readonly shipType: ShipType;
  readonly owner: PlayerId | NpcType;
  readonly initiative: number;
  readonly isDefender: boolean;
  readonly ships: readonly ShipOnBoard[];
}

export function getInitiativeForShipType(
  state: GameState,
  owner: PlayerId | NpcType,
  shipType: ShipType,
): number {
  if (isNpcOwner(owner)) {
    const variant = getNpcVariant(owner, state.config);
    return variant.initiative;
  }

  const player = state.players[owner]!;
  return player.blueprints[shipType].computed.initiative;
}

export function calculateInitiativeOrder(
  state: GameState,
  sectorKey: string,
  attackerId: PlayerId | NpcType,
  defenderId: PlayerId | NpcType,
): readonly CombatUnit[] {
  const units: CombatUnit[] = [];

  // Gather units for both sides
  for (const [owner, isDefender] of [
    [attackerId, false],
    [defenderId, true],
  ] as const) {
    const ships = getActiveShipsInSector(state, sectorKey, owner);

    // Group by ship type
    const byType = new Map<ShipType, ShipOnBoard[]>();
    for (const ship of ships) {
      const existing = byType.get(ship.type) ?? [];
      existing.push(ship);
      byType.set(ship.type, existing);
    }

    for (const [shipType, typeShips] of Array.from(byType.entries())) {
      const stats = getShipCombatStats(typeShips[0]!, state);
      units.push({
        shipType,
        owner,
        initiative: stats.initiative,
        isDefender,
        ships: typeShips,
      });
    }
  }

  // Sort: higher initiative first, ties → earlier entry order first
  // (the faction that moved into the sector first fires first)
  units.sort((a, b) => {
    if (b.initiative !== a.initiative) return b.initiative - a.initiative;
    // Tiebreaker: lowest entryOrder (arrived first) fires first
    const aMinEntry = Math.min(...a.ships.map(s => s.entryOrder));
    const bMinEntry = Math.min(...b.ships.map(s => s.entryOrder));
    return aMinEntry - bMinEntry;
  });

  return units;
}

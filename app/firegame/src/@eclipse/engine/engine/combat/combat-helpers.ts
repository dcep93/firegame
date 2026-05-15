import { DICE_DAMAGE } from '@data/constants';
import { NPC_DEFINITIONS } from '@data/definitions/npcs';
import { DieColor, NpcType, ShipType, SpeciesId } from '@data/enums';
import type { NpcBlueprintVariant } from '@data/types/npc';
import type {
  GameConfig,
  GameState,
  PlayerId,
  ShipOnBoard,
  WeaponSummary,
} from '../types';

export interface CombatStats {
  readonly initiative: number;
  readonly hullValue: number;
  readonly shieldValue: number;
  readonly computerValue: number;
  readonly weapons: readonly WeaponSummary[];
  readonly missiles: readonly WeaponSummary[];
}

export function isNpcOwner(owner: PlayerId | NpcType): owner is NpcType {
  return (
    owner === NpcType.Ancient ||
    owner === NpcType.Guardian ||
    owner === NpcType.GCDS
  );
}

export function getNpcVariant(
  npcType: NpcType,
  config: GameConfig,
): NpcBlueprintVariant {
  const def = NPC_DEFINITIONS[npcType];
  let variantIndex: number;
  switch (npcType) {
    case NpcType.Ancient:
      variantIndex = (config.ancientBlueprintVariant ?? 1) - 1;
      break;
    case NpcType.Guardian:
      variantIndex = (config.guardianBlueprintVariant ?? 1) - 1;
      break;
    case NpcType.GCDS:
      variantIndex = (config.gcdsBlueprintVariant ?? 1) - 1;
      break;
  }
  return def.blueprintVariants[variantIndex]!;
}

export function npcVariantToCombatStats(
  variant: NpcBlueprintVariant,
): CombatStats {
  const weapons: WeaponSummary[] = [];
  const missiles: WeaponSummary[] = [];

  for (const w of variant.weapons) {
    const summary: WeaponSummary = {
      dieColor: w.dieColor,
      dieCount: w.dieCount,
      damage: DICE_DAMAGE[w.dieColor],
    };
    if (w.isMissile) {
      missiles.push(summary);
    } else {
      weapons.push(summary);
    }
  }

  return {
    initiative: variant.initiative,
    hullValue: variant.hullPoints,
    shieldValue: variant.shieldBonus,
    computerValue: variant.computerBonus,
    weapons,
    missiles,
  };
}

export function getShipCombatStats(
  ship: ShipOnBoard,
  state: GameState,
): CombatStats {
  if (isNpcOwner(ship.owner)) {
    const variant = getNpcVariant(ship.owner, state.config);
    return npcVariantToCombatStats(variant);
  }

  const player = state.players[ship.owner]!;
  const computed = player.blueprints[ship.type].computed;
  return {
    initiative: computed.initiative,
    hullValue: computed.hullValue,
    shieldValue: computed.shieldValue,
    computerValue: computed.computerValue,
    weapons: computed.weapons,
    missiles: computed.missiles,
  };
}

export function getFactionsInSector(
  state: GameState,
  sectorKey: string,
): readonly (PlayerId | NpcType)[] {
  const sector = state.board.sectors[sectorKey];
  if (!sector) return [];

  const owners = new Set<PlayerId | NpcType>();
  for (const ship of sector.ships) {
    owners.add(ship.owner);
  }
  return Array.from(owners);
}

export function getOwnerShipsInSector(
  state: GameState,
  sectorKey: string,
  owner: PlayerId | NpcType,
): readonly ShipOnBoard[] {
  const sector = state.board.sectors[sectorKey];
  if (!sector) return [];
  return sector.ships.filter((s) => s.owner === owner);
}

export function getActiveShipsInSector(
  state: GameState,
  sectorKey: string,
  owner: PlayerId | NpcType,
): readonly ShipOnBoard[] {
  return getOwnerShipsInSector(state, sectorKey, owner).filter(
    (s) => !s.isRetreating,
  );
}

export function getDieDamage(color: DieColor): number {
  return DICE_DAMAGE[color];
}

export function getShipSizeOrder(shipType: ShipType): number {
  switch (shipType) {
    case ShipType.Interceptor:
    case ShipType.Starbase:
      return 1;
    case ShipType.Cruiser:
      return 2;
    case ShipType.Dreadnought:
      return 3;
  }
}

export function getDestroyedShipRepValue(ship: ShipOnBoard): number {
  if (isNpcOwner(ship.owner)) {
    switch (ship.owner) {
      case NpcType.Ancient:
        return 1;
      case NpcType.Guardian:
        return 2;
      case NpcType.GCDS:
        return 3;
    }
  }
  switch (ship.type) {
    case ShipType.Interceptor:
    case ShipType.Starbase:
      return 1;
    case ShipType.Cruiser:
      return 2;
    case ShipType.Dreadnought:
      return 3;
  }
}

export function isDescendantsOfDraco(
  state: GameState,
  playerId: PlayerId,
): boolean {
  const player = state.players[playerId];
  if (!player) return false;
  return player.speciesId === SpeciesId.DescendantsOfDraco;
}

/**
 * Check if an NPC type is friendly to a player (Draco coexists with Ancients).
 * Returns true only when npcType is Ancient AND the player is Descendants of Draco.
 * Guardians and GCDS are never friendly.
 */
export function isNpcFriendlyToPlayer(
  state: GameState,
  npcType: NpcType,
  playerId: PlayerId,
): boolean {
  return npcType === NpcType.Ancient && isDescendantsOfDraco(state, playerId);
}

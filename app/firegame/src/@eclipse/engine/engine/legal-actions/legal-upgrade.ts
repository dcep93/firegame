import { PhaseType, ShipType } from '@data/enums';
import { SHIP_PARTS_BY_ID } from '@data/definitions/ship-parts';
import type {
  GameState,
  UpgradeAction,
  PlayerId,
} from '../types';
import { isPlayerTurn, playerHasTech } from '../state/state-queries';

const ALL_SHIP_TYPES: readonly ShipType[] = [
  ShipType.Interceptor,
  ShipType.Cruiser,
  ShipType.Dreadnought,
  ShipType.Starbase,
];

/**
 * Enumerate all single-activation upgrade actions available to a player.
 * Returns one UpgradeAction per (shipType, slotIndex, partId) combination that is valid.
 *
 * Uses delta-based validation: instead of recomputing full blueprint stats for
 * every candidate part (~1748 calls), computes the current stats once per ship
 * type from bp.computed, then uses O(1) arithmetic per candidate swap.
 */
export function getLegalUpgradeActions(
  state: GameState,
  playerId: PlayerId,
): readonly UpgradeAction[] {
  // Gate checks
  if (state.phase !== PhaseType.Action) return [];
  const player = state.players[playerId];
  if (!player) return [];
  if (player.eliminated) return [];
  if (player.hasPassed) return [];
  if (!isPlayerTurn(state, playerId)) return [];
  if (player.influenceDiscs.onTrack <= 0) return [];

  const results: UpgradeAction[] = [];

  for (const shipType of ALL_SHIP_TYPES) {
    const bp = player.blueprints[shipType];
    const gridRow = bp.grid[0]!;
    const isStarbase = shipType === ShipType.Starbase;

    // Use pre-computed stats from the blueprint (maintained by the engine)
    const currentEnergy = bp.computed.energyBalance;
    const currentMovement = bp.computed.movement;

    for (let slotIndex = 0; slotIndex < gridRow.length; slotIndex++) {
      const currentPartId = gridRow[slotIndex] ?? null;

      // Skip fixed parts
      if (currentPartId !== null && bp.fixedParts.includes(currentPartId)) {
        continue;
      }

      // Look up current part's deltas once per slot
      const currentPartDef = currentPartId ? SHIP_PARTS_BY_ID[currentPartId] : null;
      const oldEnergyDelta = currentPartDef ? currentPartDef.energyDelta : 0;
      const oldMovementDelta = currentPartDef ? currentPartDef.movementDelta : 0;

      // Try each available part — use delta math instead of full recomputation
      for (const part of Object.values(SHIP_PARTS_BY_ID)) {
        // Skip same as current
        if (part.id === currentPartId) continue;

        // Discovery-only parts can only be used if saved from a discovery tile
        if (part.isDiscoveryOnly && !player.savedShipParts.includes(part.id)) {
          continue;
        }

        // Check tech requirement (saved discovery parts bypass tech reqs)
        if (part.unlockedByTech && !playerHasTech(player, part.unlockedByTech) && !player.savedShipParts.includes(part.id)) {
          continue;
        }

        // No drives on starbases
        if (isStarbase && part.category === 'drive') {
          continue;
        }

        // Delta check: swap old part's contribution for new part's
        const newEnergy = currentEnergy - oldEnergyDelta + part.energyDelta;
        if (newEnergy < 0) continue;

        if (!isStarbase) {
          const newMovement = currentMovement - oldMovementDelta + part.movementDelta;
          if (newMovement <= 0) continue;
        }

        results.push({
          type: 'UPGRADE',
          activations: [{ shipType, slotIndex, partId: part.id }],
        });
      }

      // Try removal (partId = null) if slot has something
      if (currentPartId !== null) {
        // Delta check: remove old part's contribution
        const newEnergy = currentEnergy - oldEnergyDelta;
        if (newEnergy >= 0) {
          const newMovement = currentMovement - oldMovementDelta;
          if (isStarbase || newMovement > 0) {
            results.push({
              type: 'UPGRADE',
              activations: [{ shipType, slotIndex, partId: null }],
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Get all tech-valid parts per (shipType, slotIndex), ignoring energy/movement.
 * Used by the client to build multi-activation combos where intermediate
 * states may be invalid but the final state is valid.
 */
export function getUpgradePartOptions(
  state: GameState,
  playerId: PlayerId,
): ReadonlyMap<ShipType, ReadonlyMap<number, readonly string[]>> {
  const result = new Map<ShipType, Map<number, string[]>>();

  if (state.phase !== PhaseType.Action) return result;
  const player = state.players[playerId];
  if (!player) return result;
  if (player.eliminated) return result;
  if (player.hasPassed) return result;
  if (!isPlayerTurn(state, playerId)) return result;
  if (player.influenceDiscs.onTrack <= 0) return result;

  for (const shipType of ALL_SHIP_TYPES) {
    const bp = player.blueprints[shipType];
    const gridRow = bp.grid[0]!;
    const slotMap = new Map<number, string[]>();

    for (let slotIndex = 0; slotIndex < gridRow.length; slotIndex++) {
      const currentPart = gridRow[slotIndex] ?? null;

      // Skip fixed parts
      if (currentPart !== null && bp.fixedParts.includes(currentPart)) {
        continue;
      }

      const parts: string[] = [];

      for (const part of Object.values(SHIP_PARTS_BY_ID)) {
        if (part.id === currentPart) continue;

        if (part.isDiscoveryOnly && !player.savedShipParts.includes(part.id)) {
          continue;
        }

        if (part.unlockedByTech && !playerHasTech(player, part.unlockedByTech) && !player.savedShipParts.includes(part.id)) {
          continue;
        }

        if (shipType === ShipType.Starbase && part.category === 'drive') {
          continue;
        }

        parts.push(part.id);
      }

      if (parts.length > 0 || currentPart !== null) {
        slotMap.set(slotIndex, parts);
      }
    }

    if (slotMap.size > 0) {
      result.set(shipType, slotMap);
    }
  }

  return result;
}

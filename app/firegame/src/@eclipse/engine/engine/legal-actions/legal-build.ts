import { PhaseType, ShipType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import type {
  GameState,
  BuildAction,
  PlayerId,
} from '../types';
import {
  isPlayerTurn,
  playerHasTech,
  getControlledSectors,
} from '../state/state-queries';

const BUILDABLE_SHIP_TYPES: readonly ShipType[] = [
  ShipType.Interceptor,
  ShipType.Cruiser,
  ShipType.Dreadnought,
  ShipType.Starbase,
];

/**
 * Enumerate all single-activation build actions available to a player.
 * Returns one BuildAction per (buildType, sectorPosition) combination.
 */
export function getLegalBuildActions(
  state: GameState,
  playerId: PlayerId,
): readonly BuildAction[] {
  // Gate checks
  if (state.phase !== PhaseType.Action) return [];
  const player = state.players[playerId];
  if (!player) return [];
  if (player.eliminated) return [];
  if (player.hasPassed) return [];
  if (!isPlayerTurn(state, playerId)) return [];
  if (player.influenceDiscs.onTrack <= 0) return [];

  const species = SPECIES[player.speciesId]!;
  const controlledSectors = getControlledSectors(state, playerId);
  if (controlledSectors.length === 0) return [];

  const results: BuildAction[] = [];

  for (const sector of controlledSectors) {
    const sectorPosition = sector.position;

    // Ships
    for (const shipType of BUILDABLE_SHIP_TYPES) {
      if (shipType === ShipType.Starbase && !playerHasTech(player, 'starbase_tech')) {
        continue;
      }
      if (player.shipSupply[shipType] <= 0) continue;
      const cost = species.buildingCosts[shipType];
      if (player.resources.materials < cost) continue;

      results.push({
        type: 'BUILD',
        activations: [{ buildType: shipType, sectorPosition }],
      });
    }

    // Orbital
    if (
      playerHasTech(player, 'orbital_tech') &&
      !sector.structures.hasOrbital &&
      player.resources.materials >= species.buildingCosts.orbital
    ) {
      results.push({
        type: 'BUILD',
        activations: [{ buildType: 'ORBITAL', sectorPosition }],
      });
    }

    // Monolith
    if (
      playerHasTech(player, 'monolith_tech') &&
      !sector.structures.hasMonolith &&
      player.resources.materials >= species.buildingCosts.monolith
    ) {
      results.push({
        type: 'BUILD',
        activations: [{ buildType: 'MONOLITH', sectorPosition }],
      });
    }
  }

  return results;
}

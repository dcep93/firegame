import { DiscoveryType, ShipType } from '@data/enums';
import { DISCOVERY_TILES_BY_ID } from '@data/definitions/discovery-tiles';
import { TECHS_BY_ID } from '@data/definitions/techs';
import { SHIP_PARTS_BY_ID } from '@data/definitions/ship-parts';
import { SPECIES } from '@data/definitions/species';
import { DEFAULT_BLUEPRINTS } from '@data/definitions/default-blueprints';
import type { GameState, PlayerId, DiscoveryDecisionAction } from '../types';
import { playerHasTech } from '../state/state-queries';
import { computeBlueprintStats } from '../state/blueprint-helpers';

/**
 * Compute valid discovery decision options for the current subPhase.
 */
export function getLegalDiscoveryDecisions(
  state: GameState,
  playerId: PlayerId,
): readonly DiscoveryDecisionAction[] {
  const subPhase = state.subPhase;
  if (!subPhase || subPhase.type !== 'DISCOVERY_DECISION') return [];
  if (subPhase.playerId !== playerId) return [];

  const tileDef = DISCOVERY_TILES_BY_ID.get(subPhase.tileId);
  if (!tileDef) return [];

  const results: DiscoveryDecisionAction[] = [];

  // KEEP_VP is always available
  results.push({ type: 'DISCOVERY_DECISION', decision: 'KEEP_VP' });

  const sectorKey = subPhase.sectorKey;

  switch (tileDef.type) {
    case DiscoveryType.ResourceBonus: {
      results.push({ type: 'DISCOVERY_DECISION', decision: 'USE_REWARD' });
      break;
    }

    case DiscoveryType.AncientTech: {
      // Per rules: take the lowest-cost non-rare tech you don't already have.
      // If tied, player chooses among those.
      const player = state.players[playerId]!;
      let lowestCost = Infinity;
      const candidates: string[] = [];

      for (const category of ['military', 'grid', 'nano'] as const) {
        for (const slot of state.techTray[category]) {
          if (slot.count <= 0) continue;
          const tech = TECHS_BY_ID[slot.techId];
          if (!tech || tech.isRare) continue;
          if (playerHasTech(player, slot.techId)) continue;
          if (tech.minCost < lowestCost) {
            lowestCost = tech.minCost;
            candidates.length = 0;
            candidates.push(slot.techId);
          } else if (tech.minCost === lowestCost) {
            candidates.push(slot.techId);
          }
        }
      }

      for (const techId of candidates) {
        results.push({
          type: 'DISCOVERY_DECISION',
          decision: 'USE_REWARD',
          techId,
        });
      }
      break;
    }

    case DiscoveryType.AncientCruiser: {
      const player = state.players[playerId]!;
      if (player.shipSupply[ShipType.Cruiser] > 0) {
        results.push({ type: 'DISCOVERY_DECISION', decision: 'USE_REWARD' });
      }
      break;
    }

    case DiscoveryType.AncientOrbital: {
      const sector = state.board.sectors[sectorKey]!;
      if (!sector.structures.hasOrbital) {
        results.push({ type: 'DISCOVERY_DECISION', decision: 'USE_REWARD' });
      }
      break;
    }

    case DiscoveryType.AncientMonolith: {
      const sector = state.board.sectors[sectorKey]!;
      if (!sector.structures.hasMonolith) {
        results.push({ type: 'DISCOVERY_DECISION', decision: 'USE_REWARD' });
      }
      break;
    }

    case DiscoveryType.AncientShipPart: {
      const shipPartId = tileDef.shipPartId;
      if (!shipPartId) break;
      const part = SHIP_PARTS_BY_ID[shipPartId];
      if (!part) break;

      const player = state.players[playerId]!;
      const species = SPECIES[player.speciesId]!;

      // Option 1: save for later
      results.push({
        type: 'DISCOVERY_DECISION',
        decision: 'USE_REWARD',
        saveForLater: true,
      });

      if (shipPartId === 'muon_source') {
        // Muon Source: goes outside grid as fixedPart — only need shipType
        for (const shipType of [ShipType.Interceptor, ShipType.Cruiser, ShipType.Dreadnought, ShipType.Starbase]) {
          const bp = player.blueprints[shipType];
          if (!bp) continue;
          // Check ship doesn't already have muon_source in fixedParts
          if (bp.fixedParts.includes('muon_source')) continue;
          results.push({
            type: 'DISCOVERY_DECISION',
            decision: 'USE_REWARD',
            targetShipType: shipType,
          });
        }
      } else {
        // Non-muon parts: install on a specific grid slot
        for (const shipType of [ShipType.Interceptor, ShipType.Cruiser, ShipType.Dreadnought, ShipType.Starbase]) {
          const bp = player.blueprints[shipType];
          if (!bp) continue;
          const gridRow = bp.grid[0]!;
          const overrides = species.blueprintOverrides[shipType];
          const baseDef = DEFAULT_BLUEPRINTS[shipType];

          // No drives on starbases
          if (shipType === ShipType.Starbase && part.category === 'drive') continue;

          for (let i = 0; i < gridRow.length; i++) {
            const currentPart = gridRow[i] ?? null;
            if (currentPart !== null && bp.fixedParts.includes(currentPart)) continue;
            if (currentPart === shipPartId) continue; // already has this part in slot

            // Simulate swap and check constraints
            const simRow = [...gridRow];
            simRow[i] = shipPartId;
            const stats = computeBlueprintStats(
              [simRow],
              bp.fixedParts,
              baseDef,
              overrides,
              SHIP_PARTS_BY_ID,
            );
            if (stats.energyBalance < 0) continue;
            if (shipType !== ShipType.Starbase && stats.movement <= 0) continue;

            results.push({
              type: 'DISCOVERY_DECISION',
              decision: 'USE_REWARD',
              targetShipType: shipType,
              slotIndex: i,
            });
          }
        }
      }
      break;
    }

    case DiscoveryType.AncientWarpPortal: {
      results.push({ type: 'DISCOVERY_DECISION', decision: 'USE_REWARD' });
      break;
    }
  }

  return results;
}

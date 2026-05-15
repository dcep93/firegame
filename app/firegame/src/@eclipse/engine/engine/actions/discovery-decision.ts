import { DiscoveryType, PhaseType, ResourceType, ShipType } from '@data/enums';
import { DISCOVERY_TILES_BY_ID } from '@data/definitions/discovery-tiles';
import { SHIP_PARTS_BY_ID } from '@data/definitions/ship-parts';
import { SPECIES } from '@data/definitions/species';
import { DEFAULT_BLUEPRINTS } from '@data/definitions/default-blueprints';
import { TECHS_BY_ID } from '@data/definitions/techs';
import type {
  GameState,
  PlayerId,
  DiscoveryDecisionAction,
  ShipOnBoard,
} from '../types';
import { playerHasTech, getControlledSectors } from '../state/state-queries';
import {
  adjustResources,
  updatePlayer,
  updateSector,
  addShipToSector,
  addTechToPlayer,
  removeTechFromTray,
  updateBlueprint,
} from '../state/state-helpers';
import { computeBlueprintStats } from '../state/blueprint-helpers';
import { claimDiscovery } from '../combat/post-battle';
import { checkPostCombatColonyShips, endCombatPhase } from '../phases/combat-phase';
import { advanceToNextBattleOrComplete } from './combat-step';
import { appendEvent, createEvent } from '../utils/events';
import { isNpcOwner } from '../combat/combat-helpers';

export function validateDiscoveryDecision(
  state: GameState,
  playerId: PlayerId,
  action: DiscoveryDecisionAction,
): string | null {
  if (!state.subPhase || state.subPhase.type !== 'DISCOVERY_DECISION') {
    return 'No discovery decision pending.';
  }
  if (state.subPhase.playerId !== playerId) {
    return 'Not your discovery decision.';
  }

  if (action.decision !== 'USE_REWARD' && action.decision !== 'KEEP_VP') {
    return 'Invalid decision. Must be USE_REWARD or KEEP_VP.';
  }

  if (action.decision === 'KEEP_VP') {
    return null;
  }

  // USE_REWARD — validate based on tile type
  const tileId = state.subPhase.tileId;
  const tileDef = DISCOVERY_TILES_BY_ID.get(tileId);
  if (!tileDef) {
    return `Unknown discovery tile: ${tileId}`;
  }

  const sectorKey = state.subPhase.sectorKey;
  const fromTech = state.subPhase.fromTech === true;

  switch (tileDef.type) {
    case DiscoveryType.ResourceBonus:
      return null; // No extra fields needed

    case DiscoveryType.AncientTech: {
      if (!action.techId) {
        return 'Must specify techId for Ancient Technology reward.';
      }
      const tech = TECHS_BY_ID[action.techId];
      if (!tech) return `Unknown tech: ${action.techId}`;
      if (tech.isRare) return 'Cannot take a rare tech with Ancient Technology.';
      // Check tech is available in tray
      const category = tech.category as 'military' | 'grid' | 'nano';
      const slot = state.techTray[category].find(s => s.techId === action.techId);
      if (!slot || slot.count <= 0) {
        return `Tech ${action.techId} is not available in the tray.`;
      }
      // Player must not already have this tech
      const player = state.players[playerId]!;
      if (playerHasTech(player, action.techId)) {
        return `You already have tech ${action.techId}.`;
      }
      // Must be one of the lowest-cost available techs
      let lowestCost = Infinity;
      for (const cat of ['military', 'grid', 'nano'] as const) {
        for (const s of state.techTray[cat]) {
          if (s.count <= 0) continue;
          const t = TECHS_BY_ID[s.techId];
          if (!t || t.isRare) continue;
          if (playerHasTech(player, s.techId)) continue;
          if (t.minCost < lowestCost) lowestCost = t.minCost;
        }
      }
      if (tech.minCost > lowestCost) {
        return 'Must choose a tech with the lowest available cost.';
      }
      return null;
    }

    case DiscoveryType.AncientCruiser: {
      const player = state.players[playerId]!;
      if (player.shipSupply[ShipType.Cruiser] <= 0) {
        return 'No cruisers available in supply.';
      }
      // fromTech: need at least one controlled sector to place cruiser
      if (fromTech) {
        const controlled = getControlledSectors(state, playerId);
        if (controlled.length === 0) return 'No controlled sector to place cruiser.';
      }
      return null;
    }

    case DiscoveryType.AncientOrbital: {
      if (fromTech) {
        // Auto-pick: need at least one controlled sector without an orbital
        const controlled = getControlledSectors(state, playerId);
        if (!controlled.some(s => !s.structures.hasOrbital)) {
          return 'No controlled sector without an orbital.';
        }
        return null;
      }
      const sector = state.board.sectors[sectorKey]!;
      if (sector.structures.hasOrbital) {
        return 'Sector already has an orbital.';
      }
      return null;
    }

    case DiscoveryType.AncientMonolith: {
      if (fromTech) {
        const controlled = getControlledSectors(state, playerId);
        if (!controlled.some(s => !s.structures.hasMonolith)) {
          return 'No controlled sector without a monolith.';
        }
        return null;
      }
      const sector = state.board.sectors[sectorKey]!;
      if (sector.structures.hasMonolith) {
        return 'Sector already has a monolith.';
      }
      return null;
    }

    case DiscoveryType.AncientShipPart: {
      const shipPartId = tileDef.shipPartId;
      if (!shipPartId) return 'Tile missing shipPartId.';
      const part = SHIP_PARTS_BY_ID[shipPartId];
      if (!part) return `Unknown ship part: ${shipPartId}`;

      // Save for later — always valid
      if (action.saveForLater === true) {
        return null;
      }

      // Install — require targetShipType
      if (action.targetShipType == null) {
        return 'Must specify targetShipType for Ancient Ship Part.';
      }

      const player = state.players[playerId]!;
      const bp = player.blueprints[action.targetShipType];
      if (!bp) return `Invalid ship type: ${action.targetShipType}`;

      if (shipPartId === 'muon_source') {
        // Muon Source: goes outside grid as permanent fixedPart — no slotIndex needed
        if (bp.fixedParts.includes('muon_source')) {
          return `${action.targetShipType} already has Muon Source installed.`;
        }
        return null;
      }

      // Non-muon parts: require slotIndex for grid install
      if (action.slotIndex == null) {
        return 'Must specify slotIndex for Ancient Ship Part.';
      }

      // No drives on starbases
      if (action.targetShipType === ShipType.Starbase && part.category === 'drive') {
        return 'Cannot place drives on starbases.';
      }

      const gridRow = bp.grid[0]!;
      if (action.slotIndex < 0 || action.slotIndex >= gridRow.length) {
        return `Invalid slot index ${action.slotIndex}.`;
      }
      const currentPart = gridRow[action.slotIndex] ?? null;
      if (currentPart !== null && bp.fixedParts.includes(currentPart)) {
        return `Cannot replace fixed part '${currentPart}'.`;
      }

      // Simulate swap and check energy balance + movement
      const simRow = [...gridRow];
      simRow[action.slotIndex] = shipPartId;
      const species = SPECIES[player.speciesId]!;
      const overrides = species.blueprintOverrides[action.targetShipType];
      const baseDef = DEFAULT_BLUEPRINTS[action.targetShipType];
      const stats = computeBlueprintStats(
        [simRow],
        bp.fixedParts,
        baseDef,
        overrides,
        SHIP_PARTS_BY_ID,
      );
      if (stats.energyBalance < 0) {
        return `Energy balance would be ${stats.energyBalance} (must be >= 0).`;
      }
      if (action.targetShipType !== ShipType.Starbase && stats.movement <= 0) {
        return 'Ship must retain at least 1 movement.';
      }
      return null;
    }

    case DiscoveryType.AncientWarpPortal:
      return null;

    default:
      return `Unknown discovery type: ${tileDef.type}`;
  }
}

export function executeDiscoveryDecision(
  state: GameState,
  playerId: PlayerId,
  action: DiscoveryDecisionAction,
): GameState {
  const subPhase = state.subPhase!;
  if (subPhase.type !== 'DISCOVERY_DECISION') {
    throw new Error('No discovery decision subPhase active');
  }

  const { tileId, sectorKey, exploreSectorKeys, fromTech } = subPhase;
  let result = state;

  if (fromTech) {
    // Tech-triggered discovery: tile already drawn from deck, no sector to clear
    if (action.decision === 'KEEP_VP') {
      const player = result.players[playerId]!;
      result = updatePlayer(result, playerId, {
        discoveryTilesKeptForVP: [...player.discoveryTilesKeptForVP, tileId],
      });
    }
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('DISCOVERY_CLAIMED', {
          playerId,
          tileId,
          decision: action.decision,
        }),
      ),
    };
    if (action.decision === 'USE_REWARD') {
      result = applyDiscoveryReward(result, playerId, sectorKey, tileId, action);
    }
    result = { ...result, subPhase: null };
  } else {
    // Normal sector-based discovery
    result = claimDiscovery(result, sectorKey, playerId, action.decision);

    if (action.decision === 'USE_REWARD') {
      result = applyDiscoveryReward(result, playerId, sectorKey, tileId, action);
    }

    if (result.combatState) {
      // Per-battle discovery: clear subPhase, resume combat advancement
      result = { ...result, subPhase: null };
      result = advanceToNextBattleOrComplete(result);
      // Restore COMBAT_STEP so the phase driver doesn't call processCombatPhase
      // (which would create a brand new combatState, losing the battle list)
      if (result.combatState && !result.subPhase) {
        result = { ...result, subPhase: { type: 'COMBAT_STEP' } };
      }
      return result;
    }

    // Post-battle discovery: check for more pending discovery decisions
    const extraKeys = exploreSectorKeys ? new Set(exploreSectorKeys) : undefined;
    const next = findNextDiscoveryDecision(result, playerId, extraKeys);
    if (next) {
      result = {
        ...result,
        subPhase: {
          type: 'DISCOVERY_DECISION',
          playerId,
          tileId: next.tileId,
          sectorKey: next.sectorKey,
          exploreSectorKeys,
        },
      };
    } else {
      result = { ...result, subPhase: null };
      // If we were in combat phase (post-battle discovery), check colony ships then end combat
      if (result.phase === PhaseType.Combat) {
        result = checkPostCombatColonyShips(result);
        if (!result.subPhase) {
          result = endCombatPhase(result);
        }
      }
    }
  }

  return result;
}

function resolveSectorKey(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
): string {
  if (sectorKey) return sectorKey;
  // fromTech: auto-pick first controlled sector
  const controlled = getControlledSectors(state, playerId);
  if (controlled.length === 0) return '';
  // Find sector key from board
  for (const [key, sector] of Object.entries(state.board.sectors)) {
    if (sector.influenceDisc === playerId) return key;
  }
  return '';
}

function applyDiscoveryReward(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
  tileId: string,
  action: DiscoveryDecisionAction,
): GameState {
  const tileDef = DISCOVERY_TILES_BY_ID.get(tileId);
  if (!tileDef) return state;

  let result = state;

  switch (tileDef.type) {
    case DiscoveryType.ResourceBonus: {
      if (tileDef.resourceBonus) {
        const delta: Partial<{ materials: number; science: number; money: number }> = {};
        if (tileDef.resourceBonus[ResourceType.Materials]) {
          delta.materials = tileDef.resourceBonus[ResourceType.Materials];
        }
        if (tileDef.resourceBonus[ResourceType.Science]) {
          delta.science = tileDef.resourceBonus[ResourceType.Science];
        }
        if (tileDef.resourceBonus[ResourceType.Money]) {
          delta.money = tileDef.resourceBonus[ResourceType.Money];
        }
        result = adjustResources(result, playerId, delta);
      }
      break;
    }

    case DiscoveryType.AncientTech: {
      const techId = action.techId!;
      result = removeTechFromTray(result, techId);
      result = addTechToPlayer(result, playerId, techId);
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('TECH_RESEARCHED', { playerId, techId, cost: 0 }),
        ),
      };
      break;
    }

    case DiscoveryType.AncientCruiser: {
      const effectiveSectorKey = resolveSectorKey(result, playerId, sectorKey);
      if (!effectiveSectorKey || !result.board.sectors[effectiveSectorKey]) break;
      const player = result.players[playerId]!;
      // Decrement supply
      result = updatePlayer(result, playerId, {
        shipSupply: {
          ...player.shipSupply,
          [ShipType.Cruiser]: player.shipSupply[ShipType.Cruiser] - 1,
        },
      });
      // Place cruiser in sector
      const shipId = `ship_${playerId}_discovery_${effectiveSectorKey}`;
      const existingShips = result.board.sectors[effectiveSectorKey]!.ships;
      const maxEntry = existingShips.reduce((max, s) => Math.max(max, s.entryOrder), 0);
      const cruiser: ShipOnBoard = {
        id: shipId,
        type: ShipType.Cruiser,
        owner: playerId,
        damage: 0,
        isRetreating: false,
        retreatTarget: null,
        entryOrder: maxEntry + 1,
      };
      result = addShipToSector(result, cruiser, effectiveSectorKey);
      break;
    }

    case DiscoveryType.AncientOrbital: {
      const effectiveSectorKey = resolveSectorKey(result, playerId, sectorKey);
      if (!effectiveSectorKey || !result.board.sectors[effectiveSectorKey]) break;
      // For fromTech, find a sector without an orbital
      let orbitalKey = effectiveSectorKey;
      if (!sectorKey && result.board.sectors[orbitalKey]!.structures.hasOrbital) {
        for (const [key, sector] of Object.entries(result.board.sectors)) {
          if (sector.influenceDisc === playerId && !sector.structures.hasOrbital) {
            orbitalKey = key;
            break;
          }
        }
      }
      result = updateSector(result, orbitalKey, {
        structures: {
          ...result.board.sectors[orbitalKey]!.structures,
          hasOrbital: true,
        },
      });
      result = adjustResources(result, playerId, { materials: 2 });
      break;
    }

    case DiscoveryType.AncientMonolith: {
      const effectiveSectorKey = resolveSectorKey(result, playerId, sectorKey);
      if (!effectiveSectorKey || !result.board.sectors[effectiveSectorKey]) break;
      let monolithKey = effectiveSectorKey;
      if (!sectorKey && result.board.sectors[monolithKey]!.structures.hasMonolith) {
        for (const [key, sector] of Object.entries(result.board.sectors)) {
          if (sector.influenceDisc === playerId && !sector.structures.hasMonolith) {
            monolithKey = key;
            break;
          }
        }
      }
      result = updateSector(result, monolithKey, {
        structures: {
          ...result.board.sectors[monolithKey]!.structures,
          hasMonolith: true,
        },
      });
      break;
    }

    case DiscoveryType.AncientShipPart: {
      const shipPartId = tileDef.shipPartId!;

      if (action.saveForLater) {
        const player = result.players[playerId]!;
        result = updatePlayer(result, playerId, {
          savedShipParts: [...player.savedShipParts, shipPartId],
        });
      } else if (shipPartId === 'muon_source') {
        // Muon Source: add to fixedParts (permanent, outside grid)
        result = installMuonSource(result, playerId, action.targetShipType!);
      } else {
        // Regular ancient part: install on grid slot
        result = installPartOnBlueprint(
          result,
          playerId,
          action.targetShipType!,
          action.slotIndex!,
          shipPartId,
        );
      }
      break;
    }

    case DiscoveryType.AncientWarpPortal: {
      const effectiveSectorKey = resolveSectorKey(result, playerId, sectorKey);
      if (!effectiveSectorKey || !result.board.sectors[effectiveSectorKey]) break;
      result = updateSector(result, effectiveSectorKey, { hasWarpPortal: true });
      break;
    }
  }

  return result;
}

function installMuonSource(
  state: GameState,
  playerId: PlayerId,
  shipType: ShipType,
): GameState {
  const player = state.players[playerId]!;
  const bp = player.blueprints[shipType];
  const newFixedParts = [...bp.fixedParts, 'muon_source'];
  const species = SPECIES[player.speciesId]!;
  const overrides = species.blueprintOverrides[shipType];
  const baseDef = DEFAULT_BLUEPRINTS[shipType];
  const computed = computeBlueprintStats(
    bp.grid,
    newFixedParts,
    baseDef,
    overrides,
    SHIP_PARTS_BY_ID,
  );

  let result = updateBlueprint(state, playerId, shipType, {
    ...bp,
    fixedParts: newFixedParts,
    computed,
  });

  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('BLUEPRINT_UPGRADED', {
        playerId,
        shipType,
        added: 'muon_source',
        removed: [],
      }),
    ),
  };

  return result;
}

function installPartOnBlueprint(
  state: GameState,
  playerId: PlayerId,
  shipType: ShipType,
  slotIndex: number,
  partId: string,
): GameState {
  const player = state.players[playerId]!;
  const bp = player.blueprints[shipType];
  const gridRow = [...bp.grid[0]!];
  const removed = gridRow[slotIndex];
  gridRow[slotIndex] = partId;

  const species = SPECIES[player.speciesId]!;
  const overrides = species.blueprintOverrides[shipType];
  const baseDef = DEFAULT_BLUEPRINTS[shipType];
  const computed = computeBlueprintStats(
    [gridRow],
    bp.fixedParts,
    baseDef,
    overrides,
    SHIP_PARTS_BY_ID,
  );

  let result = updateBlueprint(state, playerId, shipType, {
    ...bp,
    grid: [[...gridRow]],
    computed,
  });

  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('BLUEPRINT_UPGRADED', {
        playerId,
        shipType,
        added: partId,
        removed: removed ? [removed] : [],
      }),
    ),
  };

  return result;
}

/**
 * Find the next sector with an unclaimed discovery tile eligible for this player.
 *
 * A sector is eligible if it has a discovery tile, no ancients, and the player
 * either controls it (influenceDisc), has ships in it, or it appears in the
 * `extraEligibleKeys` set (used by explore to include sectors the player just
 * placed but didn't take influence on).
 */
export function findNextDiscoveryDecision(
  state: GameState,
  playerId: PlayerId,
  extraEligibleKeys?: ReadonlySet<string>,
): { tileId: string; sectorKey: string } | null {
  for (const [sectorKey, sector] of Object.entries(state.board.sectors)) {
    if (!sector.discoveryTile) continue;
    if (sector.ancients > 0) continue;

    // Check eligibility: influence disc, ships, or explicit explore list
    const hasInfluence = sector.influenceDisc === playerId;
    const hasShips = sector.ships.some(
      s => !isNpcOwner(s.owner) && s.owner === playerId,
    );
    const isExploreEligible = extraEligibleKeys?.has(sectorKey) ?? false;

    if (!hasInfluence && !hasShips && !isExploreEligible) continue;

    // No enemy player ships
    const hasEnemyShips = sector.ships.some(
      s => !isNpcOwner(s.owner) && s.owner !== playerId,
    );
    if (hasEnemyShips) continue;

    return { tileId: sector.discoveryTile, sectorKey };
  }
  return null;
}

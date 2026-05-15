import { PhaseType, RingType, NpcType, SpeciesId } from '@data/enums';
import { isDescendantsOfDraco } from '../combat/combat-helpers';
import { SPECIES } from '@data/definitions/species';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  ExploreAction,
  ExploreChoiceAction,
  PlayerId,
  PlacedSector,
  ShipOnBoard,
} from '../types';
import type { HexCoord } from '@data/types/common';
import {
  updatePlayer,
  moveDiscToAction,
  moveDiscToSector,
  placeSector,
} from '../state/state-helpers';
import {
  isPlayerTurn,
  playerHasTech,
} from '../state/state-queries';
import { findNextDiscoveryDecision } from './discovery-decision';
import {
  positionToKey,
  hexRingType,
  hexNeighbors,
} from '../hex/hex-math';
// Wormhole utilities used indirectly via hasWormholeEdgeFacing
import { appendEvent, createEvent } from '../utils/events';
import { nextInt } from '../utils/rng';

export function validateExplore(
  state: GameState,
  playerId: PlayerId,
  action: ExploreAction,
): string | null {
  if (state.phase !== PhaseType.Action) {
    return 'Can only explore during the Action phase.';
  }
  const player = state.players[playerId];
  if (!player) return 'Player not found.';
  if (player.hasPassed) return 'Player has already passed.';
  if (!isPlayerTurn(state, playerId)) return 'Not this player\'s turn.';
  if (player.influenceDiscs.onTrack <= 0) return 'No influence discs available.';

  if (action.activations.length === 0) {
    return 'Must have at least one activation.';
  }

  const species = SPECIES[player.speciesId]!;
  if (action.activations.length > species.activationLimits.explore) {
    return `Too many activations. Max ${species.activationLimits.explore}.`;
  }

  const hasWormholeGen = playerHasTech(player, 'wormhole_generator');

  // Simulate stack state and RNG for validation
  let simStacks = { ...state.sectorStacks };
  let simRng = state.rngState;
  let simDiscoveryDeckSize = state.discoveryDeck.length;
  // Track newly placed sectors for adjacency/connection checking in later activations
  const priorPlacements: PriorPlacement[] = [];

  for (let i = 0; i < action.activations.length; i++) {
    const activation = action.activations[i]!;
    const targetKey = positionToKey(activation.targetPosition);

    // Target position must not already have a sector
    const alreadyPlaced = priorPlacements.some(p => positionToKey(p.position) === targetKey);
    if (state.board.sectors[targetKey] || alreadyPlaced) {
      return `Activation ${i + 1}: Position already has a sector.`;
    }

    // Determine ring for the target position
    const ring = hexRingType(activation.targetPosition);
    if (ring === RingType.GalacticCenter) {
      return `Activation ${i + 1}: Cannot explore the galactic center.`;
    }

    // Check adjacency — must be adjacent to a sector where player has control or ships
    const hasAdjacentConnection = checkExploreAdjacency(
      state,
      playerId,
      activation.targetPosition,
      hasWormholeGen,
      priorPlacements,
    );
    if (!hasAdjacentConnection) {
      return `Activation ${i + 1}: No adjacent controlled sector or sector with ships.`;
    }

    // Check appropriate stack has sectors
    const stackKey = ringToStackKey(ring);
    let stack = [...(simStacks[stackKey] as string[])];

    if (stack.length === 0) {
      return `Activation ${i + 1}: No sectors available to draw.`;
    }

    // Draw the top sector from the pre-shuffled stack
    const drawnSectorId = stack[0]!;
    stack.splice(0, 1);

    if (activation.decision === 'PLACE') {
      // Validate rotation
      if (activation.rotation === undefined || activation.rotation < 0 || activation.rotation > 5) {
        return `Activation ${i + 1}: Invalid rotation (must be 0-5).`;
      }

      // Check that rotation creates valid wormhole connection
      const drawnDef = SECTORS_BY_ID[drawnSectorId];
      if (!drawnDef) {
        return `Activation ${i + 1}: Unknown sector definition '${drawnSectorId}'.`;
      }

      const hasValidConnection = checkPlacementConnection(
        state,
        playerId,
        activation.targetPosition,
        drawnSectorId,
        activation.rotation,
        hasWormholeGen,
        priorPlacements,
      );
      if (!hasValidConnection) {
        return `Activation ${i + 1}: Rotation does not create valid wormhole connection.`;
      }

      priorPlacements.push({
        position: activation.targetPosition,
        sectorId: drawnSectorId,
        rotation: activation.rotation,
        influenceDisc: activation.takeInfluence ? playerId : null,
      });

      // Validate takeInfluence
      if (activation.takeInfluence) {
        if (drawnDef.hasAncient && !isDescendantsOfDraco(state, playerId)) {
          return `Activation ${i + 1}: Cannot take influence on sector with ancients.`;
        }
      }

      // Simulate discovery tile draw to keep RNG in sync with execution
      if (drawnDef.hasDiscovery && simDiscoveryDeckSize > 0) {
        const [, newDiscRng] = nextInt(simRng, 0, simDiscoveryDeckSize - 1);
        simRng = newDiscRng;
        simDiscoveryDeckSize--;
      }
    } else {
      // DISCARD — put back at the bottom of the stack
      stack.push(drawnSectorId);
    }

    // Update simulated stacks
    simStacks = { ...simStacks, [stackKey]: stack };
  }

  return null;
}

/** Sector placed in a prior activation within the same multi-activation explore */
interface PriorPlacement {
  position: HexCoord;
  sectorId: string;
  rotation: number;
  influenceDisc: PlayerId | null;
}

/** Check that the target position is adjacent to a sector where the player has control or ships */
function checkExploreAdjacency(
  state: GameState,
  playerId: PlayerId,
  targetPos: HexCoord,
  hasWormholeGen: boolean,
  priorPlacements: readonly PriorPlacement[] = [],
): boolean {
  const neighbors = hexNeighbors(targetPos);

  for (const neighborPos of neighbors) {
    const neighborKey = positionToKey(neighborPos);

    // Check board sectors
    const neighborSector = state.board.sectors[neighborKey];
    if (neighborSector) {
      const playerControls = neighborSector.influenceDisc === playerId;
      const playerHasShips = neighborSector.ships.some((s) => s.owner === playerId);
      if (playerControls || playerHasShips) {
        const neighborDef = SECTORS_BY_ID[neighborSector.sectorId];
        if (neighborDef && hasWormholeEdgeFacing(neighborSector, neighborDef, targetPos, hasWormholeGen)) {
          return true;
        }
      }
      continue;
    }

    // Check prior placements from earlier activations
    const priorSector = priorPlacements.find(
      p => positionToKey(p.position) === neighborKey,
    );
    if (priorSector && priorSector.influenceDisc === playerId) {
      const priorDef = SECTORS_BY_ID[priorSector.sectorId];
      if (priorDef) {
        const asPseudoSector = { position: priorSector.position, rotation: priorSector.rotation };
        if (hasWormholeEdgeFacing(asPseudoSector as PlacedSector, priorDef, targetPos, hasWormholeGen)) {
          return true;
        }
      }
    }
  }

  return false;
}

/** Check if a placed sector has a wormhole edge facing the given target position */
function hasWormholeEdgeFacing(
  sector: PlacedSector,
  sectorDef: { wormholes: { edges: readonly number[] } },
  targetPos: HexCoord,
  hasWormholeGen: boolean,
): boolean {
  // If wormhole generator, any adjacent position is reachable
  if (hasWormholeGen) return true;

  // Find which edge of the sector faces the target
  const rotatedEdges = sectorDef.wormholes.edges.map(
    (edge: number) => ((edge + sector.rotation) % 6),
  );

  // Find the edge direction from sector to target
  const dq = targetPos.q - sector.position.q;
  const dr = targetPos.r - sector.position.r;

  // Map delta to edge index
  const edgeIndex = deltaToEdge(dq, dr);
  if (edgeIndex === null) return false;

  return rotatedEdges.includes(edgeIndex);
}

/** Map a hex direction delta (dq, dr) to an edge index (0-5) */
function deltaToEdge(dq: number, dr: number): number | null {
  // Edge 0: +1,0  Edge 1: +1,-1  Edge 2: 0,-1  Edge 3: -1,0  Edge 4: -1,+1  Edge 5: 0,+1
  if (dq === 1 && dr === 0) return 0;
  if (dq === 1 && dr === -1) return 1;
  if (dq === 0 && dr === -1) return 2;
  if (dq === -1 && dr === 0) return 3;
  if (dq === -1 && dr === 1) return 4;
  if (dq === 0 && dr === 1) return 5;
  return null;
}

/** Check that placing a sector with given rotation creates valid wormhole connection */
function checkPlacementConnection(
  state: GameState,
  playerId: PlayerId,
  targetPos: HexCoord,
  sectorId: string,
  rotation: number,
  hasWormholeGen: boolean,
  priorPlacements: readonly PriorPlacement[] = [],
): boolean {
  const sectorDef = SECTORS_BY_ID[sectorId];
  if (!sectorDef) return false;

  // Get rotated wormholes of the new sector
  const rotatedEdges = sectorDef.wormholes.edges.map(
    (edge) => ((edge + rotation) % 6),
  );

  const neighbors = hexNeighbors(targetPos);

  for (const neighborPos of neighbors) {
    const neighborKey = positionToKey(neighborPos);

    // Find edge from target to neighbor
    const dq = neighborPos.q - targetPos.q;
    const dr = neighborPos.r - targetPos.r;
    const edgeToNeighbor = deltaToEdge(dq, dr);
    if (edgeToNeighbor === null) continue;
    const edgeFromNeighbor = (edgeToNeighbor + 3) % 6;
    const newHasWormhole = rotatedEdges.includes(edgeToNeighbor);

    // Check board sectors
    const neighborSector = state.board.sectors[neighborKey];
    if (neighborSector) {
      const playerControls = neighborSector.influenceDisc === playerId;
      const playerHasShips = neighborSector.ships.some((s) => s.owner === playerId);
      if (!playerControls && !playerHasShips) continue;

      const neighborDef = SECTORS_BY_ID[neighborSector.sectorId];
      if (!neighborDef) continue;

      const neighborRotatedEdges = neighborDef.wormholes.edges.map(
        (edge) => ((edge + neighborSector.rotation) % 6),
      );
      const neighborHasWormhole = neighborRotatedEdges.includes(edgeFromNeighbor);

      if (hasWormholeGen) {
        if (newHasWormhole || neighborHasWormhole) return true;
      } else {
        if (newHasWormhole && neighborHasWormhole) return true;
      }
      continue;
    }

    // Check prior placements from earlier activations
    const priorSector = priorPlacements.find(
      p => positionToKey(p.position) === neighborKey,
    );
    if (priorSector && priorSector.influenceDisc === playerId) {
      const priorDef = SECTORS_BY_ID[priorSector.sectorId];
      if (!priorDef) continue;

      const priorRotatedEdges = priorDef.wormholes.edges.map(
        (edge) => ((edge + priorSector.rotation) % 6),
      );
      const priorHasWormhole = priorRotatedEdges.includes(edgeFromNeighbor);

      if (hasWormholeGen) {
        if (newHasWormhole || priorHasWormhole) return true;
      } else {
        if (newHasWormhole && priorHasWormhole) return true;
      }
    }
  }

  return false;
}

function ringToStackKey(ring: RingType): 'inner' | 'middle' | 'outer' {
  switch (ring) {
    case RingType.Inner:
      return 'inner';
    case RingType.Middle:
      return 'middle';
    case RingType.Outer:
      return 'outer';
    default:
      return 'outer';
  }
}

/** Check if a player has the Draco double-explore ability */
function hasDracoDoubleExplore(state: GameState, playerId: PlayerId): boolean {
  const player = state.players[playerId]!;
  if (player.speciesId !== SpeciesId.DescendantsOfDraco) return false;
  const species = SPECIES[player.speciesId]!;
  return species.specialAbilities.some(
    (a) => a.effectType === 'explore_draw_extra',
  );
}

export function executeExplore(
  state: GameState,
  playerId: PlayerId,
  action: ExploreAction,
): GameState {
  let result = moveDiscToAction(state, playerId);

  // Increment action counter
  const player = result.players[playerId]!;
  result = updatePlayer(result, playerId, {
    actionsThisRound: {
      ...player.actionsThisRound,
      explore: player.actionsThisRound.explore + 1,
    },
  });

  // Draco double-explore: draw 2 tiles, enter choice sub-phase
  if (hasDracoDoubleExplore(state, playerId) && action.activations.length === 1) {
    const activation = action.activations[0]!;
    const targetPos = activation.targetPosition;
    const ring = hexRingType(targetPos);
    const stackKey = ringToStackKey(ring);
    const stack = [...(result.sectorStacks[stackKey] as string[])];

    if (stack.length >= 2) {
      const tile1 = stack[0]!;
      const tile2 = stack[1]!;
      stack.splice(0, 2);

      result = {
        ...result,
        sectorStacks: { ...result.sectorStacks, [stackKey]: stack },
        subPhase: {
          type: 'EXPLORE_TILE_CHOICE',
          playerId,
          targetPosition: targetPos,
          ring,
          drawnTiles: [tile1, tile2] as readonly [string, string],
        },
      };
      return result;
    }
    // If only 1 tile in stack, fall through to normal single-draw
  }

  // Track sector keys placed by this explore action (for discovery decision trigger)
  const placedSectorKeys: string[] = [];

  for (const activation of action.activations) {
    const targetKey = positionToKey(activation.targetPosition);
    const ring = hexRingType(activation.targetPosition);
    const stackKey = ringToStackKey(ring);

    // Get current stack
    let stack = [...(result.sectorStacks[stackKey] as string[])];

    // Draw the top sector from the pre-shuffled stack
    const drawnSectorId = stack[0]!;
    stack.splice(0, 1);

    if (activation.decision === 'DISCARD') {
      // Put back at the bottom of the stack
      stack.push(drawnSectorId);
    }

    // Update stack
    result = {
      ...result,
      sectorStacks: { ...result.sectorStacks, [stackKey]: stack },
    };

    if (activation.decision === 'DISCARD') {

      // Log event
      const event = createEvent('SECTOR_EXPLORED', {
        playerId,
        sectorId: drawnSectorId,
        position: activation.targetPosition,
        placed: false,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, event) };

      continue;
    }

    // PLACE the sector
    const drawnDef = SECTORS_BY_ID[drawnSectorId]!;

    // Draw discovery tile if applicable
    let discoveryTile: string | null = null;
    if (drawnDef.hasDiscovery && result.discoveryDeck.length > 0) {
      const deck = [...result.discoveryDeck];
      const [discIndex, newRng2] = nextInt(result.rngState, 0, deck.length - 1);
      result = { ...result, rngState: newRng2 };
      discoveryTile = deck[discIndex]!;
      deck.splice(discIndex, 1);
      result = { ...result, discoveryDeck: deck };
    }

    // Create placed sector
    const ancientCount = drawnDef.ancientCount ?? (drawnDef.hasAncient ? 1 : 0);
    const ancientShips: ShipOnBoard[] = [];
    for (let j = 0; j < ancientCount; j++) {
      ancientShips.push({
        id: `ancient_${targetKey}_${j}`,
        type: 'interceptor' as any, // Ancient ships use a generic type
        owner: NpcType.Ancient,
        damage: 0,
        isRetreating: false,
        retreatTarget: null,
        entryOrder: j,
      });
    }

    const newSector: PlacedSector = {
      sectorId: drawnSectorId,
      position: activation.targetPosition,
      rotation: activation.rotation ?? 0,
      influenceDisc: null,
      populations: [],
      ships: ancientShips,
      structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
      discoveryTile,
      ancients: ancientCount,
      hasWarpPortal: false,
    };

    result = placeSector(result, targetKey, newSector);

    // Track placed sectors for discovery trigger (no ancients = eligible)
    if (ancientCount === 0 && discoveryTile) {
      placedSectorKeys.push(targetKey);
    }

    // Take influence if requested and no ancients (Draco can place disc alongside ancients)
    if (activation.takeInfluence && (ancientCount === 0 || isDescendantsOfDraco(state, playerId))) {
      result = moveDiscToSector(result, playerId);
      const placedSector = result.board.sectors[targetKey]!;
      result = {
        ...result,
        board: {
          ...result.board,
          sectors: {
            ...result.board.sectors,
            [targetKey]: { ...placedSector, influenceDisc: playerId },
          },
        },
      };
    }

    // Log event
    const event = createEvent('SECTOR_EXPLORED', {
      playerId,
      sectorId: drawnSectorId,
      position: activation.targetPosition,
      placed: true,
    });
    result = { ...result, eventLog: appendEvent(result.eventLog, event) };
  }

  // Check for discovery decisions on newly explored sectors.
  // Per rules: "take the Discovery Tile from any undiscovered (no Ancient) Sector
  // Explored this Action" — does NOT require placing an influence disc.
  if (placedSectorKeys.length > 0) {
    const eligibleKeys = new Set(placedSectorKeys);
    const discoveryTarget = findNextDiscoveryDecision(result, playerId, eligibleKeys);
    if (discoveryTarget) {
      result = {
        ...result,
        subPhase: {
          type: 'DISCOVERY_DECISION',
          playerId,
          tileId: discoveryTarget.tileId,
          sectorKey: discoveryTarget.sectorKey,
          exploreSectorKeys: placedSectorKeys,
        },
      };
    }
  }

  return result;
}

// ── Explore Tile Choice (Draco) ──

export function validateExploreChoice(
  state: GameState,
  playerId: PlayerId,
  action: ExploreChoiceAction,
): string | null {
  if (state.subPhase?.type !== 'EXPLORE_TILE_CHOICE') {
    return 'No EXPLORE_TILE_CHOICE subPhase active.';
  }
  if (state.subPhase.playerId !== playerId) {
    return 'Not the player who started the explore.';
  }
  if (action.chosenTileIndex !== 0 && action.chosenTileIndex !== 1) {
    return 'chosenTileIndex must be 0 or 1.';
  }

  const chosenTileId = state.subPhase.drawnTiles[action.chosenTileIndex];
  const chosenDef = SECTORS_BY_ID[chosenTileId];
  if (!chosenDef) {
    return `Unknown sector definition '${chosenTileId}'.`;
  }

  if (action.decision === 'PLACE') {
    if (action.rotation === undefined || action.rotation < 0 || action.rotation > 5) {
      return 'Invalid rotation (must be 0-5).';
    }

    const hasWormholeGen = playerHasTech(state.players[playerId]!, 'wormhole_generator');
    const hasValidConnection = checkPlacementConnection(
      state,
      playerId,
      state.subPhase.targetPosition,
      chosenTileId,
      action.rotation,
      hasWormholeGen,
    );
    if (!hasValidConnection) {
      return 'Rotation does not create valid wormhole connection.';
    }

    if (action.takeInfluence && chosenDef.hasAncient && !isDescendantsOfDraco(state, playerId)) {
      return 'Cannot take influence on sector with ancients.';
    }
  }

  return null;
}

export function executeExploreChoice(
  state: GameState,
  playerId: PlayerId,
  action: ExploreChoiceAction,
): GameState {
  const sub = state.subPhase as Extract<typeof state.subPhase, { type: 'EXPLORE_TILE_CHOICE' }>;
  let result = state;

  const chosenTileId = sub.drawnTiles[action.chosenTileIndex];
  const discardedTileId = sub.drawnTiles[action.chosenTileIndex === 0 ? 1 : 0];
  const targetPos = sub.targetPosition;
  const targetKey = positionToKey(targetPos);

  // Put the discarded tile back at the bottom of the stack
  const stackKey = ringToStackKey(sub.ring);
  const stack = [...(result.sectorStacks[stackKey] as string[]), discardedTileId];
  result = {
    ...result,
    sectorStacks: { ...result.sectorStacks, [stackKey]: stack },
  };

  // Clear the sub-phase
  result = { ...result, subPhase: null };

  if (action.decision === 'DISCARD') {
    // Put the chosen tile also back at the bottom of the stack
    const stack2 = [...(result.sectorStacks[stackKey] as string[]), chosenTileId];
    result = {
      ...result,
      sectorStacks: { ...result.sectorStacks, [stackKey]: stack2 },
    };

    const event = createEvent('SECTOR_EXPLORED', {
      playerId,
      sectorId: chosenTileId,
      position: targetPos,
      placed: false,
    });
    result = { ...result, eventLog: appendEvent(result.eventLog, event) };

    return result;
  }

  // PLACE the chosen tile
  const chosenDef = SECTORS_BY_ID[chosenTileId]!;

  // Draw discovery tile if applicable
  let discoveryTile: string | null = null;
  if (chosenDef.hasDiscovery && result.discoveryDeck.length > 0) {
    const deck = [...result.discoveryDeck];
    const [discIndex, newRng] = nextInt(result.rngState, 0, deck.length - 1);
    result = { ...result, rngState: newRng };
    discoveryTile = deck[discIndex]!;
    deck.splice(discIndex, 1);
    result = { ...result, discoveryDeck: deck };
  }

  // Create placed sector
  const ancientCount = chosenDef.ancientCount ?? (chosenDef.hasAncient ? 1 : 0);
  const ancientShips: ShipOnBoard[] = [];
  for (let j = 0; j < ancientCount; j++) {
    ancientShips.push({
      id: `ancient_${targetKey}_${j}`,
      type: 'interceptor' as any,
      owner: NpcType.Ancient,
      damage: 0,
      isRetreating: false,
      retreatTarget: null,
      entryOrder: j,
    });
  }

  const newSector: PlacedSector = {
    sectorId: chosenTileId,
    position: targetPos,
    rotation: action.rotation ?? 0,
    influenceDisc: null,
    populations: [],
    ships: ancientShips,
    structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
    discoveryTile,
    ancients: ancientCount,
    hasWarpPortal: false,
  };

  result = placeSector(result, targetKey, newSector);

  // Take influence if requested and no ancients (Draco can place disc alongside ancients)
  if (action.takeInfluence && (ancientCount === 0 || isDescendantsOfDraco(state, playerId))) {
    result = moveDiscToSector(result, playerId);
    const placedSectorObj = result.board.sectors[targetKey]!;
    result = {
      ...result,
      board: {
        ...result.board,
        sectors: {
          ...result.board.sectors,
          [targetKey]: { ...placedSectorObj, influenceDisc: playerId },
        },
      },
    };
  }

  // Log event
  const event = createEvent('SECTOR_EXPLORED', {
    playerId,
    sectorId: chosenTileId,
    position: targetPos,
    placed: true,
  });
  result = { ...result, eventLog: appendEvent(result.eventLog, event) };

  // Check for discovery decision
  if (ancientCount === 0 && discoveryTile) {
    const discoveryTarget = findNextDiscoveryDecision(result, playerId, new Set([targetKey]));
    if (discoveryTarget) {
      result = {
        ...result,
        subPhase: {
          type: 'DISCOVERY_DECISION',
          playerId,
          tileId: discoveryTarget.tileId,
          sectorKey: discoveryTarget.sectorKey,
          exploreSectorKeys: [targetKey],
        },
      };
    }
  }

  return result;
}

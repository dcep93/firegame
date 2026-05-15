import { PhaseType, PopulationSquareType } from '@data/enums';
import type { ResourceType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  InfluenceAction,
  PlayerId,
  ReturnTrackOverride,
} from '../types';
import type { HexCoord } from '@data/types/common';
import {
  updatePlayer,
  moveDiscToAction,
  moveDiscToSector,
  returnDiscFromSector,
  returnCubeToTrack,
  updateSector,
} from '../state/state-helpers';
import {
  isPlayerTurn,
  getControlledSectors,
  getPlayerShips,
  getShipsInSector,
  getSectorOwner,
} from '../state/state-queries';
import { isNpcOwner, isNpcFriendlyToPlayer } from '../combat/combat-helpers';
import { positionToKey } from '../hex/hex-math';
import { getWormholeNeighbors } from '../hex/wormhole';
import { appendEvent, createEvent } from '../utils/events';

/**
 * Find the override track for a given slot index from an overrides array.
 * Returns undefined if no override found.
 */
function findOverrideTrack(
  overrides: readonly ReturnTrackOverride[] | undefined,
  slotIndex: number,
): ResourceType | undefined {
  if (!overrides) return undefined;
  return overrides.find(o => o.slotIndex === slotIndex)?.track;
}

/**
 * Validate returnTrackOverrides for an influence removal.
 * Only gray (wild) population squares and orbital pops can have their track overridden.
 */
function validateReturnTrackOverrides(
  overrides: readonly ReturnTrackOverride[],
  sectorId: string,
  populations: readonly { slotIndex: number; sourceTrack: ResourceType }[],
  hasOrbitalPop: boolean,
): string | null {
  const sectorDef = SECTORS_BY_ID[sectorId];
  if (!sectorDef) return 'Unknown sector definition.';

  for (const override of overrides) {
    if (override.slotIndex === -1) {
      // Orbital override
      if (!hasOrbitalPop) return 'No orbital population to override track for.';
      if (override.track !== 'science' && override.track !== 'money') {
        return 'Orbital population can only return to science or money track.';
      }
    } else {
      // Normal population override
      const pop = populations.find(p => p.slotIndex === override.slotIndex);
      if (!pop) return `No population at slot index ${override.slotIndex}.`;
      const square = sectorDef.populationSquares[override.slotIndex];
      if (!square) return `Invalid slot index ${override.slotIndex}.`;
      if (square.type === PopulationSquareType.Wild) {
        // Wild squares can return to any track
        if (override.track !== 'money' && override.track !== 'science' && override.track !== 'materials') {
          return `Invalid track '${override.track}' for wild square.`;
        }
      } else {
        // Non-wild squares must return to their source track
        if (override.track !== pop.sourceTrack) {
          return `Cannot override track for non-wild population square (slot ${override.slotIndex}).`;
        }
      }
    }
  }
  return null;
}

export function validateInfluence(
  state: GameState,
  playerId: PlayerId,
  action: InfluenceAction,
): string | null {
  if (state.phase !== PhaseType.Action) {
    return 'Can only take influence action during the Action phase.';
  }
  const player = state.players[playerId];
  if (!player) return 'Player not found.';
  if (player.hasPassed) return 'Player has already passed.';
  if (!isPlayerTurn(state, playerId)) return 'Not this player\'s turn.';
  if (action.activations.length === 0 && action.colonyShipFlips <= 0) {
    return 'Must have at least one activation or colony ship flip.';
  }

  if (action.activations.length > 0 && player.influenceDiscs.onTrack <= 0) {
    return 'No influence discs available.';
  }

  const species = SPECIES[player.speciesId]!;
  if (action.activations.length > species.activationLimits.influence) {
    return `Too many activations. Max ${species.activationLimits.influence}.`;
  }

  // Validate colony ship flips
  if (action.colonyShipFlips < 0 || action.colonyShipFlips > 2) {
    return 'Colony ship flips must be 0, 1, or 2.';
  }
  const facedownShips = player.colonyShips.total - player.colonyShips.available;
  if (action.colonyShipFlips > facedownShips) {
    return `Not enough facedown colony ships. Have ${facedownShips}.`;
  }

  // Track targeted sectors (can't target same sector twice)
  const targetedSectors = new Set<string>();

  // Track disc availability as we process activations
  let discsOnTrack = player.influenceDiscs.onTrack;

  // Build set of sectors with player's discs (may change as we process activations)
  const controlledSectorKeys = new Set<string>();
  for (const sector of getControlledSectors(state, playerId)) {
    controlledSectorKeys.add(positionToKey(sector.position));
  }

  for (let i = 0; i < action.activations.length; i++) {
    const activation = action.activations[i]!;

    if (activation.from === 'INFLUENCE_TRACK' && activation.to === 'INFLUENCE_TRACK') {
      return `Activation ${i + 1}: Cannot move disc from track to track.`;
    }

    if (activation.to !== 'INFLUENCE_TRACK') {
      // Moving to a sector
      const toKey = positionToKey(activation.to);
      if (targetedSectors.has(toKey)) {
        return `Activation ${i + 1}: Cannot influence the same sector twice in one action.`;
      }
      targetedSectors.add(toKey);

      // Target sector must exist
      if (!state.board.sectors[toKey]) {
        return `Activation ${i + 1}: Target sector does not exist.`;
      }

      // Target must be uncontrolled
      const owner = getSectorOwner(state, toKey);
      if (owner !== null) {
        return `Activation ${i + 1}: Target sector is already controlled.`;
      }

      // No enemy ships in target sector (Draco coexists with ancients)
      const shipsInTarget = getShipsInSector(state, toKey);
      const enemyShips = shipsInTarget.filter((s) => {
        if (s.owner === playerId) return false;
        if (isNpcOwner(s.owner) && isNpcFriendlyToPlayer(state, s.owner, playerId)) return false;
        return true;
      });
      if (enemyShips.length > 0) {
        return `Activation ${i + 1}: Enemy ships present in target sector.`;
      }

      // Must have a wormhole connection from a controlled sector or sector with player's ships
      // Note: Wormhole Generator does NOT apply to influence actions
      const hasConnection = checkInfluenceConnection(
        state,
        playerId,
        activation.to,
        controlledSectorKeys,
      );
      if (!hasConnection) {
        return `Activation ${i + 1}: No connection to target sector.`;
      }
    }

    if (activation.from === 'INFLUENCE_TRACK') {
      // Moving from track to sector
      if (discsOnTrack <= 0) {
        return `Activation ${i + 1}: No influence discs available on track.`;
      }
      discsOnTrack--;
      if (activation.to !== 'INFLUENCE_TRACK') {
        controlledSectorKeys.add(positionToKey(activation.to));
      }
    } else {
      // Moving from a sector
      const fromKey = positionToKey(activation.from);
      if (!controlledSectorKeys.has(fromKey)) {
        return `Activation ${i + 1}: No influence disc on source sector.`;
      }

      // Validate returnTrackOverrides if provided
      if (activation.returnTrackOverrides && activation.returnTrackOverrides.length > 0) {
        const fromSector = state.board.sectors[fromKey]!;
        const overrideErr = validateReturnTrackOverrides(
          activation.returnTrackOverrides,
          fromSector.sectorId,
          fromSector.populations,
          !!fromSector.structures.orbitalPopulation,
        );
        if (overrideErr) return `Activation ${i + 1}: ${overrideErr}`;
      }

      // If moving sector → track: disc goes back to track
      if (activation.to === 'INFLUENCE_TRACK') {
        discsOnTrack++;
        controlledSectorKeys.delete(fromKey);
      } else {
        // Sector → sector: disc moves between sectors
        controlledSectorKeys.delete(fromKey);
        controlledSectorKeys.add(positionToKey(activation.to));
      }
    }
  }

  return null;
}

/** Check if a target sector has a wormhole connection from a controlled/occupied sector */
function checkInfluenceConnection(
  state: GameState,
  playerId: PlayerId,
  targetPos: HexCoord,
  controlledSectorKeys: Set<string>,
): boolean {
  const targetKey = positionToKey(targetPos);

  // Check warp portal connections
  const targetSector = state.board.sectors[targetKey];
  if (targetSector?.hasWarpPortal) {
    for (const [key, sector] of Object.entries(state.board.sectors)) {
      if (key === targetKey) continue;
      if (!sector.hasWarpPortal) continue;
      if (controlledSectorKeys.has(key) || sectorHasPlayerShip(state, key, playerId)) {
        return true;
      }
    }
  }

  // Check all controlled sectors and sectors with player ships for wormhole connection
  // Note: Wormhole Generator NOT usable for influence (pass false)
  const sectorsToCheck = new Set<string>();
  for (const key of Array.from(controlledSectorKeys)) {
    sectorsToCheck.add(key);
  }
  for (const { sectorKey } of getPlayerShips(state, playerId)) {
    sectorsToCheck.add(sectorKey);
  }

  for (const key of Array.from(sectorsToCheck)) {
    const sector = state.board.sectors[key];
    if (!sector) continue;

    const reachable = getWormholeNeighbors(
      state.board,
      sector.position,
      SECTORS_BY_ID,
      false, // Wormhole Generator NOT usable for influence
    );

    if (reachable.some((pos) => pos.q === targetPos.q && pos.r === targetPos.r)) {
      return true;
    }
  }

  return false;
}

function sectorHasPlayerShip(
  state: GameState,
  sectorKey: string,
  playerId: PlayerId,
): boolean {
  const ships = getShipsInSector(state, sectorKey);
  return ships.some((s) => s.owner === playerId);
}

export function executeInfluence(
  state: GameState,
  playerId: PlayerId,
  action: InfluenceAction,
): GameState {
  let result = moveDiscToAction(state, playerId);

  // Increment action counter
  const player = result.players[playerId]!;
  result = updatePlayer(result, playerId, {
    actionsThisRound: {
      ...player.actionsThisRound,
      influence: player.actionsThisRound.influence + 1,
    },
  });

  for (const activation of action.activations) {
    if (activation.from === 'INFLUENCE_TRACK') {
      // Track → Sector: place disc on target sector
      result = moveDiscToSector(result, playerId);
      const toKey = positionToKey(activation.to as HexCoord);
      result = updateSector(result, toKey, { influenceDisc: playerId });

      const event = createEvent('INFLUENCE_PLACED', {
        playerId,
        sector: activation.to as HexCoord,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, event) };
    } else if (activation.to === 'INFLUENCE_TRACK') {
      // Sector → Track: remove disc, return populations
      const fromKey = positionToKey(activation.from);
      const fromSector = result.board.sectors[fromKey]!;

      // Return population cubes to tracks (with optional overrides for gray/wild squares)
      for (const pop of fromSector.populations) {
        const overrideTrack = findOverrideTrack(activation.returnTrackOverrides, pop.slotIndex);
        result = returnCubeToTrack(result, playerId, overrideTrack ?? pop.sourceTrack);
      }

      // Clear orbital population if present (with optional override)
      if (fromSector.structures.orbitalPopulation) {
        const orbitalOverride = findOverrideTrack(activation.returnTrackOverrides, -1);
        result = returnCubeToTrack(
          result,
          playerId,
          orbitalOverride ?? fromSector.structures.orbitalPopulation.track,
        );
        result = updateSector(result, fromKey, {
          structures: {
            ...fromSector.structures,
            orbitalPopulation: null,
          },
        });
      }

      // Clear populations and influence disc
      result = updateSector(result, fromKey, {
        influenceDisc: null,
        populations: [],
      });
      result = returnDiscFromSector(result, playerId);

      const event = createEvent('INFLUENCE_REMOVED', {
        playerId,
        sector: activation.from,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, event) };
    } else {
      // Sector → Sector: move disc between sectors
      const fromKey = positionToKey(activation.from);
      const toKey = positionToKey(activation.to);
      const fromSector = result.board.sectors[fromKey]!;

      // Return populations from source sector (with optional overrides)
      for (const pop of fromSector.populations) {
        const overrideTrack = findOverrideTrack(activation.returnTrackOverrides, pop.slotIndex);
        result = returnCubeToTrack(result, playerId, overrideTrack ?? pop.sourceTrack);
      }
      if (fromSector.structures.orbitalPopulation) {
        const orbitalOverride = findOverrideTrack(activation.returnTrackOverrides, -1);
        result = returnCubeToTrack(
          result,
          playerId,
          orbitalOverride ?? fromSector.structures.orbitalPopulation.track,
        );
        result = updateSector(result, fromKey, {
          structures: {
            ...fromSector.structures,
            orbitalPopulation: null,
          },
        });
      }

      // Remove disc from source
      result = updateSector(result, fromKey, {
        influenceDisc: null,
        populations: [],
      });

      // Place disc on target
      result = updateSector(result, toKey, { influenceDisc: playerId });

      // Log both events
      const removeEvent = createEvent('INFLUENCE_REMOVED', {
        playerId,
        sector: activation.from,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, removeEvent) };

      const placeEvent = createEvent('INFLUENCE_PLACED', {
        playerId,
        sector: activation.to,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, placeEvent) };
    }
  }

  // Flip colony ships
  if (action.colonyShipFlips > 0) {
    const currentPlayer = result.players[playerId]!;
    result = updatePlayer(result, playerId, {
      colonyShips: {
        ...currentPlayer.colonyShips,
        available: currentPlayer.colonyShips.available + action.colonyShipFlips,
      },
    });
  }

  return result;
}

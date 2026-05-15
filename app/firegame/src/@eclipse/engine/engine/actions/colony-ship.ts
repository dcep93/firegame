import { PopulationSquareType, ResourceType } from '@data/enums';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  ColonyShipAction,
  PlayerId,
} from '../types';
import {
  updatePlayer,
  removeCubeFromTrack,
  updateSector,
} from '../state/state-helpers';
import { positionToKey } from '../hex/hex-math';
import { playerHasTech } from '../state/state-queries';
import { appendEvent, createEvent } from '../utils/events';

export function validateColonyShip(
  state: GameState,
  playerId: PlayerId,
  action: ColonyShipAction,
): string | null {
  const player = state.players[playerId];
  if (!player) return 'Player not found.';

  if (action.usages.length === 0) {
    return 'Must have at least one colony ship usage.';
  }

  // Check colony ships available
  if (player.colonyShips.available < action.usages.length) {
    return `Not enough colony ships. Have ${player.colonyShips.available}, need ${action.usages.length}.`;
  }

  // Track cube removals per track to prevent over-spending
  const cubeRemovals: Record<string, number> = {
    materials: 0,
    science: 0,
    money: 0,
  };

  for (let i = 0; i < action.usages.length; i++) {
    const usage = action.usages[i]!;
    const sectorKey = positionToKey(usage.targetSector);
    const sector = state.board.sectors[sectorKey];

    if (!sector) return `Usage ${i + 1}: Sector does not exist.`;
    if (sector.influenceDisc !== playerId) {
      return `Usage ${i + 1}: Player does not control this sector.`;
    }

    // Orbital population square (slot index -1)
    if (usage.targetSlotIndex === -1) {
      if (!sector.structures.hasOrbital) {
        return `Usage ${i + 1}: Sector does not have an orbital.`;
      }
      if (sector.structures.orbitalPopulation) {
        return `Usage ${i + 1}: Orbital population square is already occupied.`;
      }
      if (usage.sourceTrack !== ResourceType.Money && usage.sourceTrack !== ResourceType.Science) {
        return `Usage ${i + 1}: Orbital accepts money or science cubes only.`;
      }
    } else {
    // Check slot validity
    const sectorDef = SECTORS_BY_ID[sector.sectorId];
    if (!sectorDef) return `Usage ${i + 1}: Unknown sector definition.`;

    if (usage.targetSlotIndex < 0 || usage.targetSlotIndex >= sectorDef.populationSquares.length) {
      return `Usage ${i + 1}: Invalid slot index ${usage.targetSlotIndex}.`;
    }

    // Check slot is not already occupied
    const occupied = sector.populations.some((p) => p.slotIndex === usage.targetSlotIndex);
    if (occupied) {
      return `Usage ${i + 1}: Slot ${usage.targetSlotIndex} is already occupied.`;
    }

    // Check slot type matches source track
    const square = sectorDef.populationSquares[usage.targetSlotIndex]!;
    if (square.type !== PopulationSquareType.Wild) {
      // Colored square — must match
      const expectedTrack = squareTypeToResourceType(square.type);
      if (expectedTrack && usage.sourceTrack !== expectedTrack) {
        return `Usage ${i + 1}: Slot requires ${square.type} cube, got ${usage.sourceTrack}.`;
      }
    }

    // Check advanced slot tech requirement
    if (square.advanced) {
      const techId = advancedSlotTech(square.type);
      if (techId) {
        const hasTech = playerHasTech(player, techId);
        // Metasynthesis unlocks all advanced population slots (rare tech — can be on any track)
        const hasMetasynthesis = playerHasTech(player, 'metasynthesis');
        if (!hasTech && !hasMetasynthesis) {
          return `Usage ${i + 1}: Advanced slot requires tech '${techId}'.`;
        }
      }
    }
    }

    // Check source track has cubes available
    cubeRemovals[usage.sourceTrack] = (cubeRemovals[usage.sourceTrack] ?? 0) + 1;
    const availableCubes = player.populationTracks[usage.sourceTrack].filter(Boolean).length;
    if (cubeRemovals[usage.sourceTrack]! > availableCubes) {
      return `Usage ${i + 1}: Not enough cubes on ${usage.sourceTrack} track.`;
    }
  }

  return null;
}

function squareTypeToResourceType(
  squareType: PopulationSquareType,
): ResourceType | null {
  switch (squareType) {
    case PopulationSquareType.Materials:
      return ResourceType.Materials;
    case PopulationSquareType.Science:
      return ResourceType.Science;
    case PopulationSquareType.Money:
      return ResourceType.Money;
    default:
      return null; // Wild accepts any
  }
}

function advancedSlotTech(squareType: PopulationSquareType): string | null {
  switch (squareType) {
    case PopulationSquareType.Materials:
      return 'advanced_mining';
    case PopulationSquareType.Science:
      return 'advanced_labs';
    case PopulationSquareType.Money:
      return 'advanced_economy';
    case PopulationSquareType.Wild:
      return 'metamorphosis';
    default:
      return null;
  }
}

export function executeColonyShip(
  state: GameState,
  playerId: PlayerId,
  action: ColonyShipAction,
): GameState {
  let result = state;

  for (const usage of action.usages) {
    const currentPlayer = result.players[playerId]!;

    // Flip colony ship facedown
    result = updatePlayer(result, playerId, {
      colonyShips: {
        ...currentPlayer.colonyShips,
        available: currentPlayer.colonyShips.available - 1,
      },
    });

    // Remove cube from source track (lowest present cube)
    const track = result.players[playerId]!.populationTracks[usage.sourceTrack];
    const cubeIndex = track.indexOf(true);
    if (cubeIndex >= 0) {
      result = removeCubeFromTrack(result, playerId, usage.sourceTrack, cubeIndex);
    }

    // Place cube on sector
    const sectorKey = positionToKey(usage.targetSector);
    const sector = result.board.sectors[sectorKey]!;
    if (usage.targetSlotIndex === -1) {
      // Orbital population square
      result = updateSector(result, sectorKey, {
        structures: {
          ...sector.structures,
          orbitalPopulation: { track: usage.sourceTrack },
        },
      });
    } else {
      result = updateSector(result, sectorKey, {
        populations: [
          ...sector.populations,
          { slotIndex: usage.targetSlotIndex, sourceTrack: usage.sourceTrack },
        ],
      });
    }

    // Log event
    const event = createEvent('COLONY_SHIP_USED', {
      playerId,
      sector: usage.targetSector,
      track: usage.sourceTrack,
    });
    result = { ...result, eventLog: appendEvent(result.eventLog, event) };
  }

  return result;
}

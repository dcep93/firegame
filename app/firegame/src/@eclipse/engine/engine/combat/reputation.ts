import { ReputationSlotType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import type { GameState, PlayerId, ReputationSlot } from '../types';
import { updatePlayer } from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';
import { drawFromBag } from '../utils/rng';
import { getDestroyedShipRepValue } from './combat-helpers';
import type { ShipOnBoard } from '../types';

export function getMaxReputationSlots(state: GameState, playerId: PlayerId): number {
  return SPECIES[state.players[playerId]!.speciesId]!.reputationSlots.length;
}

/**
 * Get indices of slots eligible for placing a reputation tile (non-ambassador slots).
 */
export function getEligibleReputationSlotIndices(track: readonly ReputationSlot[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < track.length; i++) {
    const slot = track[i]!;
    if (slot.slotType === ReputationSlotType.Shared || slot.slotType === ReputationSlotType.Reputation) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * Get indices of slots eligible for placing an ambassador tile (ambassador or shared slots).
 */
export function getEligibleAmbassadorSlotIndices(track: readonly ReputationSlot[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < track.length; i++) {
    const slot = track[i]!;
    if (slot.slotType === ReputationSlotType.Shared || slot.slotType === ReputationSlotType.Ambassador) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * Check if there's an available slot for an ambassador (empty ambassador or shared slot).
 */
export function hasAvailableAmbassadorSlot(track: readonly ReputationSlot[]): boolean {
  return track.some(slot =>
    slot.tile === null &&
    (slot.slotType === ReputationSlotType.Ambassador || slot.slotType === ReputationSlotType.Shared),
  );
}

/**
 * Count occupied slots on the track.
 */
export function getOccupiedSlotCount(track: readonly ReputationSlot[]): number {
  return track.filter(slot => slot.tile !== null).length;
}

export function calculateReputationDrawCount(
  destroyedEnemyShips: readonly ShipOnBoard[],
  allPlayerShipsRetreated: boolean,
  maxSlots: number,
): number {
  // Retreating player loses +1 participation base but still draws for destroyed enemies
  const base = allPlayerShipsRetreated ? 0 : 1;
  let total = base;
  for (const ship of destroyedEnemyShips) {
    total += getDestroyedShipRepValue(ship);
  }

  return Math.min(total, maxSlots);
}

export function drawReputationTiles(
  state: GameState,
  count: number,
): { drawn: readonly number[]; state: GameState } {
  if (count <= 0 || state.reputationBag.length === 0) {
    return { drawn: [], state };
  }

  const actualCount = Math.min(count, state.reputationBag.length);
  const [drawn, remaining, newRng] = drawFromBag(
    state.rngState,
    state.reputationBag,
    actualCount,
  );

  return {
    drawn,
    state: {
      ...state,
      rngState: newRng,
      reputationBag: remaining,
    },
  };
}

export function selectReputationTile(
  state: GameState,
  playerId: PlayerId,
  drawn: readonly number[],
  keptIndex: number | null,
  targetSlotIndex: number | null,
): GameState {
  const player = state.players[playerId]!;
  let result = state;

  if (keptIndex === null) {
    // Player chose not to keep any — return all to bag
    result = {
      ...result,
      reputationBag: [...result.reputationBag, ...drawn],
    };
  } else {
    const keptValue = drawn[keptIndex]!;
    // Return unkept tiles to bag
    const returnedTiles = drawn.filter((_, i) => i !== keptIndex);

    const newTrack = [...player.reputationTrack];
    let returnedFromTrack: number | null = null;

    if (targetSlotIndex !== null) {
      const targetSlot = newTrack[targetSlotIndex]!;
      // If slot is occupied, swap out existing tile
      if (targetSlot.tile !== null) {
        returnedFromTrack = targetSlot.tile.value;
      }
      newTrack[targetSlotIndex] = {
        ...targetSlot,
        tile: { value: keptValue, fromAmbassador: false },
      };
    }

    const tilesToReturn = [...returnedTiles];
    if (returnedFromTrack !== null) {
      tilesToReturn.push(returnedFromTrack);
    }

    result = updatePlayer(result, playerId, {
      reputationTrack: newTrack,
    });

    result = {
      ...result,
      reputationBag: [...result.reputationBag, ...tilesToReturn],
    };
  }

  // Log event
  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('REPUTATION_DRAWN', {
        playerId,
        drawn,
        kept: keptIndex !== null ? drawn[keptIndex]! : null,
      }),
    ),
  };

  return result;
}

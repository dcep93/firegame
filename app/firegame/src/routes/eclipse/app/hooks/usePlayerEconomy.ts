import { useMemo } from 'react';
import type { PlayerState } from '@eclipse/shared';
import {
  MATERIALS_PRODUCTION_TRACK,
  SCIENCE_PRODUCTION_TRACK,
  MONEY_PRODUCTION_TRACK,
  INFLUENCE_UPKEEP_TRACK,
} from '@eclipse/shared';

interface Production {
  money: number;
  science: number;
  materials: number;
}

/** Upkeep cost if N more discs are placed (N = index + 1) */
export type UpkeepLookahead = readonly number[];

export interface TrackSlot {
  filled: boolean;
  value: number;
  isNext: boolean;
  isCurrent: boolean;
}

interface PlayerEconomy {
  production: Production;
  upkeep: number;
  netIncome: number;
  upkeepLookahead: UpkeepLookahead;
  influenceSlots: TrackSlot[];
  populationSlots: {
    materials: TrackSlot[];
    science: TrackSlot[];
    money: TrackSlot[];
  };
}

function countRemovedCubes(track: readonly boolean[]): number {
  let count = 0;
  for (const present of track) {
    if (!present) count++;
  }
  return count;
}

function buildPopulationSlots(
  track: readonly boolean[],
  productionTrack: readonly number[],
): TrackSlot[] {
  // Find the index of the first cube still on the track (next to be placed)
  let nextIndex = -1;
  for (let i = 0; i < track.length; i++) {
    if (track[i]) {
      nextIndex = i;
      break;
    }
  }

  // Count removed cubes to find the current production slot
  let removedCount = 0;
  for (const present of track) {
    if (!present) removedCount++;
  }
  // Current production is at slot index `removedCount` in our output array
  // (slot 0 = base, slot 1..11 = cube slots; removedCount cubes gone → last empty slot)

  return [
    // Base production slot (no cube, always empty)
    { filled: false, value: productionTrack[0]!, isNext: false, isCurrent: removedCount === 0 },
    // Cube slots
    ...track.map((present, i) => ({
      filled: present,
      value: productionTrack[i + 1] ?? productionTrack[productionTrack.length - 1]!,
      isNext: i === nextIndex,
      isCurrent: i + 1 === removedCount, // last empty cube slot (i+1 because of base slot offset)
    })),
  ];
}

/**
 * Derives production, upkeep, and net income from a player's state.
 * Mirrors engine's getProduction() + getUpkeepCost() logic.
 */
export function usePlayerEconomy(player: PlayerState): PlayerEconomy {
  return useMemo(() => {
    const materialsRemoved = countRemovedCubes(player.populationTracks.materials);
    const scienceRemoved = countRemovedCubes(player.populationTracks.science);
    const moneyRemoved = countRemovedCubes(player.populationTracks.money);

    const production: Production = {
      materials: MATERIALS_PRODUCTION_TRACK[materialsRemoved] ?? 0,
      science: SCIENCE_PRODUCTION_TRACK[scienceRemoved] ?? 0,
      money: MONEY_PRODUCTION_TRACK[moneyRemoved] ?? 0,
    };

    const standardTrackSize = INFLUENCE_UPKEEP_TRACK.length - 1; // 13
    const discOffset = standardTrackSize - player.influenceDiscs.total; // e.g. 2 for Eridani
    const discsPlaced =
      player.influenceDiscs.onSectors +
      player.influenceDiscs.onActions +
      player.influenceDiscs.onReactions;
    const effectiveIndex = discsPlaced + discOffset;
    const upkeep =
      INFLUENCE_UPKEEP_TRACK[effectiveIndex] ??
      INFLUENCE_UPKEEP_TRACK[INFLUENCE_UPKEEP_TRACK.length - 1]!;

    const netIncome = production.money + upkeep;

    // Lookahead: upkeep cost for placing 1..4 more discs (capped at available)
    const available = player.influenceDiscs.onTrack;
    const maxLookahead = Math.min(6, available);
    const upkeepLookahead: number[] = [];
    for (let i = 1; i <= maxLookahead; i++) {
      const idx = effectiveIndex + i;
      upkeepLookahead.push(
        INFLUENCE_UPKEEP_TRACK[idx] ??
        INFLUENCE_UPKEEP_TRACK[INFLUENCE_UPKEEP_TRACK.length - 1]!,
      );
    }

    // Build influence track slots (always 13 wide, left to right: LOW → HIGH)
    // Offset slots (e.g., Eridani) render as empty — they can acquire more discs later
    const standardTrackSlots = 13;
    const totalPlaced = discsPlaced + discOffset; // total empty slots from the left
    const influenceSlots: TrackSlot[] = [];
    for (let i = 0; i < standardTrackSlots; i++) {
      const cost = INFLUENCE_UPKEEP_TRACK[i + 1] ??
        INFLUENCE_UPKEEP_TRACK[INFLUENCE_UPKEEP_TRACK.length - 1]!;
      influenceSlots.push({
        filled: i >= totalPlaced,
        value: Math.abs(cost),
        isNext: i === totalPlaced && totalPlaced < standardTrackSlots,
        isCurrent: false,
      });
    }

    // Build population track slots
    const populationSlots = {
      materials: buildPopulationSlots(player.populationTracks.materials, MATERIALS_PRODUCTION_TRACK),
      science: buildPopulationSlots(player.populationTracks.science, SCIENCE_PRODUCTION_TRACK),
      money: buildPopulationSlots(player.populationTracks.money, MONEY_PRODUCTION_TRACK),
    };

    return { production, upkeep, netIncome, upkeepLookahead, influenceSlots, populationSlots };
  }, [player.populationTracks, player.influenceDiscs]);
}

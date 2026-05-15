import {
  MATERIALS_PRODUCTION_TRACK,
  SCIENCE_PRODUCTION_TRACK,
  MONEY_PRODUCTION_TRACK,
  INFLUENCE_UPKEEP_TRACK,
} from '@eclipse/shared';

/** Structural interface compatible with both PlayerState and FilteredPlayerState */
export interface EconomyInput {
  populationTracks: {
    readonly materials: readonly boolean[];
    readonly science: readonly boolean[];
    readonly money: readonly boolean[];
  };
  influenceDiscs: {
    readonly total: number;
    readonly onTrack: number;
    readonly onActions: number;
    readonly onReactions: number;
    readonly onSectors: number;
  };
}

interface Production {
  money: number;
  science: number;
  materials: number;
}

/** Lightweight summary for sidebar cards */
export interface EconomySummary {
  production: Production;
  upkeep: number;
  netIncome: number;
}

/** Upkeep cost if N more discs are placed (N = index + 1) */
export type UpkeepLookahead = readonly number[];

export interface TrackSlot {
  filled: boolean;
  value: number;
  isNext: boolean;
  isCurrent: boolean;
}

/** Full economy info for modal/player board */
export interface PlayerEconomy extends EconomySummary {
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
  let nextIndex = -1;
  for (let i = 0; i < track.length; i++) {
    if (track[i]) {
      nextIndex = i;
      break;
    }
  }

  let removedCount = 0;
  for (const present of track) {
    if (!present) removedCount++;
  }

  return [
    { filled: false, value: productionTrack[0]!, isNext: false, isCurrent: removedCount === 0 },
    ...track.map((present, i) => ({
      filled: present,
      value: productionTrack[i + 1] ?? productionTrack[productionTrack.length - 1]!,
      isNext: i === nextIndex,
      isCurrent: i + 1 === removedCount,
    })),
  ];
}

function computeProduction(input: EconomyInput): Production {
  return {
    materials: MATERIALS_PRODUCTION_TRACK[countRemovedCubes(input.populationTracks.materials)] ?? 0,
    science: SCIENCE_PRODUCTION_TRACK[countRemovedCubes(input.populationTracks.science)] ?? 0,
    money: MONEY_PRODUCTION_TRACK[countRemovedCubes(input.populationTracks.money)] ?? 0,
  };
}

function computeUpkeepData(input: EconomyInput) {
  const standardTrackSize = INFLUENCE_UPKEEP_TRACK.length - 1; // 13
  const discOffset = standardTrackSize - input.influenceDiscs.total;
  const discsPlaced =
    input.influenceDiscs.onSectors +
    input.influenceDiscs.onActions +
    input.influenceDiscs.onReactions;
  const effectiveIndex = discsPlaced + discOffset;
  const upkeep =
    INFLUENCE_UPKEEP_TRACK[effectiveIndex] ??
    INFLUENCE_UPKEEP_TRACK[INFLUENCE_UPKEEP_TRACK.length - 1]!;
  return { upkeep, effectiveIndex, discsPlaced, discOffset };
}

/** Lightweight economy summary — production, upkeep, net income */
export function computeEconomySummary(input: EconomyInput): EconomySummary {
  const production = computeProduction(input);
  const { upkeep } = computeUpkeepData(input);
  const netIncome = production.money + upkeep;
  return { production, upkeep, netIncome };
}

/** Full economy computation with track slots and lookahead */
export function computePlayerEconomy(input: EconomyInput): PlayerEconomy {
  const production = computeProduction(input);
  const { upkeep, effectiveIndex, discsPlaced, discOffset } = computeUpkeepData(input);
  const netIncome = production.money + upkeep;

  // Lookahead: upkeep cost for placing 1..6 more discs (capped at available)
  const available = input.influenceDiscs.onTrack;
  const maxLookahead = Math.min(6, available);
  const upkeepLookahead: number[] = [];
  for (let i = 1; i <= maxLookahead; i++) {
    const idx = effectiveIndex + i;
    upkeepLookahead.push(
      INFLUENCE_UPKEEP_TRACK[idx] ??
      INFLUENCE_UPKEEP_TRACK[INFLUENCE_UPKEEP_TRACK.length - 1]!,
    );
  }

  // Build influence track slots (always 13 wide)
  const standardTrackSlots = 13;
  const totalPlaced = discsPlaced + discOffset;
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
    materials: buildPopulationSlots(input.populationTracks.materials, MATERIALS_PRODUCTION_TRACK),
    science: buildPopulationSlots(input.populationTracks.science, SCIENCE_PRODUCTION_TRACK),
    money: buildPopulationSlots(input.populationTracks.money, MONEY_PRODUCTION_TRACK),
  };

  return { production, upkeep, netIncome, upkeepLookahead, influenceSlots, populationSlots };
}

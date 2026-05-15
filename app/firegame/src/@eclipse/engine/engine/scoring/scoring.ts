import {
  AMBASSADOR_VP,
  DISCOVERY_TILE_VP,
  MONOLITH_VP,
  WARP_PORTAL_VP,
} from '@data/constants';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import { PhaseType, SpeciesId } from '@data/enums';
import type { GameState, PlayerId, PlayerState } from '../types';
import { getControlledSectors } from '../state/state-queries';

export interface ScoreBreakdown {
  readonly playerId: PlayerId;
  readonly speciesId: SpeciesId;
  readonly reputationTiles: number;
  readonly ambassadorTiles: number;
  readonly controlledSectors: number;
  readonly monoliths: number;
  readonly warpPortals: number;
  readonly discoveryTiles: number;
  readonly traitorPenalty: number;
  readonly techTrackProgress: number;
  readonly speciesBonus: number;
  readonly total: number;
  readonly tiebreaker: number;
}

function techTrackVP(trackLength: number): number {
  if (trackLength >= 7) return 5;
  if (trackLength === 6) return 3;
  if (trackLength === 5) return 2;
  if (trackLength === 4) return 1;
  return 0;
}

function calculateSpeciesBonus(
  state: GameState,
  player: PlayerState,
  controlledSectorCount: number,
): number {
  if (player.speciesId === SpeciesId.Planta) {
    return controlledSectorCount;
  }
  if (player.speciesId === SpeciesId.DescendantsOfDraco) {
    let ancientCount = 0;
    for (const sector of Object.values(state.board.sectors)) {
      for (const ship of sector.ships) {
        if (ship.owner === 'ancient') {
          ancientCount++;
        }
      }
    }
    return ancientCount;
  }
  return 0;
}

export function calculateScores(
  state: GameState,
): readonly ScoreBreakdown[] {
  const scores: ScoreBreakdown[] = [];

  for (const player of Object.values(state.players)) {
    const reputationTiles = player.reputationTrack
      .filter((slot) => slot.tile !== null && !slot.tile.fromAmbassador)
      .reduce((sum, slot) => sum + slot.tile!.value, 0);

    const ambassadorTiles = player.ambassadorsReceived.length * AMBASSADOR_VP;

    const controlled = getControlledSectors(state, player.id);
    const controlledSectors = controlled.reduce((sum, sector) => {
      const def = SECTORS_BY_ID[sector.sectorId];
      return sum + (def ? def.vpValue : 0);
    }, 0);

    const monoliths =
      controlled.filter((s) => s.structures.hasMonolith).length * MONOLITH_VP;

    const warpPortals =
      controlled.filter((s) => s.hasWarpPortal).length * WARP_PORTAL_VP;

    const discoveryTiles =
      player.discoveryTilesKeptForVP.length * DISCOVERY_TILE_VP;

    const traitorPenalty = player.hasTraitor ? -2 : 0;

    const techTrackProgress =
      techTrackVP(player.techTracks.military.length) +
      techTrackVP(player.techTracks.grid.length) +
      techTrackVP(player.techTracks.nano.length);

    const speciesBonus = calculateSpeciesBonus(
      state,
      player,
      controlled.length,
    );

    const total =
      reputationTiles +
      ambassadorTiles +
      controlledSectors +
      monoliths +
      warpPortals +
      discoveryTiles +
      traitorPenalty +
      techTrackProgress +
      speciesBonus;

    const tiebreaker =
      player.resources.materials +
      player.resources.science +
      player.resources.money;

    scores.push({
      playerId: player.id,
      speciesId: player.speciesId,
      reputationTiles,
      ambassadorTiles,
      controlledSectors,
      monoliths,
      warpPortals,
      discoveryTiles,
      traitorPenalty,
      techTrackProgress,
      speciesBonus,
      total,
      tiebreaker,
    });
  }

  // Sort by total desc, tiebreaker desc
  scores.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return b.tiebreaker - a.tiebreaker;
  });

  return scores;
}

export function getWinner(state: GameState): PlayerId | null {
  const scores = calculateScores(state);
  if (scores.length === 0) return null;
  return scores[0]!.playerId;
}

export function isGameOver(state: GameState): boolean {
  return state.phase === PhaseType.GameOver;
}

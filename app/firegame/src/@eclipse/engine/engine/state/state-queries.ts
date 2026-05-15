import {
  MATERIALS_PRODUCTION_TRACK,
  SCIENCE_PRODUCTION_TRACK,
  MONEY_PRODUCTION_TRACK,
  INFLUENCE_UPKEEP_TRACK,
} from '@data/constants';
import type { TechCategory } from '@data/enums';
import type { Resources } from '@data/types/common';
import type {
  GameState,
  PlayerState,
  PlayerId,
  PlacedSector,
  ShipOnBoard,
} from '../types';

// ── Production / Upkeep ──

export function getProduction(player: PlayerState): Resources {
  const materialsRemoved = countRemovedCubes(player.populationTracks.materials);
  const scienceRemoved = countRemovedCubes(player.populationTracks.science);
  const moneyRemoved = countRemovedCubes(player.populationTracks.money);

  return {
    materials: MATERIALS_PRODUCTION_TRACK[materialsRemoved] ?? 0,
    science: SCIENCE_PRODUCTION_TRACK[scienceRemoved] ?? 0,
    money: MONEY_PRODUCTION_TRACK[moneyRemoved] ?? 0,
  };
}

function countRemovedCubes(track: readonly boolean[]): number {
  let count = 0;
  for (const present of track) {
    if (!present) {
      count++;
    }
  }
  return count;
}

export function getUpkeepCost(player: PlayerState): number {
  const discsPlaced =
    player.influenceDiscs.onSectors +
    player.influenceDiscs.onActions +
    player.influenceDiscs.onReactions;
  return INFLUENCE_UPKEEP_TRACK[discsPlaced] ?? INFLUENCE_UPKEEP_TRACK[INFLUENCE_UPKEEP_TRACK.length - 1]!;
}

export function getNetIncome(player: PlayerState): number {
  const production = getProduction(player);
  return production.money + getUpkeepCost(player);
}

// ── Board Queries ──

export function getControlledSectors(
  state: GameState,
  playerId: PlayerId,
): PlacedSector[] {
  return Object.values(state.board.sectors).filter(
    (sector) => sector.influenceDisc === playerId,
  );
}

export function getPlayerShips(
  state: GameState,
  playerId: PlayerId,
): { ship: ShipOnBoard; sectorKey: string }[] {
  const results: { ship: ShipOnBoard; sectorKey: string }[] = [];
  for (const [sectorKey, sector] of Object.entries(state.board.sectors)) {
    for (const ship of sector.ships) {
      if (ship.owner === playerId) {
        results.push({ ship, sectorKey });
      }
    }
  }
  return results;
}

export function getShipsInSector(
  state: GameState,
  sectorKey: string,
): readonly ShipOnBoard[] {
  const sector = state.board.sectors[sectorKey];
  return sector ? sector.ships : [];
}

export function getSectorOwner(
  state: GameState,
  sectorKey: string,
): PlayerId | null {
  const sector = state.board.sectors[sectorKey];
  return sector ? sector.influenceDisc : null;
}

// ── Tech Queries ──

export function playerHasTech(
  player: PlayerState,
  techId: string,
): boolean {
  return (
    player.techTracks.military.includes(techId) ||
    player.techTracks.grid.includes(techId) ||
    player.techTracks.nano.includes(techId)
  );
}

export function getPlayerTechs(player: PlayerState): readonly string[] {
  return [
    ...player.techTracks.military,
    ...player.techTracks.grid,
    ...player.techTracks.nano,
  ];
}

export function getTechDiscount(
  player: PlayerState,
  category: TechCategory,
): number {
  switch (category) {
    case 'military':
      return player.techTracks.military.length;
    case 'grid':
      return player.techTracks.grid.length;
    case 'nano':
      return player.techTracks.nano.length;
    default:
      return 0;
  }
}

// ── Game State Queries ──

export function getCurrentPlayer(state: GameState): PlayerId {
  return state.turnOrder[state.currentPlayerIndex]!;
}

export function isPlayerTurn(
  state: GameState,
  playerId: PlayerId,
): boolean {
  return getCurrentPlayer(state) === playerId;
}

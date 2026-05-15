import { TECHS_BY_ID } from '@data/definitions/index';
import type { ResourceType, ShipType, TechCategory } from '@data/enums';
import type { Resources } from '@data/types/common';
import type {
  GameState,
  PlayerState,
  PlayerId,
  PlacedSector,
  ShipOnBoard,
  BlueprintState,
} from '../types';

// ── Player Update Helper ──

export function updatePlayer(
  state: GameState,
  playerId: PlayerId,
  update: Partial<PlayerState>,
): GameState {
  const player = state.players[playerId]!;
  return {
    ...state,
    players: {
      ...state.players,
      [playerId]: { ...player, ...update },
    },
  };
}

// ── Resource Helpers ──

export function adjustResources(
  state: GameState,
  playerId: PlayerId,
  delta: Partial<Resources>,
): GameState {
  const player = state.players[playerId]!;
  const resources: Resources = {
    materials: player.resources.materials + (delta.materials ?? 0),
    science: player.resources.science + (delta.science ?? 0),
    money: player.resources.money + (delta.money ?? 0),
  };
  return updatePlayer(state, playerId, { resources });
}

export function setResources(
  state: GameState,
  playerId: PlayerId,
  resources: Resources,
): GameState {
  return updatePlayer(state, playerId, { resources });
}

// ── Influence Disc Helpers ──

export function moveDiscToAction(
  state: GameState,
  playerId: PlayerId,
): GameState {
  const player = state.players[playerId]!;
  return updatePlayer(state, playerId, {
    influenceDiscs: {
      ...player.influenceDiscs,
      onTrack: player.influenceDiscs.onTrack - 1,
      onActions: player.influenceDiscs.onActions + 1,
    },
  });
}

export function moveDiscToSector(
  state: GameState,
  playerId: PlayerId,
): GameState {
  const player = state.players[playerId]!;
  return updatePlayer(state, playerId, {
    influenceDiscs: {
      ...player.influenceDiscs,
      onTrack: player.influenceDiscs.onTrack - 1,
      onSectors: player.influenceDiscs.onSectors + 1,
    },
  });
}

export function returnDiscFromSector(
  state: GameState,
  playerId: PlayerId,
): GameState {
  const player = state.players[playerId]!;
  return updatePlayer(state, playerId, {
    influenceDiscs: {
      ...player.influenceDiscs,
      onSectors: player.influenceDiscs.onSectors - 1,
      onTrack: player.influenceDiscs.onTrack + 1,
    },
  });
}

export function returnActionDiscs(
  state: GameState,
  playerId: PlayerId,
): GameState {
  const player = state.players[playerId]!;
  return updatePlayer(state, playerId, {
    influenceDiscs: {
      ...player.influenceDiscs,
      onTrack: player.influenceDiscs.onTrack + player.influenceDiscs.onActions,
      onActions: 0,
    },
  });
}

// ── Population Track Helpers ──

export function removeCubeFromTrack(
  state: GameState,
  playerId: PlayerId,
  track: ResourceType,
  slotIndex: number,
): GameState {
  const player = state.players[playerId]!;
  const currentTrack = [...player.populationTracks[track]];
  currentTrack[slotIndex] = false;
  return updatePlayer(state, playerId, {
    populationTracks: {
      ...player.populationTracks,
      [track]: currentTrack,
    },
  });
}

export function returnCubeToTrack(
  state: GameState,
  playerId: PlayerId,
  track: ResourceType,
): GameState {
  const player = state.players[playerId]!;

  // Try the preferred track first, then overflow to any track with space
  const trackOrder: ResourceType[] = [track, ...(['materials', 'science', 'money'] as ResourceType[]).filter(t => t !== track)];

  for (const t of trackOrder) {
    const currentTrack = [...player.populationTracks[t]];
    for (let i = currentTrack.length - 1; i >= 0; i--) {
      if (!currentTrack[i]) {
        currentTrack[i] = true;
        return updatePlayer(state, playerId, {
          populationTracks: {
            ...player.populationTracks,
            [t]: currentTrack,
          },
        });
      }
    }
  }

  // All tracks full — cube is lost (shouldn't happen in practice)
  return state;
}

export function moveCubeToGraveyard(
  state: GameState,
  playerId: PlayerId,
  track: ResourceType,
): GameState {
  const player = state.players[playerId]!;
  const currentTrack = [...player.populationTracks[track]];

  // Remove lowest present cube (first true)
  for (let i = 0; i < currentTrack.length; i++) {
    if (currentTrack[i]) {
      currentTrack[i] = false;
      break;
    }
  }

  return updatePlayer(state, playerId, {
    populationTracks: {
      ...player.populationTracks,
      [track]: currentTrack,
    },
    graveyard: {
      ...player.graveyard,
      [track]: player.graveyard[track] + 1,
    },
  });
}

/**
 * Send a cube that is already OFF the track (placed on the board) to the graveyard.
 * Only increments the graveyard counter — does NOT touch the population track,
 * since the cube was already removed from the track when originally placed.
 * Use this for bombardment destruction, Planta auto-destroy, etc.
 */
export function sendBoardCubeToGraveyard(
  state: GameState,
  playerId: PlayerId,
  track: ResourceType,
): GameState {
  const player = state.players[playerId]!;
  return updatePlayer(state, playerId, {
    graveyard: {
      ...player.graveyard,
      [track]: player.graveyard[track] + 1,
    },
  });
}

// ── Ship Helpers ──

export function addShipToSector(
  state: GameState,
  ship: ShipOnBoard,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const updatedSector: PlacedSector = {
    ...sector,
    ships: [...sector.ships, ship],
  };
  return {
    ...state,
    board: {
      ...state.board,
      sectors: {
        ...state.board.sectors,
        [sectorKey]: updatedSector,
      },
    },
  };
}

export function removeShipFromSector(
  state: GameState,
  shipId: string,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const updatedSector: PlacedSector = {
    ...sector,
    ships: sector.ships.filter((s) => s.id !== shipId),
  };
  return {
    ...state,
    board: {
      ...state.board,
      sectors: {
        ...state.board.sectors,
        [sectorKey]: updatedSector,
      },
    },
  };
}

export function moveShip(
  state: GameState,
  shipId: string,
  fromKey: string,
  toKey: string,
): GameState {
  const fromSector = state.board.sectors[fromKey]!;
  const ship = fromSector.ships.find((s) => s.id === shipId)!;
  let result = removeShipFromSector(state, shipId, fromKey);
  result = addShipToSector(result, ship, toKey);
  return result;
}

// ── Board Helpers ──

export function placeSector(
  state: GameState,
  sectorKey: string,
  sector: PlacedSector,
): GameState {
  return {
    ...state,
    board: {
      ...state.board,
      sectors: {
        ...state.board.sectors,
        [sectorKey]: sector,
      },
    },
  };
}

export function updateSector(
  state: GameState,
  sectorKey: string,
  update: Partial<PlacedSector>,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  return {
    ...state,
    board: {
      ...state.board,
      sectors: {
        ...state.board.sectors,
        [sectorKey]: { ...sector, ...update },
      },
    },
  };
}

// ── Blueprint Helpers ──

export function updateBlueprint(
  state: GameState,
  playerId: PlayerId,
  shipType: ShipType,
  blueprint: BlueprintState,
): GameState {
  const player = state.players[playerId]!;
  return updatePlayer(state, playerId, {
    blueprints: {
      ...player.blueprints,
      [shipType]: blueprint,
    },
  });
}

// ── Tech Tray Helpers ──

export function removeTechFromTray(
  state: GameState,
  techId: string,
): GameState {
  const tech = TECHS_BY_ID[techId]!;
  const categoryKey = tech.category as Exclude<TechCategory, 'rare'> | 'rare';
  const slots = state.techTray[categoryKey];
  const updatedSlots = slots
    .map((slot) =>
      slot.techId === techId ? { ...slot, count: slot.count - 1 } : slot,
    )
    .filter((slot) => slot.count > 0);

  return {
    ...state,
    techTray: {
      ...state.techTray,
      [categoryKey]: updatedSlots,
    },
  };
}

export function addTechToPlayer(
  state: GameState,
  playerId: PlayerId,
  techId: string,
  trackOverride?: 'military' | 'grid' | 'nano',
): GameState {
  const player = state.players[playerId]!;
  const tech = TECHS_BY_ID[techId]!;

  let categoryKey: 'military' | 'grid' | 'nano';
  if (trackOverride) {
    categoryKey = trackOverride;
  } else {
    switch (tech.category) {
      case 'military':
        categoryKey = 'military';
        break;
      case 'grid':
        categoryKey = 'grid';
        break;
      case 'nano':
        categoryKey = 'nano';
        break;
      default:
        // Rare techs should always have a trackOverride; fallback to military
        categoryKey = 'military';
        break;
    }
  }

  return updatePlayer(state, playerId, {
    techTracks: {
      ...player.techTracks,
      [categoryKey]: [...player.techTracks[categoryKey], techId],
    },
  });
}

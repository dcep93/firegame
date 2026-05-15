import type {
  FilteredBoardState,
  FilteredGameState,
  FilteredPlacedSector,
  FilteredPlayerState,
} from "@eclipse/shared";
import type {
  GameEvent,
  GameState,
  PlacedSector,
  PlayerId,
  PlayerState,
} from "@eclipse/engine";

export function filterStateForPlayer(
  state: GameState,
  playerId: PlayerId,
): FilteredGameState {
  const you = state.players[playerId]!;
  const opponents: Record<string, FilteredPlayerState> = {};

  for (const [id, player] of Object.entries(state.players)) {
    if (id !== playerId) opponents[id] = filterPlayerState(player);
  }

  let filteredSubPhase = state.subPhase;
  if (state.subPhase?.type === "DISCOVERY_DECISION" && state.subPhase.playerId !== playerId) {
    filteredSubPhase = { ...state.subPhase, tileId: "hidden" };
  }
  if (state.subPhase?.type === "EXPLORE_TILE_CHOICE" && state.subPhase.playerId !== playerId) {
    filteredSubPhase = { ...state.subPhase, drawnTiles: ["hidden", "hidden"] as any };
  }
  if (state.subPhase?.type === "REPUTATION_SELECTION" && state.subPhase.playerId !== playerId) {
    filteredSubPhase = { ...state.subPhase, drawn: state.subPhase.drawn.map(() => 0) };
  }

  return {
    gameId: state.gameId,
    config: state.config,
    phase: state.phase,
    round: state.round,
    subPhase: filteredSubPhase,
    turnOrder: state.turnOrder,
    currentPlayerIndex: state.currentPlayerIndex,
    passOrder: state.passOrder,
    actionPhaseComplete: state.actionPhaseComplete,
    turnNumber: state.turnNumber,
    traitorHolder: state.traitorHolder,
    startPlayer: state.startPlayer,
    you,
    opponents,
    board: filterBoard(state),
    techTray: state.techTray,
    upgradeTray: state.upgradeTray,
    discoveryDeckSize: state.discoveryDeck.length,
    reputationBagSize: state.reputationBag.length,
    sectorStackSizes: {
      inner: state.sectorStacks.inner.length,
      middle: state.sectorStacks.middle.length,
      outer: state.sectorStacks.outer.length,
    },
    combatState: state.combatState ?? null,
    recentEvents: filterEvents(state.eventLog, playerId),
  };
}

function filterPlayerState(player: PlayerState): FilteredPlayerState {
  return {
    id: player.id,
    speciesId: player.speciesId,
    color: player.color,
    resources: player.resources,
    influenceDiscs: player.influenceDiscs,
    actionsThisRound: player.actionsThisRound as Readonly<Record<string, number>>,
    reactionsThisRound: player.reactionsThisRound,
    populationTracks: player.populationTracks,
    graveyard: player.graveyard,
    techTracks: player.techTracks,
    blueprints: player.blueprints,
    ambassadorsGiven: player.ambassadorsGiven,
    ambassadorsReceived: player.ambassadorsReceived,
    colonyShips: player.colonyShips,
    hasPassed: player.hasPassed,
    hasTraitor: player.hasTraitor,
    eliminated: player.eliminated,
    shipSupply: player.shipSupply as Readonly<Record<string, number>>,
    savedShipParts: player.savedShipParts,
    reputationTileCount: player.reputationTrack.filter((s) => s.tile !== null).length,
    discoveryTilesKeptCount: player.discoveryTilesKeptForVP.length,
  };
}

function filterBoard(state: GameState): FilteredBoardState {
  const sectors: Record<string, FilteredPlacedSector> = {};
  for (const [key, sector] of Object.entries(state.board.sectors)) {
    sectors[key] = filterSector(sector);
  }
  return { sectors, emptyZones: state.board.emptyZones };
}

function filterSector(sector: PlacedSector): FilteredPlacedSector {
  return {
    sectorId: sector.sectorId,
    position: sector.position,
    rotation: sector.rotation,
    influenceDisc: sector.influenceDisc,
    populations: sector.populations,
    ships: sector.ships,
    structures: sector.structures,
    discoveryTile: null,
    hasUnclaimedDiscovery: sector.discoveryTile !== null,
    ancients: sector.ancients,
    hasWarpPortal: sector.hasWarpPortal,
  };
}

export function filterEvents(
  events: readonly GameEvent[],
  viewingPlayerId: PlayerId,
): readonly GameEvent[] {
  return events.slice(-50).map((event) => {
    if (event.type === "REPUTATION_DRAWN" && event.playerId !== viewingPlayerId) {
      return {
        ...event,
        drawn: event.drawn.map(() => 0),
        kept: null,
      };
    }
    return event;
  });
}


import type {
  BoardState,
  CombatState,
  GameState,
  PlayerState,
  PlacedSector,
  ShipOnBoard,
} from "@eclipse/engine";
import type { FiregameEclipseGame } from "./types";

const EMPTY_ACTIONS = {
  explore: 0,
  research: 0,
  upgrade: 0,
  build: 0,
  move: 0,
  influence: 0,
};

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (!value || typeof value !== "object") return [];

  const entries = Object.entries(value as Record<string, T>);
  if (entries.length === 0) return [];

  const numericEntries = entries
    .map(([key, item]) => [Number(key), item] as const)
    .filter(([key]) => Number.isInteger(key) && key >= 0)
    .sort(([a], [b]) => a - b);

  if (numericEntries.length !== entries.length) return [];

  const result: T[] = [];
  for (const [index, item] of numericEntries) {
    result[index] = item;
  }
  return result;
}

function asRecord<T>(value: unknown): Record<string, T> {
  if (!value || Array.isArray(value) || typeof value !== "object") return {};
  return value as Record<string, T>;
}

export function normalizeFiregameEclipseGame(game: FiregameEclipseGame): FiregameEclipseGame {
  return {
    ...game,
    state: normalizeGameState(game.state),
    players: asArray(game.players),
    recentEvents: asArray(game.recentEvents),
    error: game.error ?? null,
    scores: game.scores == null ? null : asArray(game.scores),
    winner: game.winner ?? null,
  };
}

export function normalizeGameState(state: GameState): GameState {
  const players: Record<string, PlayerState> = {};
  for (const [playerId, player] of Object.entries(asRecord<PlayerState>(state.players))) {
    players[playerId] = normalizePlayer(player);
  }

  return {
    ...state,
    subPhase: state.subPhase ?? null,
    turnOrder: asArray(state.turnOrder),
    passOrder: asArray(state.passOrder),
    players,
    board: normalizeBoard(state.board),
    techTray: {
      military: asArray(state.techTray?.military),
      grid: asArray(state.techTray?.grid),
      nano: asArray(state.techTray?.nano),
      rare: asArray(state.techTray?.rare),
    },
    upgradeTray: asArray(state.upgradeTray),
    discoveryDeck: asArray(state.discoveryDeck),
    discoveryDiscard: asArray(state.discoveryDiscard),
    reputationBag: asArray(state.reputationBag),
    sectorStacks: {
      inner: asArray(state.sectorStacks?.inner),
      middle: asArray(state.sectorStacks?.middle),
      outer: asArray(state.sectorStacks?.outer),
    },
    sectorDiscards: {
      inner: asArray(state.sectorDiscards?.inner),
      middle: asArray(state.sectorDiscards?.middle),
      outer: asArray(state.sectorDiscards?.outer),
    },
    traitorHolder: state.traitorHolder ?? null,
    eventLog: asArray(state.eventLog),
    combatState: state.combatState ? normalizeCombatState(state.combatState) : null,
  };
}

function normalizePlayer(player: PlayerState): PlayerState {
  const blueprints: Record<string, any> = {};
  for (const [shipType, blueprint] of Object.entries(asRecord<any>(player.blueprints))) {
    blueprints[shipType] = {
      ...blueprint,
      grid: asArray<unknown>(blueprint.grid).map((row) =>
        asArray(row).map((part) => part ?? null),
      ),
      fixedParts: asArray(blueprint.fixedParts),
      computed: {
        ...blueprint.computed,
        weapons: asArray(blueprint.computed?.weapons),
        missiles: asArray(blueprint.computed?.missiles),
      },
    };
  }

  return {
    ...player,
    resources: {
      materials: player.resources?.materials ?? 0,
      science: player.resources?.science ?? 0,
      money: player.resources?.money ?? 0,
    },
    influenceDiscs: {
      total: player.influenceDiscs?.total ?? 0,
      onTrack: player.influenceDiscs?.onTrack ?? 0,
      onActions: player.influenceDiscs?.onActions ?? 0,
      onReactions: player.influenceDiscs?.onReactions ?? 0,
      onSectors: player.influenceDiscs?.onSectors ?? 0,
    },
    actionsThisRound: {
      ...EMPTY_ACTIONS,
      ...asRecord(player.actionsThisRound),
    } as PlayerState["actionsThisRound"],
    reactionsThisRound: asRecord(player.reactionsThisRound),
    populationTracks: {
      materials: asArray(player.populationTracks?.materials),
      science: asArray(player.populationTracks?.science),
      money: asArray(player.populationTracks?.money),
    },
    graveyard: {
      materials: player.graveyard?.materials ?? 0,
      science: player.graveyard?.science ?? 0,
      money: player.graveyard?.money ?? 0,
    },
    techTracks: {
      military: asArray(player.techTracks?.military),
      grid: asArray(player.techTracks?.grid),
      nano: asArray(player.techTracks?.nano),
    },
    blueprints: blueprints as PlayerState["blueprints"],
    reputationTrack: asArray<any>(player.reputationTrack).map((slot) => ({
      ...slot,
      tile: slot?.tile ?? null,
    })),
    ambassadorsGiven: asArray(player.ambassadorsGiven),
    ambassadorsReceived: asArray(player.ambassadorsReceived),
    colonyShips: {
      total: player.colonyShips?.total ?? 0,
      available: player.colonyShips?.available ?? 0,
    },
    discoveryTilesKeptForVP: asArray(player.discoveryTilesKeptForVP),
    savedShipParts: asArray(player.savedShipParts),
    hasPassed: player.hasPassed ?? false,
    hasTraitor: player.hasTraitor ?? false,
    eliminated: player.eliminated ?? false,
    shipSupply: asRecord(player.shipSupply) as PlayerState["shipSupply"],
  };
}

function normalizeBoard(board: BoardState): BoardState {
  const sectors: Record<string, PlacedSector> = {};
  for (const [sectorKey, sector] of Object.entries(asRecord<PlacedSector>(board?.sectors))) {
    sectors[sectorKey] = normalizeSector(sector);
  }

  return {
    sectors,
    emptyZones: asArray(board?.emptyZones),
  };
}

function normalizeSector(sector: PlacedSector): PlacedSector {
  return {
    ...sector,
    influenceDisc: sector.influenceDisc ?? null,
    populations: asArray(sector.populations),
    ships: asArray<ShipOnBoard>(sector.ships).map((ship) => ({
      ...ship,
      damage: ship.damage ?? 0,
      isRetreating: ship.isRetreating ?? false,
      retreatTarget: ship.retreatTarget ?? null,
      entryOrder: ship.entryOrder ?? 0,
    })),
    structures: {
      hasOrbital: sector.structures?.hasOrbital ?? false,
      orbitalPopulation: sector.structures?.orbitalPopulation ?? null,
      hasMonolith: sector.structures?.hasMonolith ?? false,
    },
    discoveryTile: sector.discoveryTile ?? null,
    ancients: sector.ancients ?? 0,
    hasWarpPortal: sector.hasWarpPortal ?? false,
  };
}

function normalizeCombatState(combatState: CombatState): CombatState {
  return {
    ...combatState,
    battles: asArray<any>(combatState.battles).map((battle) => ({
      ...battle,
      participants: asArray(battle.participants),
    })),
    pairs: asArray(combatState.pairs),
    pendingMissileAssignments: asArray<any>(combatState.pendingMissileAssignments).map((pending) => ({
      ...pending,
      assignments: asArray(pending.assignments),
    })),
    initialAttackerShipIds: asArray(combatState.initialAttackerShipIds),
    initialDefenderShipIds: asArray(combatState.initialDefenderShipIds),
    initialAttackerShips: asArray<ShipOnBoard>(combatState.initialAttackerShips),
    initialDefenderShips: asArray<ShipOnBoard>(combatState.initialDefenderShips),
    currentActorOwner: combatState.currentActorOwner ?? null,
    currentActorShipType: combatState.currentActorShipType ?? null,
    currentTargetOwner: combatState.currentTargetOwner ?? null,
    bombardmentDone: combatState.bombardmentDone ?? false,
    retreatDecisionOfferedTo: asArray(combatState.retreatDecisionOfferedTo),
    retreatDeclaredInRound: combatState.retreatDeclaredInRound ?? null,
    retreatedPlayerIds: asArray(combatState.retreatedPlayerIds),
    reputationProcessedPlayers: asArray(combatState.reputationProcessedPlayers),
  };
}

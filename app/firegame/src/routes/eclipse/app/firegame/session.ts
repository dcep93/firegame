import {
  calculateScores,
  createGame,
  endActionPhase,
  executeAction,
  getLegalActions,
  getWinner,
  hexRingType,
  isActionPhaseComplete,
  isGameOver,
  processActionPhaseStep,
  processCleanupPhase,
  processCombatPhase,
  processUpkeepPhase,
  RingType,
  SpeciesId,
  validateAction,
} from "@eclipse/engine";
import type {
  GameAction,
  GameConfig,
  GameEvent,
  HexCoord,
  PlayerId,
  RoomConfig,
  RoomPlayer,
  ScoreBreakdown,
} from "@eclipse/shared";
import type { GameState } from "@eclipse/engine";
import { DEFAULT_ROOM_CONFIG } from "@eclipse/shared";
import type { LobbyType } from "../../../../shared/store";
import type { FiregameEclipseGame, FiregameEclipseSetupGame } from "./types";
import { normalizeGameState } from "./normalize";

const DEFAULT_SPECIES: SpeciesId[] = [
  SpeciesId.EridaniEmpire,
  SpeciesId.HydranProgress,
  SpeciesId.Planta,
  SpeciesId.DescendantsOfDraco,
  SpeciesId.Mechanema,
  SpeciesId.OrionHegemony,
];

export type ActionResult = {
  success: boolean;
  state: GameState;
  newEvents: readonly GameEvent[];
  error?: string;
  scores?: readonly ScoreBreakdown[];
  winner?: string;
};

export function createFiregameEclipseSetupGame(
  lobby: LobbyType,
  hostUserId: string,
): FiregameEclipseSetupGame {
  const players = createRoomPlayers(lobby, hostUserId);
  const config: RoomConfig = {
    ...DEFAULT_ROOM_CONFIG,
    playerCount: players.length,
    rewindMode: "DISABLED",
  };

  return {
    status: "setup",
    players,
    config,
    version: 1,
    hostUserId,
    error: null,
  };
}

export function syncFiregameEclipseSetupGame(
  setup: FiregameEclipseSetupGame,
  lobby: LobbyType,
): FiregameEclipseSetupGame {
  const previous = new Map(
    setup.players.map((player) => [player.playerId, player] as const),
  );
  const seenSpecies = new Set<SpeciesId>();
  const players = createRoomPlayers(lobby, setup.hostUserId).map((player) => {
    const previousPlayer = previous.get(player.playerId);
    const speciesId = previousPlayer?.speciesId ?? null;
    if (!speciesId || seenSpecies.has(speciesId)) return player;
    seenSpecies.add(speciesId);
    return { ...player, speciesId };
  });

  return {
    ...setup,
    players,
    config: {
      ...setup.config,
      playerCount: players.length,
    },
  };
}

export function selectFiregameEclipseSpecies(
  setup: FiregameEclipseSetupGame,
  lobby: LobbyType,
  playerId: string,
  speciesId: SpeciesId,
): FiregameEclipseSetupGame {
  const synced = syncFiregameEclipseSetupGame(setup, lobby);
  if (!synced.players.some((player) => player.playerId === playerId)) {
    throw new Error("Join the Firegame lobby before choosing a species.");
  }
  if (
    synced.players.some(
      (player) => player.playerId !== playerId && player.speciesId === speciesId,
    )
  ) {
    throw new Error("Species already taken.");
  }

  return {
    ...synced,
    players: synced.players.map((player) =>
      player.playerId === playerId ? { ...player, speciesId } : player,
    ),
    version: synced.version + 1,
    error: null,
  };
}

export function createFiregameEclipseGame(
  lobby: LobbyType,
  hostUserId: string,
  setup?: FiregameEclipseSetupGame,
): FiregameEclipseGame {
  const players = setup
    ? syncFiregameEclipseSetupGame(setup, lobby).players
    : createRoomPlayers(lobby, hostUserId).map((player, index) => ({
      ...player,
      speciesId: DEFAULT_SPECIES[index % DEFAULT_SPECIES.length],
    }));

  if (players.length < 2) {
    throw new Error("Eclipse needs at least 2 players.");
  }
  if (players.length > 6) {
    throw new Error("Eclipse supports at most 6 players.");
  }
  if (players.some((player) => !player.speciesId)) {
    throw new Error("Every player must choose a species before starting.");
  }
  const speciesIds = players.map((player) => player.speciesId!);
  if (new Set(speciesIds).size !== speciesIds.length) {
    throw new Error("Each player needs a unique species.");
  }

  const config: RoomConfig = {
    ...(setup?.config ?? DEFAULT_ROOM_CONFIG),
    playerCount: players.length,
    rewindMode: "DISABLED",
  };

  const speciesAssignments: Record<string, SpeciesId> = {};
  players.forEach((player) => {
    speciesAssignments[player.playerId] = player.speciesId!;
  });

  const gameConfig: GameConfig = {
    playerCount: players.length,
    speciesAssignments,
    seed: Math.floor(Math.random() * 2147483647),
    useWarpPortals: config.useWarpPortals,
    manualDamageAssignment: config.manualDamageAssignment ?? false,
    ancientBlueprintVariant: config.ancientBlueprintVariant,
    guardianBlueprintVariant: config.guardianBlueprintVariant,
    gcdsBlueprintVariant: config.gcdsBlueprintVariant,
  };

  const state = createGame(gameConfig);

  return {
    status: "in_game",
    state,
    players,
    config,
    version: 1,
    recentEvents: [...state.eventLog],
    error: null,
    scores: null,
    winner: null,
  };
}

function createRoomPlayers(lobby: LobbyType, hostUserId: string): RoomPlayer[] {
  return Object.entries(lobby)
    .slice(0, 6)
    .map(([userId, nickname]) => ({
      playerId: userId,
      nickname,
      speciesId: null,
      connected: true,
      isHost: userId === hostUserId,
    }));
}

export function processFiregameAction(
  state: GameState,
  playerId: PlayerId,
  action: GameAction,
): ActionResult {
  state = normalizeGameState(state);
  const error = validateAction(state, playerId, action);
  if (error !== null) {
    return { success: false, state, newEvents: [], error };
  }

  const prevEventCount = state.eventLog.length;
  const isSubPhaseAction = isSubphaseAction(state, action);

  let next: GameState;
  try {
    if (state.phase === "action") {
      next = processActionPhaseStep(state, playerId, action);
      if (!isSubPhaseAction) {
        next = { ...next, turnNumber: next.turnNumber + 1 };
      }
    } else {
      next = executeAction(state, playerId, action);
    }
    next = drivePhases(next);
  } catch (err) {
    console.error(err);
    return { success: false, state, newEvents: [], error: "Internal error processing action" };
  }

  const newEvents = next.eventLog.slice(prevEventCount);

  if (isGameOver(next)) {
    return {
      success: true,
      state: next,
      newEvents,
      scores: calculateScores(next),
      winner: getWinner(next) ?? "",
    };
  }

  return { success: true, state: next, newEvents };
}

export function getActionsForPlayer(state: GameState, playerId: PlayerId) {
  return getLegalActions(normalizeGameState(state), playerId);
}

export function peekExplore(
  state: GameState,
  position: HexCoord,
  priorActivations?: readonly {
    readonly targetPosition: HexCoord;
    readonly decision: "PLACE" | "DISCARD";
    readonly rotation?: number;
  }[],
): { sectorId: string } | { error: string } {
  state = normalizeGameState(state);
  const simStacks = {
    inner: [...state.sectorStacks.inner],
    middle: [...state.sectorStacks.middle],
    outer: [...state.sectorStacks.outer],
  };

  const toStackKey = (pos: HexCoord): "inner" | "middle" | "outer" => {
    const ring = hexRingType(pos);
    if (ring === RingType.Inner) return "inner";
    if (ring === RingType.Middle) return "middle";
    return "outer";
  };

  for (const act of priorActivations ?? []) {
    const stack = simStacks[toStackKey(act.targetPosition)];
    if (stack.length === 0) return { error: "No sectors available in prior activation simulation" };
    const drawnSectorId = stack.shift()!;
    if (act.decision === "DISCARD") stack.push(drawnSectorId);
  }

  const stack = simStacks[toStackKey(position)];
  if (stack.length === 0) return { error: "No sectors available to draw" };
  return { sectorId: stack[0]! };
}

function drivePhases(state: GameState): GameState {
  let current = state;
  let iterations = 0;

  while (iterations++ < 100) {
    if (current.phase === "game_over") break;

    if (current.phase === "action") {
      if (!isActionPhaseComplete(current)) break;
      current = endActionPhase(current);
      continue;
    }

    if (current.phase === "combat") {
      if (current.subPhase) break;
      const next = processCombatPhase(current);
      current = next;
      if (next.subPhase) break;
      continue;
    }

    if (current.phase === "upkeep") {
      const next = processUpkeepPhase(current);
      current = next;
      if (next.subPhase) break;
      continue;
    }

    if (current.phase === "cleanup") {
      current = processCleanupPhase(current);
      continue;
    }

    break;
  }

  return current;
}

function isSubphaseAction(state: GameState, action: GameAction): boolean {
  return (
    action.type === "DISCOVERY_DECISION" ||
    action.type === "COMBAT_STEP" ||
    action.type === "MOVE_FINISH" ||
    action.type === "EXPLORE_CHOICE" ||
    action.type === "INFLUENCE_SECTOR_CHOICE" ||
    action.type === "BANKRUPTCY_RESOLUTION" ||
    action.type === "DIPLOMACY" ||
    action.type === "DIPLOMACY_RESPONSE" ||
    action.type === "BOMBARDMENT_CHOICE" ||
    action.type === "WARP_PORTAL_CHOICE" ||
    action.type === "ARTIFACT_RESOURCE_CHOICE" ||
    action.type === "DAMAGE_ASSIGNMENT" ||
    (action.type === "MOVE" && state.subPhase?.type === "MOVE_CONTINUATION") ||
    (action.type === "COLONY_SHIP" && state.subPhase?.type === "COLONY_SHIP_PLACEMENT") ||
    (action.type === "PASS" && state.subPhase?.type === "COLONY_SHIP_PLACEMENT")
  );
}

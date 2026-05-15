import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  FilteredGameState,
  GameAction,
  GameEvent,
  LegalActions,
  RoomConfig,
  RoomListEntry,
  RoomPlayer,
  RoomStatus,
  ScoreBreakdown,
} from "@eclipse/shared";
import store from "../../../../shared/store";
import type { FiregameEclipseGame } from "../firegame/types";
import { filterStateForPlayer } from "../firegame/state-filter";
import {
  getActionsForPlayer,
  peekExplore as peekExploreTile,
  processFiregameAction,
} from "../firegame/session";

export interface ExplorePeekResult {
  sectorId: string;
  position: { q: number; r: number };
}

interface ClientState {
  roomCode: string | null;
  roomName: string | null;
  playerId: string | null;
  sessionToken: string | null;
  urlToken: string | null;
  players: readonly RoomPlayer[];
  config: RoomConfig | null;
  hostPlayerId: string | null;
  roomStatus: RoomStatus | null;
  filteredState: FilteredGameState | null;
  legalActions: LegalActions | null;
  recentEvents: readonly GameEvent[];
  error: string | null;
  chatMessages: readonly ChatMessage[];
  roomList: readonly RoomListEntry[];
  explorePeekResult: ExplorePeekResult | null;
  sessionsPrunedAt: number;
  scores: readonly ScoreBreakdown[] | null;
  winner: string | null;
  rewindMessage: string | null;
  lobbyExpiresAt: number | null;
  gameInactivityDeadline: number | null;
  urlTokens: Readonly<Record<string, string>> | null;
}

export interface ChatMessage {
  fromPlayerId: string;
  fromNickname: string;
  text: string;
  timestamp: number;
}

interface GameContextValue {
  state: ClientState;
  sendAction: (action: unknown) => void;
  leaveRoom: () => void;
  clearError: () => void;
  startBrowsing: () => void;
  stopBrowsing: () => void;
  explorePeek: (
    targetPosition: { q: number; r: number },
    priorActivations?: readonly {
      targetPosition: { q: number; r: number };
      decision: "PLACE" | "DISCARD";
      rotation?: number;
    }[],
  ) => void;
  clearExplorePeek: () => void;
  requestRewind: (toTurn: number) => void;
  clearRewindMessage: () => void;
  isHost: boolean;
  isMyTurn: boolean;
}

export interface SavedSession {
  roomCode: string;
  sessionToken: string;
  playerId: string;
  nickname: string;
}

const GameContext = createContext<GameContextValue | null>(null);

export function getSavedSessions(): SavedSession[] {
  return [];
}

export function clearSavedSession(_playerId: string): void {}

export function clearAllSavedSessions(): void {}

export function GameProvider({ children }: { children: ReactNode }) {
  const game = store.gameW?.game as FiregameEclipseGame | null | undefined;
  const [localError, setLocalError] = useState<string | null>(null);
  const [explorePeekResult, setExplorePeekResult] = useState<ExplorePeekResult | null>(null);
  const [rewindMessage, setRewindMessage] = useState<string | null>(null);

  const playerId = useMemo(() => {
    if (!game) return store.me?.userId ?? null;
    if (game.players.some((p) => p.playerId === store.me.userId)) return store.me.userId;
    return game.players[0]?.playerId ?? null;
  }, [game]);

  const filteredState = useMemo(() => {
    if (!game || !playerId) return null;
    return filterStateForPlayer(game.state, playerId);
  }, [game, playerId]);

  const legalActions = useMemo(() => {
    if (!game || !playerId) return null;
    return getActionsForPlayer(game.state, playerId);
  }, [game, playerId]);

  const isHost = Boolean(store.gameW && store.gameW.info.host === store.me.userId);
  const isMyTurn = useMemo(() => {
    if (!filteredState || !playerId) return false;
    const subPhase = filteredState.subPhase;
    if (subPhase && "playerId" in subPhase) {
      return subPhase.playerId === playerId;
    }
    return (
      filteredState.currentPlayerIndex >= 0 &&
      filteredState.currentPlayerIndex < filteredState.turnOrder.length &&
      filteredState.turnOrder[filteredState.currentPlayerIndex] === playerId
    );
  }, [filteredState, playerId]);

  const roomStatus: RoomStatus | null = game
    ? game.scores
      ? "FINISHED"
      : "IN_GAME"
    : "LOBBY";

  const state: ClientState = {
    roomCode: store.me?.roomId == null ? null : String(store.me.roomId),
    roomName: "Firegame Eclipse",
    playerId,
    sessionToken: null,
    urlToken: null,
    players: game?.players ?? [],
    config: game?.config ?? null,
    hostPlayerId: store.gameW?.info.host ?? null,
    roomStatus,
    filteredState,
    legalActions,
    recentEvents: game?.recentEvents ?? [],
    error: localError ?? game?.error ?? null,
    chatMessages: [],
    roomList: [],
    explorePeekResult,
    sessionsPrunedAt: 0,
    scores: game?.scores ?? null,
    winner: game?.winner ?? null,
    rewindMessage,
    lobbyExpiresAt: null,
    gameInactivityDeadline: null,
    urlTokens: null,
  };

  const sendAction = useCallback(
    (action: unknown) => {
      const currentGame = store.gameW?.game as FiregameEclipseGame | null | undefined;
      if (!currentGame || !playerId) return;

      const result = processFiregameAction(currentGame.state, playerId, action as GameAction);
      if (!result.success) {
        setLocalError(result.error ?? "Action rejected");
        return;
      }

      setLocalError(null);
      setExplorePeekResult(null);
      const next: FiregameEclipseGame = {
        ...currentGame,
        state: result.state,
        version: currentGame.version + 1,
        recentEvents: [...result.newEvents],
        error: null,
        scores: result.scores ? [...result.scores] : currentGame.scores,
        winner: result.winner ?? currentGame.winner,
      };
      store.update(describeAction(action), next);
    },
    [playerId],
  );

  const clearError = useCallback(() => setLocalError(null), []);

  const explorePeek = useCallback(
    (
      targetPosition: { q: number; r: number },
      priorActivations?: readonly {
        targetPosition: { q: number; r: number };
        decision: "PLACE" | "DISCARD";
        rotation?: number;
      }[],
    ) => {
      if (!game) return;
      const result = peekExploreTile(game.state, targetPosition, priorActivations);
      if ("error" in result) {
        setLocalError(result.error);
        return;
      }
      setExplorePeekResult({ sectorId: result.sectorId, position: targetPosition });
    },
    [game],
  );

  const requestRewind = useCallback((_toTurn: number) => {
    setRewindMessage("Rewind is disabled in the Firegame port");
  }, []);

  const value: GameContextValue = {
    state,
    sendAction,
    leaveRoom: () => undefined,
    clearError,
    startBrowsing: () => undefined,
    stopBrowsing: () => undefined,
    explorePeek,
    clearExplorePeek: () => setExplorePeekResult(null),
    requestRewind,
    clearRewindMessage: () => setRewindMessage(null),
    isHost,
    isMyTurn,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

function describeAction(action: unknown): string {
  if (action && typeof action === "object" && "type" in action) {
    return `played ${(action as { type: string }).type}`;
  }
  return "updated the game";
}


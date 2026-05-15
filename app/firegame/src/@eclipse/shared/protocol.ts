import type {
  GameAction,
  GameEvent,
  LegalActions,
  ScoreBreakdown,
  HexCoord,
} from '@eclipse/engine';
import type { FilteredGameState } from './filtered-state';
import type { RoomConfig, RoomPlayer, RoomStatus } from './room-types';

// ── Room List ──

export interface RoomListEntry {
  readonly roomCode: string;
  readonly roomName: string;
  readonly hostNickname: string;
  readonly playerCount: number;
  readonly maxPlayers: number;
}

// ── Error Codes ──

export type ErrorCode =
  | 'ROOM_NOT_FOUND'
  | 'ROOM_FULL'
  | 'INVALID_MESSAGE'
  | 'NOT_HOST'
  | 'GAME_NOT_STARTED'
  | 'GAME_ALREADY_STARTED'
  | 'NOT_IN_ROOM'
  | 'INVALID_ACTION'
  | 'RATE_LIMITED'
  | 'SESSION_EXPIRED'
  | 'INTERNAL_ERROR';

// ── Client -> Server Messages ──

export type ClientMessage =
  | { readonly type: 'CREATE_ROOM'; readonly nickname: string; readonly config: Partial<RoomConfig> }
  | { readonly type: 'JOIN_ROOM'; readonly roomCode: string; readonly nickname: string; readonly sessionToken?: string; readonly urlToken?: string }
  | { readonly type: 'LEAVE_ROOM' }
  | { readonly type: 'UPDATE_CONFIG'; readonly config: Partial<RoomConfig> }
  | { readonly type: 'SELECT_SPECIES'; readonly speciesId: string }
  | { readonly type: 'START_GAME' }
  | { readonly type: 'GAME_ACTION'; readonly action: GameAction; readonly correlationId: string }
  | { readonly type: 'REQUEST_REWIND'; readonly toTurn: number; readonly correlationId: string }

  | { readonly type: 'REQUEST_LEGAL_ACTIONS' }
  | { readonly type: 'CHAT'; readonly text: string }
  | { readonly type: 'KICK_PLAYER'; readonly targetPlayerId: string }
  | { readonly type: 'EXPLORE_PEEK'; readonly targetPosition: HexCoord;
      readonly priorActivations?: readonly { readonly targetPosition: HexCoord; readonly decision: 'PLACE' | 'DISCARD'; readonly rotation?: number }[] }
  | { readonly type: 'BROWSE_ROOMS' }
  | { readonly type: 'STOP_BROWSING' }
  | { readonly type: 'VALIDATE_SESSIONS'; readonly sessions: readonly { readonly roomCode: string; readonly sessionToken: string }[] }
  | { readonly type: 'PING' };

// ── Server -> Client Messages ──

export type ServerMessage =
  | { readonly type: 'ROOM_CREATED'; readonly roomCode: string; readonly roomName: string; readonly sessionToken: string; readonly playerId: string; readonly urlToken: string; readonly lobbyExpiresAt: number }
  | { readonly type: 'ROOM_JOINED'; readonly roomCode: string; readonly players: readonly RoomPlayer[];
      readonly playerId: string; readonly sessionToken: string; readonly urlToken: string; readonly config: RoomConfig; readonly lobbyExpiresAt: number | null }
  | { readonly type: 'ROOM_UPDATE'; readonly players: readonly RoomPlayer[]; readonly config: RoomConfig;
      readonly hostPlayerId: string; readonly status: RoomStatus; readonly urlTokens?: Readonly<Record<string, string>> }
  | { readonly type: 'GAME_STARTED'; readonly filteredState: FilteredGameState; readonly legalActions: LegalActions }
  | { readonly type: 'STATE_UPDATE'; readonly filteredState: FilteredGameState; readonly events: readonly GameEvent[];
      readonly legalActions: LegalActions; readonly lastActionBy?: string }
  | { readonly type: 'ACTION_REJECTED'; readonly reason: string; readonly correlationId: string }
  | { readonly type: 'LEGAL_ACTIONS'; readonly actions: LegalActions }
  | { readonly type: 'TIMER_UPDATE'; readonly remainingMs: number; readonly playerId: string }
  | { readonly type: 'GAME_OVER'; readonly scores: readonly ScoreBreakdown[]; readonly winner: string }

  | { readonly type: 'REWIND_COMPLETE'; readonly filteredState: FilteredGameState; readonly turnNumber: number;
      readonly legalActions: LegalActions }
  | { readonly type: 'REWIND_REJECTED'; readonly reason: string; readonly correlationId: string }
  | { readonly type: 'CHAT_BROADCAST'; readonly fromPlayerId: string; readonly fromNickname: string; readonly text: string }
  | { readonly type: 'PLAYER_DISCONNECTED'; readonly playerId: string }
  | { readonly type: 'PLAYER_RECONNECTED'; readonly playerId: string }
  | { readonly type: 'ROOM_LIST'; readonly rooms: readonly RoomListEntry[] }
  | { readonly type: 'EXPLORE_PEEK_RESULT'; readonly sectorId: string; readonly position: HexCoord }
  | { readonly type: 'SESSIONS_VALIDATED'; readonly results: readonly { readonly roomCode: string; readonly valid: boolean }[] }
  | { readonly type: 'LOBBY_EXPIRED' }
  | { readonly type: 'GAME_INACTIVITY_EXPIRED' }
  | { readonly type: 'ERROR'; readonly code: ErrorCode; readonly message: string }
  | { readonly type: 'PONG'; readonly serverTime: number };

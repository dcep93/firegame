// Protocol constants

export const HEARTBEAT_INTERVAL_MS = 15_000;
export const HEARTBEAT_TIMEOUT_MS = 45_000;
export const RECONNECT_WINDOW_MS = 120_000; // 2 min to reconnect
export const MAX_NICKNAME_LENGTH = 24;
export const MAX_CHAT_LENGTH = 500;
export const ROOM_CODE_LENGTH = 6;
// No ambiguous characters: 0/O/1/I/L excluded
export const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const SESSION_TOKEN_LENGTH = 21;
export const URL_TOKEN_LENGTH = 8;
export const SNAPSHOT_INTERVAL_TURNS = 10;
export const TIMER_BROADCAST_INTERVAL_MS = 5_000;
export const MAX_RECONNECTS_PER_MINUTE = 5;
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const RECONNECT_BACKOFF_BASE_MS = 1_000;
export const RECONNECT_BACKOFF_MAX_MS = 30_000;
export const LOBBY_TTL_MS = 5 * 60 * 1000; // 5 min
export const GAME_INACTIVITY_TTL_MS = 30 * 60 * 1000; // 30 min

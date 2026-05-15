import type { GameAction } from '@eclipse/engine';
import type { ClientMessage } from './protocol';
import { MAX_NICKNAME_LENGTH, MAX_CHAT_LENGTH, ROOM_CODE_LENGTH } from './constants';

/**
 * Runtime validation for incoming WebSocket messages.
 * Returns the validated message or null if invalid.
 */
export function parseClientMessage(raw: unknown): ClientMessage | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const msg = raw as Record<string, unknown>;
  if (typeof msg['type'] !== 'string') return null;

  switch (msg['type']) {
    case 'CREATE_ROOM':
      return validateCreateRoom(msg);
    case 'JOIN_ROOM':
      return validateJoinRoom(msg);
    case 'LEAVE_ROOM':
      return { type: 'LEAVE_ROOM' };
    case 'UPDATE_CONFIG':
      return validateUpdateConfig(msg);
    case 'SELECT_SPECIES':
      return validateSelectSpecies(msg);
    case 'START_GAME':
      return { type: 'START_GAME' };
    case 'GAME_ACTION':
      return validateGameAction(msg);
    case 'REQUEST_REWIND':
      return validateRequestRewind(msg);
    case 'APPROVE_REWIND':
      return null; // UNANIMOUS mode removed; kept for forward compatibility
    case 'REQUEST_LEGAL_ACTIONS':
      return { type: 'REQUEST_LEGAL_ACTIONS' };
    case 'CHAT':
      return validateChat(msg);
    case 'KICK_PLAYER':
      return validateKickPlayer(msg);
    case 'EXPLORE_PEEK':
      return validateExplorePeek(msg);
    case 'BROWSE_ROOMS':
      return { type: 'BROWSE_ROOMS' };
    case 'STOP_BROWSING':
      return { type: 'STOP_BROWSING' };
    case 'VALIDATE_SESSIONS':
      return validateValidateSessions(msg);
    case 'PING':
      return { type: 'PING' };
    default:
      return null;
  }
}

function validateNickname(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NICKNAME_LENGTH) return null;
  return trimmed;
}

function validateRoomCode(code: unknown): string | null {
  if (typeof code !== 'string') return null;
  const upper = code.toUpperCase().trim();
  if (upper.length !== ROOM_CODE_LENGTH) return null;
  return upper;
}

function validateCorrelationId(id: unknown): string | null {
  if (typeof id !== 'string' || id.length === 0 || id.length > 64) return null;
  return id;
}

function validateCreateRoom(msg: Record<string, unknown>): ClientMessage | null {
  const nickname = validateNickname(msg['nickname']);
  if (!nickname) return null;
  const config = typeof msg['config'] === 'object' && msg['config'] !== null
    ? msg['config'] as Record<string, unknown>
    : {};
  return { type: 'CREATE_ROOM', nickname, config: validatePartialConfig(config) };
}

function validateJoinRoom(msg: Record<string, unknown>): ClientMessage | null {
  const roomCode = validateRoomCode(msg['roomCode']);
  if (!roomCode) return null;
  const nickname = validateNickname(msg['nickname']);
  if (!nickname) return null;
  const sessionToken = typeof msg['sessionToken'] === 'string' ? msg['sessionToken'] : undefined;
  const urlToken = typeof msg['urlToken'] === 'string' ? msg['urlToken'] : undefined;
  return { type: 'JOIN_ROOM', roomCode, nickname, sessionToken, urlToken };
}

function validateUpdateConfig(msg: Record<string, unknown>): ClientMessage | null {
  if (typeof msg['config'] !== 'object' || msg['config'] === null) return null;
  return { type: 'UPDATE_CONFIG', config: validatePartialConfig(msg['config'] as Record<string, unknown>) };
}

function validateSelectSpecies(msg: Record<string, unknown>): ClientMessage | null {
  if (typeof msg['speciesId'] !== 'string') return null;
  return { type: 'SELECT_SPECIES', speciesId: msg['speciesId'] };
}

function validateGameAction(msg: Record<string, unknown>): ClientMessage | null {
  if (typeof msg['action'] !== 'object' || msg['action'] === null) return null;
  const action = msg['action'] as Record<string, unknown>;
  if (typeof action['type'] !== 'string') return null;
  const correlationId = validateCorrelationId(msg['correlationId']);
  if (!correlationId) return null;
  // Deep action validation is done by the engine's validateAction
  return { type: 'GAME_ACTION', action: msg['action'] as GameAction, correlationId };
}

function validateRequestRewind(msg: Record<string, unknown>): ClientMessage | null {
  if (typeof msg['toTurn'] !== 'number' || !Number.isInteger(msg['toTurn']) || msg['toTurn'] < 1) return null;
  const correlationId = validateCorrelationId(msg['correlationId']);
  if (!correlationId) return null;
  return { type: 'REQUEST_REWIND', toTurn: msg['toTurn'], correlationId };
}


function validateChat(msg: Record<string, unknown>): ClientMessage | null {
  if (typeof msg['text'] !== 'string') return null;
  const text = msg['text'].trim();
  if (text.length === 0 || text.length > MAX_CHAT_LENGTH) return null;
  return { type: 'CHAT', text };
}

function validateKickPlayer(msg: Record<string, unknown>): ClientMessage | null {
  if (typeof msg['targetPlayerId'] !== 'string' || msg['targetPlayerId'].length === 0) return null;
  return { type: 'KICK_PLAYER', targetPlayerId: msg['targetPlayerId'] };
}

function validateHexCoord(val: unknown): { q: number; r: number } | null {
  if (typeof val !== 'object' || val === null) return null;
  const obj = val as Record<string, unknown>;
  if (typeof obj['q'] !== 'number' || typeof obj['r'] !== 'number') return null;
  if (!Number.isInteger(obj['q']) || !Number.isInteger(obj['r'])) return null;
  return { q: obj['q'], r: obj['r'] };
}

function validateExplorePeek(msg: Record<string, unknown>): ClientMessage | null {
  const targetPosition = validateHexCoord(msg['targetPosition']);
  if (!targetPosition) return null;

  let priorActivations: Array<{ targetPosition: { q: number; r: number }; decision: 'PLACE' | 'DISCARD'; rotation?: number }> | undefined;

  if (Array.isArray(msg['priorActivations'])) {
    priorActivations = [];
    for (const act of msg['priorActivations']) {
      if (typeof act !== 'object' || act === null) return null;
      const a = act as Record<string, unknown>;
      const pos = validateHexCoord(a['targetPosition']);
      if (!pos) return null;
      if (a['decision'] !== 'PLACE' && a['decision'] !== 'DISCARD') return null;
      const rotation = typeof a['rotation'] === 'number' && Number.isInteger(a['rotation'])
        ? a['rotation'] : undefined;
      priorActivations.push({ targetPosition: pos, decision: a['decision'], rotation });
    }
  }

  return { type: 'EXPLORE_PEEK', targetPosition, priorActivations };
}

function validateValidateSessions(msg: Record<string, unknown>): ClientMessage | null {
  if (!Array.isArray(msg['sessions'])) return null;
  const sessions: { roomCode: string; sessionToken: string }[] = [];
  for (const s of msg['sessions']) {
    if (typeof s !== 'object' || s === null) return null;
    const entry = s as Record<string, unknown>;
    const roomCode = validateRoomCode(entry['roomCode']);
    if (!roomCode) return null;
    if (typeof entry['sessionToken'] !== 'string') return null;
    sessions.push({ roomCode, sessionToken: entry['sessionToken'] });
  }
  return { type: 'VALIDATE_SESSIONS', sessions };
}

function validatePartialConfig(config: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (typeof config['playerCount'] === 'number') {
    const pc = config['playerCount'];
    if (Number.isInteger(pc) && pc >= 2 && pc <= 6) {
      result['playerCount'] = pc;
    }
  }
  if (typeof config['turnTimerMs'] === 'number' || config['turnTimerMs'] === null) {
    result['turnTimerMs'] = config['turnTimerMs'];
  }
  if (typeof config['useWarpPortals'] === 'boolean') {
    result['useWarpPortals'] = config['useWarpPortals'];
  }
  if (config['ancientBlueprintVariant'] === 1 || config['ancientBlueprintVariant'] === 2) {
    result['ancientBlueprintVariant'] = config['ancientBlueprintVariant'];
  }
  if (config['guardianBlueprintVariant'] === 1 || config['guardianBlueprintVariant'] === 2) {
    result['guardianBlueprintVariant'] = config['guardianBlueprintVariant'];
  }
  if (config['gcdsBlueprintVariant'] === 1 || config['gcdsBlueprintVariant'] === 2) {
    result['gcdsBlueprintVariant'] = config['gcdsBlueprintVariant'];
  }
  if (config['rewindMode'] === 'HOST_ONLY' || config['rewindMode'] === 'DISABLED') {
    result['rewindMode'] = config['rewindMode'];
  }
  if (typeof config['manualDamageAssignment'] === 'boolean') {
    result['manualDamageAssignment'] = config['manualDamageAssignment'];
  }

  return result;
}

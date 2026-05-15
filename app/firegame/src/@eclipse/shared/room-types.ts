import type { SpeciesId } from '@eclipse/engine';

export type RoomStatus = 'LOBBY' | 'IN_GAME' | 'FINISHED' | 'ABANDONED';

export interface RoomPlayer {
  readonly playerId: string;
  readonly nickname: string;
  readonly speciesId: SpeciesId | null;
  readonly connected: boolean;
  readonly isHost: boolean;
}

export interface RoomConfig {
  readonly playerCount: number;
  readonly turnTimerMs: number | null; // null = no timer
  readonly useWarpPortals: boolean;
  readonly ancientBlueprintVariant?: 1 | 2;
  readonly guardianBlueprintVariant?: 1 | 2;
  readonly gcdsBlueprintVariant?: 1 | 2;
  readonly rewindMode: 'HOST_ONLY' | 'DISABLED';
  readonly manualDamageAssignment?: boolean;
}

export const DEFAULT_ROOM_CONFIG: RoomConfig = {
  playerCount: 2,
  turnTimerMs: null,
  useWarpPortals: false,
  rewindMode: 'HOST_ONLY',
};

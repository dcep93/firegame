import type {
  GameEvent,
  RoomConfig,
  RoomPlayer,
  ScoreBreakdown,
} from "@eclipse/shared";
import type { GameState } from "@eclipse/engine";

export type FiregameEclipseGame = {
  state: GameState;
  players: RoomPlayer[];
  config: RoomConfig;
  version: number;
  recentEvents: GameEvent[];
  error: string | null;
  scores: ScoreBreakdown[] | null;
  winner: string | null;
};

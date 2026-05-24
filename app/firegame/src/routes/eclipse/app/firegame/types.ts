import type {
  GameEvent,
  RoomConfig,
  RoomPlayer,
  ScoreBreakdown,
} from "@eclipse/shared";
import type { GameState } from "@eclipse/engine";

export type FiregameEclipseSetupGame = {
  status: "setup";
  players: RoomPlayer[];
  config: RoomConfig;
  version: number;
  hostUserId: string;
  error: string | null;
};

export type FiregameEclipseGame = {
  status?: "in_game";
  state: GameState;
  players: RoomPlayer[];
  config: RoomConfig;
  version: number;
  recentEvents: GameEvent[];
  error: string | null;
  scores: ScoreBreakdown[] | null;
  winner: string | null;
};

export type FiregameEclipseStoredGame =
  | FiregameEclipseSetupGame
  | FiregameEclipseGame;

export function isFiregameEclipseSetupGame(
  game: FiregameEclipseStoredGame | null | undefined,
): game is FiregameEclipseSetupGame {
  return game?.status === "setup";
}

export function isFiregameEclipseGame(
  game: FiregameEclipseStoredGame | null | undefined,
): game is FiregameEclipseGame {
  return Boolean(game && "state" in game);
}

import Firebase from "../../../../firegame/firebase";
import store_, { StoreType } from "../../../../shared/store";
import NewGame, { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

function now(): number {
  return Firebase.now();
}

function normalizeGame(game: GameType): void {
  game.current_player_name = game.current_player_name || "";
  game.current_player_start_timestamp =
    game.current_player_start_timestamp || 0;
  game.players.forEach((player) => {
    player.time_used_previously_ms = player.time_used_previously_ms || 0;
    delete (player as PlayerType & { turn_finished?: number }).turn_finished;
  });
}

function getCurrentPlayer(game: GameType = store.gameW.game): PlayerType | null {
  if (!game || !game.current_player_name) return null;
  return (
    game.players.find((player) => player.name === game.current_player_name) ||
    null
  );
}

function startPlayer(name: string): void {
  const game = store.gameW.game;
  if (!game) return;
  normalizeGame(game);
  const nextPlayer = game.players.find((player) => player.name === name);
  if (!nextPlayer) return;
  const currentTime = now();
  const currentPlayer = getCurrentPlayer(game);
  if (currentPlayer && game.current_player_start_timestamp > 0) {
    currentPlayer.time_used_previously_ms =
      (currentPlayer.time_used_previously_ms || 0) +
      currentTime - game.current_player_start_timestamp;
  }
  game.current_player_name = nextPlayer.name;
  game.current_player_start_timestamp = currentTime;
  store.update(`started ${nextPlayer.name}`);
}

function addPlayer(name: string): void {
  const game = store.gameW.game;
  if (!game) return;
  normalizeGame(game);
  const trimmed = name.trim();
  if (!trimmed) return;
  if (game.players.some((player) => player.name === trimmed)) {
    window.alert(`${trimmed} already exists.`);
    return;
  }
  game.players.push({
    name: trimmed,
    time_used_previously_ms: 0,
  });
  store.update(`${trimmed} joined`);
}

function isMyTurn(): boolean {
  return false;
}

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((value, index) =>
        index === 0 ? `${value}` : value.toString().padStart(2, "0"),
      )
      .join(":");
  }
  return [minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

const utils = {
  addPlayer,
  formatDuration,
  getCurrentPlayer,
  isMyTurn,
  newGame: NewGame,
  now,
  startPlayer,
};

export default utils;
export { store };
export type { GameType, PlayerType } from "./NewGame";

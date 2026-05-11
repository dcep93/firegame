import Firebase from "../../../../firegame/firebase";
import store_, { StoreType } from "../../../../shared/store";
import NewGame, { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

function now(): number {
  return Firebase.now();
}

function normalizeGame(game: GameType): void {
  game.players = game.players || [];
  game.current_player_name = game.current_player_name || "";
  game.current_player_start_timestamp =
    game.current_player_start_timestamp || 0;
  game.players.forEach((player) => {
    player.turns = player.turns || [];
    recalculatePlayerTotal(player);
  });
}

function recalculatePlayerTotal(player: PlayerType): void {
  player.time_used_previously_ms = player.turns
    .filter((turn) => turn.counts_towards_total)
    .map((turn) => turn.duration_ms)
    .sum();
}

function getCurrentPlayer(game: GameType = store.gameW.game): PlayerType | null {
  if (!game || !game.current_player_name) return null;
  return (
    game.players.find((player) => player.name === game.current_player_name) ||
    null
  );
}

function finishCurrentTurn(game: GameType, currentTime: number): void {
  const currentPlayer = getCurrentPlayer(game);
  if (currentPlayer && game.current_player_start_timestamp > 0) {
    currentPlayer.turns.push({
      start_timestamp: game.current_player_start_timestamp,
      end_timestamp: currentTime,
      duration_ms: currentTime - game.current_player_start_timestamp,
      counts_towards_total: true,
    });
    recalculatePlayerTotal(currentPlayer);
  }
}

function startPlayer(name: string): void {
  const game = store.gameW.game;
  if (!game) return;
  normalizeGame(game);
  const nextPlayer = game.players.find((player) => player.name === name);
  if (!nextPlayer) return;
  const currentTime = now();
  finishCurrentTurn(game, currentTime);
  game.current_player_name = nextPlayer.name;
  game.current_player_start_timestamp = currentTime;
  store.update(`started ${nextPlayer.name}`);
}

function clearCurrentPlayer(): void {
  const game = store.gameW.game;
  if (!game) return;
  normalizeGame(game);
  const currentTime = now();
  finishCurrentTurn(game, currentTime);
  game.current_player_name = "";
  game.current_player_start_timestamp = 0;
  store.update("paused the timer");
}

function resetAllToZero(): void {
  const game = store.gameW.game;
  if (!game) return;
  normalizeGame(game);
  game.players.forEach((player) => {
    player.turns = [];
    player.time_used_previously_ms = 0;
  });
  game.current_player_name = "";
  game.current_player_start_timestamp = 0;
  store.update("reset all timers to zero");
}

function deletePlayer(name: string): void {
  const game = store.gameW.game;
  if (!game) return;
  normalizeGame(game);
  const playerIndex = game.players.findIndex((player) => player.name === name);
  if (playerIndex === -1) return;
  game.players.splice(playerIndex, 1);
  if (game.current_player_name === name) {
    game.current_player_name = "";
    game.current_player_start_timestamp = 0;
  }
  store.update(`${name} left`);
}

function toggleTurn(playerName: string, turnIndex: number): void {
  const game = store.gameW.game;
  if (!game) return;
  normalizeGame(game);
  const player = game.players.find((player) => player.name === playerName);
  const turn = player?.turns[turnIndex];
  if (!player || !turn) return;
  turn.counts_towards_total = !turn.counts_towards_total;
  recalculatePlayerTotal(player);
  store.update(
    `${turn.counts_towards_total ? "included" : "excluded"} ${playerName}'s turn`,
  );
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
    turns: [],
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
  clearCurrentPlayer,
  deletePlayer,
  formatDuration,
  getCurrentPlayer,
  isMyTurn,
  newGame: NewGame,
  now,
  resetAllToZero,
  startPlayer,
  toggleTurn,
};

export default utils;
export { store };
export type { GameType, PlayerType, TurnType } from "./NewGame";

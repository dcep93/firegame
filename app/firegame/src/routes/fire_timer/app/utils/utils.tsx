import Firebase from "../../../../firegame/firebase";
import store_, { StoreType } from "../../../../shared/store";
import NewGame, { GameType } from "./NewGame";

const store: StoreType<GameType> = store_;

function now(): number {
  return Firebase.now();
}

function getTickingPlayerIndex(game: GameType = store.gameW.game): number {
  if (!game || game.players.length === 0) return -1;
  let latestIndex = 0;
  game.players.forEach((player, index) => {
    if (player.turn_finished > game.players[latestIndex].turn_finished) {
      latestIndex = index;
    }
  });
  return (latestIndex + 1) % game.players.length;
}

function previousPlayerIndex(index: number, game: GameType = store.gameW.game) {
  return (index + game.players.length - 1) % game.players.length;
}

function startPlayer(index: number): void {
  const game = store.gameW.game;
  if (!game || game.players.length === 0) return;
  game.players[previousPlayerIndex(index, game)].turn_finished = now();
  store.update(`started ${game.players[index].name}`);
}

function addPlayer(name: string): void {
  const game = store.gameW.game;
  if (!game) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  if (game.players.some((player) => player.name === trimmed)) {
    window.alert(`${trimmed} already exists.`);
    return;
  }
  game.players.push({
    name: trimmed,
    turn_finished: 0,
  });
  startPlayer(game.players.length - 1);
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
  getTickingPlayerIndex,
  isMyTurn,
  newGame: NewGame,
  now,
  startPlayer,
};

export default utils;
export { store };
export type { GameType, PlayerType } from "./NewGame";

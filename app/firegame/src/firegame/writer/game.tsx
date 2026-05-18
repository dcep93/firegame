import store, { GameWrapperType } from "../../shared/store";
import Firebase from "../firebase";
import { gamePath, update } from "./utils";

const GAME_EXPIRE_TIME = 2 * 60 * 60 * 1000;

type RecordType<T> = { [updateKey: string]: GameWrapperType<T> };
type TimedGame = {
  playerTimers?: Record<string, number>;
  turnStartedAt?: number;
  players?: { userId: string }[];
};

function enterGame(): void {
  Firebase.latestChild(gamePath(), receiveGameUpdate);
}

function sendGameState<T>(message: string, game: T, isNewGame?: boolean): void {
  const lastInfo = store.gameW.info;
  const now = Firebase.now();
  updatePlayerTimers(game, now, !!isNewGame);
  const gameWrapper: GameWrapperType<T> = {
    game,
    info: {
      id: lastInfo.id + 1,
      timestamp: now,
      host: lastInfo.host,
      playerId: store.me.userId,
      playerName: store.lobby[store.me.userId] || store.me.userId,
      message,
    },
  };
  // @ts-ignore
  if (game === undefined) delete gameWrapper.game;
  if (lastInfo.alert) gameWrapper.info.alert = lastInfo.alert;
  if (isNewGame) gameWrapper.info.isNewGame = isNewGame;
  sendGameStateHelper(gameWrapper);
}

function updatePlayerTimers<T>(game: T, now: number, isNewGame: boolean): void {
  if (!game || typeof game !== "object") return;
  const timedGame = game as TimedGame;
  if (!timedGame.playerTimers) return;
  if (isNewGame) {
    timedGame.turnStartedAt = now;
    return;
  }

  const startedAt = timedGame.turnStartedAt;
  const elapsed = typeof startedAt === "number" ? Math.max(0, now - startedAt) : 0;
  const isGamePlayer = timedGame.players?.some((player) => player.userId === store.me.userId);
  if (isGamePlayer) {
    timedGame.playerTimers[store.me.userId] = (timedGame.playerTimers[store.me.userId] || 0) + elapsed;
  }
  timedGame.turnStartedAt = now;
}

function sendGameStateHelper<T>(gameWrapper: GameWrapperType<T>): void {
  Firebase.push(gamePath(), gameWrapper);
}

function receiveGameUpdate<T>(record: RecordType<T>): void {
  if (record) {
    const timestamp = Object.keys(record)[0];
    const gameWrapper = record[timestamp];
    if (Firebase.now() - gameWrapper.info?.timestamp > GAME_EXPIRE_TIME) {
      return;
    }
    // @ts-ignore read only
    store.gameW = gameWrapper;
    update();
    return;
  }
  if (store.gameW) return;
  const gameWrapper: GameWrapperType<T | null> = {
    info: {
      playerId: store.me.userId,
      playerName: store.lobby[store.me.userId] || store.me.userId,
      message: "opened a room",
      host: store.me.userId,
      timestamp: Firebase.now(),
      id: 0,
    },
    game: null,
  };
  sendGameStateHelper(gameWrapper);
}

export { enterGame, sendGameState };

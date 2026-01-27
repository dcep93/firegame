import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { sendCornerHighlights } from "./gameLogic";
import { GameStateUpdateType, State } from "./gameLogic/CatannFilesEnums";
import {
  gameStarter,
  newFirstGameState,
  newRoom,
  newRoomMe,
  spoofHostRoom,
} from "./gameLogic/createNew";
import { sendToMainSocket } from "./handleMessage";

export var firebaseData: any = {};
let hasSentInitialGame = false;
let lastGameStateSnapshot: string | null = null;

const SHOULD_MOCK = true;

const getGameStateSnapshot = (gameData: any) => {
  try {
    return JSON.stringify(gameData?.data?.payload?.gameState ?? null);
  } catch {
    return null;
  }
};

const buildGameStateUpdated = (gameData: any) => {
  const gameState = gameData?.data?.payload?.gameState;
  if (!gameState) return null;
  const timeLeftInState =
    gameData?.data?.payload?.timeLeftInState ??
    gameState?.currentState?.allocatedTime ??
    0;
  return {
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.GameStateUpdated,
      payload: {
        diff: gameState,
        timeLeftInState,
      },
    },
  };
};

const markInitialGameSent = (gameData?: any) => {
  hasSentInitialGame = true;
  if (gameData) {
    lastGameStateSnapshot = getGameStateSnapshot(gameData);
  }
};

function receiveFirebaseDataCatann(catann: any) {
  if (!catann) {
    setFirebaseData(
      {
        ROOM: newRoom(),
      },
      { newRoom: true },
    );
    return;
  }
  const unserialized = unSerializeFirebase(catann, []);
  if (JSON.stringify(firebaseData) === JSON.stringify(unserialized)) return;
  firebaseData = unserialized;
  console.log("rendered", firebaseData);
  if (firebaseData.GAME) {
    const snapshot = getGameStateSnapshot(firebaseData.GAME);
    if (!hasSentInitialGame) {
      markInitialGameSent(firebaseData.GAME);
      initializeGame();
      return;
    }
    if (snapshot === lastGameStateSnapshot) return;
    const update = buildGameStateUpdated(firebaseData.GAME);
    if (update) {
      sendToMainSocket?.(update);
    }
    lastGameStateSnapshot = snapshot;
    return;
  }
  if (
    !firebaseData.ROOM.data.sessions.find(
      (s: any) => s.userId === store.me.userId,
    )
  ) {
    firebaseData.ROOM.data.sessions.push(newRoomMe());
    setFirebaseData(firebaseData, { newRoomMe: true });
    return;
  }
  sendToMainSocket?.(spoofHostRoom());
}

export default function FirebaseWrapper() {
  console.log("connecting firebase wrapper", { hasSentInitialGame });
  useEffect(() => {
    if (SHOULD_MOCK) {
      receiveFirebaseDataCatann(undefined);
      return;
    }
    firebase.connect(roomPath(), (liveData) => {
      console.debug("fetched", { firebaseData, liveData });
      if (!liveData) return;
      receiveFirebaseDataCatann(liveData.catann);
    });
  }, []);
  return <div></div>;
}

export function setFirebaseData(newData: any, change: any) {
  console.log("setting", newData, change);
  const catann = {
    ...newData,
    __meta: { change, me: store.me, now: Date.now() },
  };
  // TODO reduce writes by using update instead of set
  // also only change diffs
  SHOULD_MOCK
    ? receiveFirebaseDataCatann(catann)
    : firebase.set(
        `${roomPath()}/catann`,
        !newData ? null : serializeFirebase(catann),
      );
}

const FirebaseWrapperKey = "__firebase_wrapper__";
const arrayType = "array";
const objectType = "object";

function serializeFirebase(unserialized: any): any {
  if (Array.isArray(unserialized)) {
    if (unserialized.length === 0) {
      return { [FirebaseWrapperKey]: arrayType };
    }
    return unserialized.map(serializeFirebase);
  }
  if (unserialized && typeof unserialized === "object") {
    const obj = Object.fromEntries(
      Object.entries(unserialized).map(([k, v]) => [k, serializeFirebase(v)]),
    );
    if (
      Object.keys(obj)
        .map((k) => parseInt(k))
        .findIndex((k) => isNaN(k)) === -1
    ) {
      obj[FirebaseWrapperKey] = objectType;
    }
    return obj;
  }
  return unserialized;
}

function unSerializeFirebase(serialized: any, path: any[]): any {
  if (Array.isArray(serialized)) {
    return serialized.map((s, i) => unSerializeFirebase(s, path.concat(i)));
  }
  if (serialized && typeof serialized === "object") {
    switch (serialized[FirebaseWrapperKey]) {
      case arrayType:
        return [];
      case objectType:
        delete serialized[FirebaseWrapperKey];
    }
    return Object.fromEntries(
      Object.entries(serialized).map(([k, v]) => [
        k,
        unSerializeFirebase(v, path.concat(k)),
      ]),
    );
  }
  return serialized;
}

function initializeGame() {
  const firstGameState = newFirstGameState();
  const gameStartUpdate = gameStarter();

  sendToMainSocket?.(firstGameState);
  sendToMainSocket?.(firebaseData.GAME);
  sendToMainSocket?.(gameStartUpdate);
  sendCornerHighlights(firebaseData.GAME);
}

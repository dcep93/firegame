import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { sendCornerHighlights30 } from "./gameLogic";
import { GameStateUpdateType, State } from "./gameLogic/CatannFilesEnums";
import {
  newRoom,
  newRoomMe,
  spoofHostRoom,
  startGame,
} from "./gameLogic/createNew";
import { TEST_CHANGE_STR } from "./gameLogic/utils";
import { sendToMainSocket } from "./handleMessage";

export var firebaseData: any = {};
let hasSentInitialGame = false;
let lastGameStateSnapshot: string | null = null;

// const isTest = false;
// console.log({ isTest });
const SHOULD_MOCK = false;

const getGameStateSnapshot = (gameData: any) => {
  try {
    return JSON.stringify(gameData?.data?.payload?.gameState ?? null);
  } catch {
    return null;
  }
};

const isObject = (value: any) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const deepEqual = (a: any, b: any): boolean => {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
};

const buildDiff = (previous: any, current: any): any | undefined => {
  if (deepEqual(previous, current)) return undefined;
  if (Array.isArray(previous) || Array.isArray(current)) {
    if (!Array.isArray(previous) || !Array.isArray(current)) return current;
    return deepEqual(previous, current) ? undefined : current;
  }
  if (isObject(previous) && isObject(current)) {
    const diff: Record<string, any> = {};
    Object.keys(current).forEach((key) => {
      const childDiff = buildDiff(previous[key], current[key]);
      if (childDiff !== undefined) {
        diff[key] = childDiff;
      }
    });
    return Object.keys(diff).length > 0 ? diff : undefined;
  }
  return current;
};

const buildGameStateUpdated = (gameData: any, previousState?: any) => {
  const gameState = gameData?.data?.payload?.gameState;
  if (!gameState) return null;
  const diff = previousState ? buildDiff(previousState, gameState) : gameState;
  if (!diff || (isObject(diff) && Object.keys(diff).length === 0)) {
    return null;
  }
  const timeLeftInState =
    gameData?.data?.payload?.timeLeftInState ??
    gameState?.currentState?.allocatedTime ??
    0;
  return {
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.GameStateUpdated,
      payload: {
        diff,
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
      startGame();
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.KarmaState,
          payload: false,
        },
      });
      sendCornerHighlights30(firebaseData.GAME);
      return;
    }
    if (snapshot === lastGameStateSnapshot) return;
    const previousState = lastGameStateSnapshot
      ? JSON.parse(lastGameStateSnapshot)
      : null;
    const update = buildGameStateUpdated(firebaseData.GAME, previousState);
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
      // console.debug("fetched", { firebaseData, liveData });
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
  if (change === TEST_CHANGE_STR) {
    firebaseData = newData;
    lastGameStateSnapshot = getGameStateSnapshot(firebaseData.GAME);
    return;
  }
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

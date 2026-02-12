import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { buildGameStateUpdated, buildUpdateMap } from "./gameDataHelper";
import {
  colorHelper,
  newGame,
  newRoom,
  newRoomMe,
  spoofHostRoom,
  startGame,
} from "./gameLogic/createNew";
import { TEST_CHANGE_STR } from "./gameLogic/utils";
import { sendToMainSocket } from "./handleMessage";
import { isTest } from "./IframeScriptString";

const SHOULD_MOCK = isTest;

export var firebaseData: {
  PRESENCE?: Record<string, boolean>;
  GAME?: ReturnType<typeof newGame>;
  ROOM?: ReturnType<typeof newRoom>;
} = {};
let firebaseDataSnapshot = JSON.stringify(firebaseData);

function receiveFirebaseDataCatann(catann: any) {
  const prevFirebaseData = firebaseData;
  firebaseData = unSerializeFirebase(catann, []);
  if (firebaseData?.GAME) {
    const selectedColor = firebaseData.ROOM!.data.sessions.find(
      (s) => s.userId === store.me.userId,
    )!.selectedColor;
    firebaseData.GAME!.data.payload.playerColor = colorHelper.find(
      ({ str }) => str === selectedColor,
    )!.int;
  }
  const newSnapshot = JSON.stringify(firebaseData);
  if (firebaseDataSnapshot === newSnapshot) return;
  firebaseDataSnapshot = newSnapshot;
  console.log("rendered", firebaseData);
  if (!catann?.ROOM) {
    setFirebaseData(
      {
        ROOM: newRoom(),
      },
      { newRoom: true },
    );
    return;
  }
  if (firebaseData.GAME) {
    if (catann.__meta.change.startGame) {
      startGame();
      return;
    }
    const update = buildGameStateUpdated(
      firebaseData.GAME,
      prevFirebaseData.GAME,
    );
    if (update) {
      sendToMainSocket?.(update);
    }
    return;
  }
  if (
    !firebaseData.ROOM!.data.sessions.find(
      (s: any) => s.userId === store.me.userId,
    )
  ) {
    firebaseData.ROOM!.data.sessions.push(
      newRoomMe(firebaseData.ROOM!.data.sessions),
    );
    setFirebaseData(firebaseData, { newRoomMe: true });
    return;
  }
  sendToMainSocket?.(spoofHostRoom());
}

var initialized = false;
export default function FirebaseWrapper() {
  useEffect(() => {
    if (initialized) return;
    initialized = true;
    console.log("connecting firebase wrapper");
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
  const catann = {
    ...newData,
    __meta: { change, me: store.me, now: Date.now() },
  };
  const serializedCatann = serializeFirebase(catann);
  const previousSerialized = !firebaseDataSnapshot
    ? {}
    : serializeFirebase(JSON.parse(firebaseDataSnapshot));
  const updates = buildUpdateMap(previousSerialized, serializedCatann);
  if (Object.keys(updates).length === 1) return; // __meta/now will always change
  console.debug("setting", newData, updates);
  if (change === TEST_CHANGE_STR) {
    firebaseData = newData;
    firebaseDataSnapshot = JSON.stringify(firebaseData);
    return;
  }
  if (SHOULD_MOCK) {
    receiveFirebaseDataCatann(catann);
  } else {
    if (!newData) {
      firebase.set(`${roomPath()}/catann`, null);
      return;
    }
    firebase.update(`${roomPath()}/catann`, updates);
  }
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

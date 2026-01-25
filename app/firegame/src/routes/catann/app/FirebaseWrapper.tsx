import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { newRoom, newRoomMe, spoofHostRoom } from "./gameLogic";
import { initializeGame, sendToMainSocket } from "./handleMessage";

export var firebaseData: any = {};
var seenData = firebaseData;

const SHOULD_MOCK = true;

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
  // seenData = unSerializeFirebase(catann, []);
  if (JSON.stringify(firebaseData) === JSON.stringify(unserialized)) return;
  firebaseData = unserialized;
  console.log("rendered", firebaseData);
  if (firebaseData.GAME) {
    if (!seenData.GAME) {
      seenData = firebaseData;
      initializeGame();
      return;
    }
    sendToMainSocket?.(firebaseData.GAME);
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
  console.log("connecting firebase wrapper", seenData);
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

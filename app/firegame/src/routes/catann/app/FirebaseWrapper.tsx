import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { newRoom, newRoomMe, spoofHostRoom } from "./gameLogic";
import { sendToMainSocket } from "./handleMessage";

export function handleClientUpdate(clientData: any) {
  Object.assign(
    firebaseData.ROOM.data.sessions.find(
      (s: any) => s.userId === store.me.userId,
    ),
    clientData,
  );
  setFirebaseData(firebaseData, { handleClientUpdate: clientData });
}

export var firebaseData: any = {};
var seenData = firebaseData;

export default function FirebaseWrapper() {
  console.log("connecting firebase wrapper", seenData);
  useEffect(
    () =>
      void firebase.connect(roomPath(), (liveData) => {
        console.debug("fetched", { firebaseData, liveData });
        if (!liveData) return;
        if (!liveData.catann) {
          setFirebaseData(
            {
              ROOM: newRoom(),
            },
            { newRoom: true },
          );
          return;
        }
        const unserialized = unSerializeFirebase(liveData.catann);
        seenData = unSerializeFirebase(liveData.catann);
        if (JSON.stringify(firebaseData) === JSON.stringify(unserialized))
          return;
        firebaseData = unserialized;
        console.log("rendered", firebaseData);
        if (firebaseData.GAME) {
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
      }),
    [],
  );
  return <div></div>;
}

export function setFirebaseData(newData: any, change: any) {
  console.log("setting", newData, change);
  // TODO reduce writes by using update instead of set
  // also only change diffs
  firebase.set(
    `${roomPath()}/catann`,
    !newData
      ? null
      : serializeFirebase({
          ...newData,
          __meta: { change, me: store.me, now: Date.now() },
        }),
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
        .sort()
        .findIndex((k, i) => k !== i) === -1
    ) {
      obj[FirebaseWrapperKey] = objectType;
    }
    return obj;
  }
  return unserialized;
}

function unSerializeFirebase(serialized: any): any {
  if (Array.isArray(serialized)) {
    const definedEntries = serialized
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s !== undefined);
    if (definedEntries.length !== serialized.length) {
      console.log("unSerializeFirebase", { definedEntries, serialized });
      return Object.fromEntries(
        definedEntries.map(({ s, i }) => [i, unSerializeFirebase(s)]),
      );
    }
    return serialized.map(unSerializeFirebase);
  }
  if (serialized && typeof serialized === "object") {
    if (serialized[FirebaseWrapperKey]) {
      if (serialized[FirebaseWrapperKey] === arrayType) {
        return [];
      }
      if (serialized[FirebaseWrapperKey] === objectType) {
        delete serialized[FirebaseWrapperKey];
      }
    }
    return Object.fromEntries(
      Object.entries(serialized).map(([k, v]) => [k, unSerializeFirebase(v)]),
    );
  }
  return serialized;
}

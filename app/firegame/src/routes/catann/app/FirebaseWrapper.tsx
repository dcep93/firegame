import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { RemotePersonType } from "../../../firegame/writer/lobby";
import { roomPath } from "../../../firegame/writer/utils";
import { listenMock, updateMock } from "./firebaseMock";
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
import getMe from "./getMe";
import { sendToMainSocket } from "./handleMessage";
import { isTest } from "./IframeScriptString";

const SHOULD_MOCK = isTest;

export var firebaseData: {
  GAME?: ReturnType<typeof newGame>;
  ROOM?: ReturnType<typeof newRoom>;
} = {};
let firebaseDataSnapshot = JSON.stringify(firebaseData);

function receiveFirebaseDataCatann(
  catann: any,
  lobby: Record<string, RemotePersonType> | null = null,
) {
  firebaseData = unSerializeFirebase(catann, []);
  if (firebaseData?.GAME) {
    const mySession = firebaseData.ROOM!.data.sessions.find(
      (s) => s.userId === getMe().userId,
    );
    if (mySession) {
      firebaseData.GAME!.data.payload.playerColor = colorHelper.find(
        ({ str }) => str === mySession.selectedColor,
      )!.int;
    } else {
      // TODO spectator
    }
  } else if (firebaseData?.ROOM && lobby) {
    const filter = firebaseData.ROOM.data.sessions.map((s) => ({
      s,
      keep: 2500 >= Date.now() - lobby[s.userId]?.timestamp,
    }));
    const removals = filter
      .filter(({ keep }) => !keep)
      .map(({ s }) => s.username);
    if (removals.length > 0) {
      console.log({ removals });
      firebaseData.ROOM.data.sessions = filter
        .filter(({ keep }) => keep)
        .map(({ s }) => s);
      setFirebaseData(firebaseData, { removals });
      return;
    }
  }
  const newSnapshot = JSON.stringify(firebaseData);
  if (firebaseDataSnapshot === newSnapshot) return;
  const prevFirebaseData = JSON.parse(firebaseDataSnapshot ?? null);
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
      startGame(catann.__meta.change.startGame);
      return;
    }
    const update = buildGameStateUpdated(
      firebaseData.GAME,
      prevFirebaseData.GAME?.data?.payload?.gameState,
    );
    if (update) {
      sendToMainSocket?.(update);
    }
    return;
  }
  if (
    !firebaseData.ROOM!.data.sessions.find(
      (s: any) => s.userId === getMe().userId,
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
      if (`${getMe().roomId}` === "reconnect") {
        firebaseData = { ROOM: newRoom() };
        firebaseData.ROOM!.data.sessions.push(
          newRoomMe(firebaseData.ROOM!.data.sessions),
        );
        firebaseData.GAME = newGame();
        const toReceive = { ...firebaseData, __meta: { change: {} } };
        firebaseData = {};
        receiveFirebaseDataCatann(toReceive);
      } else {
        listenMock(receiveFirebaseDataCatann);
      }
      return;
    }
    firebase.connect(roomPath(), (liveData) => {
      // console.debug("fetched", { firebaseData, liveData });
      if (!liveData) return;
      receiveFirebaseDataCatann(liveData.catann, liveData.lobby);
    });
  }, []);
  return <div></div>;
}

export function setFirebaseData(newData: any, change: any) {
  const catann = {
    ...newData,
    __meta: { change, me: getMe(), now: Date.now() },
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
    updateMock(catann);
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

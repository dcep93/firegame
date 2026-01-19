import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { newRoom, newRoomMe } from "./gameLogic";

export function handleServerUpdate(clientData: any) {
  Object.assign(
    firebase_data.ROOM.data.sessions.find(
      (s: any) => s.userId === store.me.userId,
    ),
    clientData,
  );
  setData(firebase_data, { handleServerUpdate: clientData });
}

export var firebase_data: any = {};

export default function FirebaseWrapper() {
  useEffect(
    () =>
      void firebase.connect(roomPath(), (liveData) => {
        console.debug("fetched", { firebase_data, liveData });
        if (!liveData) return;
        if (!liveData.catann) {
          setData(
            {
              ROOM: newRoom(),
            },
            { newRoom: true },
          );
          return;
        }
        const unserialized = unSerializeFirebase(liveData.catann);
        if (JSON.stringify(firebase_data) === JSON.stringify(unserialized))
          return;
        firebase_data = unserialized;
        console.log(
          "rendered",
          firebase_data,
          "TODO",
          firebase_data.ROOM.data.friendlyRobber,
        );
        if (firebase_data.GAME) {
          console.log({ firebase_data });
          alert("game exists");
          return;
        }
        if (
          !firebase_data.ROOM.data.sessions.find(
            (s: any) => s.userId === store.me.userId,
          )
        ) {
          firebase_data.ROOM.data.sessions.push(newRoomMe());
          setData(firebase_data, { newRoomMe: true });
          return;
        }
      }),
    [],
  );
  return <div></div>;
}

function setData(newData: any, change: any) {
  console.log("setting", newData, change);
  // TODO reduce writes by using update instead of set
  // also only change diffs
  firebase.set(
    `${roomPath()}/catann`,
    serializeFirebase({ ...newData, change }),
  );
}

// TODO just handle empties
function serializeFirebase(data: any) {
  return JSON.stringify(data);
}

function unSerializeFirebase(dataStr: string) {
  return JSON.parse(dataStr);
}

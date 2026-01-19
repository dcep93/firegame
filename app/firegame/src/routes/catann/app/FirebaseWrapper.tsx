import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { newRoom, newRoomMe } from "./gameLogic";

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

export default function FirebaseWrapper() {
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
        if (JSON.stringify(firebaseData) === JSON.stringify(unserialized))
          return;
        firebaseData = unserialized;
        console.log(
          "rendered",
          firebaseData,
          "TODO",
          firebaseData.ROOM.data.friendlyRobber,
        );
        if (firebaseData.GAME) {
          console.log({ firebaseData });
          alert("game exists");
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

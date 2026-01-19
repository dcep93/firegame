import { useEffect, useState } from "react";
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
  setData(firebase_data);
}

export var firebase_data: any = {};

export default function FirebaseWrapper() {
  const [liveData, setLiveData] = useState<any>(null);
  useEffect(
    () =>
      void firebase.connect(roomPath(), (newData) => {
        // console.log({ data, newData, liveData });
        setLiveData(newData);
      }),
    [],
  );
  useEffect(() => {
    console.log("fetched", { liveData });
    if (!liveData) return;
    if (!liveData.catann) {
      setData({
        ROOM: newRoom(),
      });
      return;
    }
    firebase_data = liveData.catann;
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
      setData(firebase_data);
      return;
    }
    console.log("rendered", { firebase_data });
  }, [liveData]);
  return <div></div>;
}

function setData(newData: any) {
  console.log("setting", { newData });
  firebase.set(`${roomPath()}/catann`, newData);
  firebase_data = newData;
}

import { useEffect, useState } from "react";
import firebase from "../../../firegame/firebase";
import { roomPath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";
import { newRoom } from "./gameLogic";

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
      console.log("game exists", { data: firebase_data });
      return;
    }
    if (
      !firebase_data.ROOM.data.sessions.find(
        (s: any) => s.userId === store.me.userId,
      )
    ) {
      firebase_data.ROOM.data.sessions.push({
        roomSessionId: "1141816",
        userSessionId: store.me.userId,
        userId: store.me.userId,
        isBot: false,
        isReadyToPlay: true,
        selectedColor: "red",
        username: store.me.userId,
        isMember: false,
        icon: 12,
        profilePictureUrl: null,
        karmaCompletedGames: 0,
        karmaTotalGames: 0,
        availableColors: ["red", "blue", "orange", "green"],
        botDifficulty: null,
      });
      setData(firebase_data);
      return;
    }
    console.log("rendered", { data: firebase_data });
  }, [liveData]);
  return <div></div>;
}

function setData(newData: any) {
  console.log("setting", { newData });
  firebase.set(`${roomPath()}/catann`, newData);
  firebase_data = newData;
}

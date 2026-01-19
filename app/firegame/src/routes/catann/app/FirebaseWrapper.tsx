import { useEffect } from "react";
import firebase from "../../../firegame/firebase";
import { gamePath } from "../../../firegame/writer/utils";
import store from "../../../shared/store";

export function handleServerUpdate(clientData: any) {
  Object.assign(
    data.ROOM.data.sessions.find((s: any) => s.userId === store.me.userId),
    clientData,
  );
  setData(data);
}

export var data: any = {};
var liveData: typeof data;

export default function FirebaseWrapper() {
  useEffect(() => {
    console.log("fetched", { store });
    if (!store.gameW?.game) {
      if (data.ROOM) return;
      defaultRoom.data.sessions[0].userSessionId = store.me.userId;
      defaultRoom.data.sessions[0].userId = store.me.userId;
      setData({ ROOM: defaultRoom });
      return;
    }
    data = store.gameW.game;
    liveData = { ...data };
    console.log("rendered", { data });
  }, [store]);
  return <div></div>;
}

function setData(newData: any) {
  firebase.set(gamePath(), newData);
  data = newData;
}

const defaultRoom = {
  id: "137",
  data: {
    type: "StateUpdated",
    updateSequence: Date.now(),
    private: true,
    playOrderSelectionActive: false,
    minimumKarma: 0,
    gameMode: "classic4P",
    map: "classic4P",
    diceType: "balanced",
    victoryPointsToWin: 10,
    victoryPointsRecommendedLimit: 22,
    victoryPointsMaxAllowed: 20,
    cardDiscardLimit: 7,
    maxPlayers: 4,
    gameSpeed: "base120s",
    botSpeed: "normal",
    hiddenBankCards: false,
    friendlyRobber: true,
    isTournament: false,
    isTestFreeExpansionsAndMaps: false,
    kickedUserIds: [],
    creationPhase: "settings",
    sessions: [
      {
        roomSessionId: "1141816",
        userSessionId: "",
        userId: "userId",
        isBot: false,
        isReadyToPlay: true,
        selectedColor: "red",
        username: "player1#1001",
        isMember: false,
        icon: 12,
        profilePictureUrl: null,
        karmaCompletedGames: 0,
        karmaTotalGames: 0,
        availableColors: ["red", "blue", "orange", "green"],
        botDifficulty: null,
      },
      {
        roomSessionId: "1141817",
        userSessionId: "08621E.5580920",
        userId: "201878617",
        isBot: false,
        isReadyToPlay: true,
        selectedColor: "blue",
        username: "player2#2002",
        isMember: false,
        icon: 8,
        profilePictureUrl: null,
        karmaCompletedGames: 0,
        karmaTotalGames: 0,
        availableColors: ["red", "blue", "orange", "green"],
        botDifficulty: null,
      },
      {
        roomSessionId: "1141818",
        userSessionId: "08621E.5580921",
        userId: "301878618",
        isBot: false,
        isReadyToPlay: true,
        selectedColor: "orange",
        username: "player3#3003",
        isMember: false,
        icon: 5,
        profilePictureUrl: null,
        karmaCompletedGames: 0,
        karmaTotalGames: 0,
        availableColors: ["red", "blue", "orange", "green"],
        botDifficulty: null,
      },
    ],
  },
} as any;

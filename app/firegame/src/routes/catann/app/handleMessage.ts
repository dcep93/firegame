import store from "../../../shared/store";
import { firebaseData, setFirebaseData } from "./FirebaseWrapper";
import { applyGameAction, sendCornerHighlights30 } from "./gameLogic";
import {
  GameStateUpdateType,
  GeneralAction,
  LobbyAction,
  LobbyState,
  ServerActionType,
  ShuffleQueueAction,
  SocketRouteType,
  State,
} from "./gameLogic/CatannFilesEnums";
import { newGame, spoofHostRoom, startGame } from "./gameLogic/createNew";
import { packServerData, parseClientData } from "./parseMessagepack";

declare global {
  interface Window {
    __socketCatannMessages: { trigger: string; data: any }[];
    __getFirebaseData: () => any;
    __setFirebaseData: (data: any, change?: any) => void;
  }
}
window.__socketCatannMessages = [];
window.__setFirebaseData = setFirebaseData;
window.__getFirebaseData = () => firebaseData;

window.addEventListener("message", (event) => {
  const { id, clientData, catann } = event.data || {};
  if (!catann) return;
  if (!id) return handleClientUpdate(clientData);
  handleMessage(clientData, (rawServerData) => {
    const serverData = packServerData(rawServerData);
    window.__socketCatannMessages.push({
      trigger: "serverData",
      data: rawServerData,
    });
    event.source!.postMessage({ id, serverData }, { targetOrigin: "*" });
  });
});

function handleClientUpdate(clientData: any) {
  Object.assign(
    firebaseData.ROOM!.data.sessions.find(
      (s: any) => s.userId === store.me.userId,
    )!,
    clientData,
  );
  setFirebaseData(firebaseData, { handleClientUpdate: clientData });
}

export const FUTURE = (() => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  return future.toISOString();
})();

export var sendToMainSocket: (serverData: any) => void;

var latestSequence = 0;

export default function handleMessage(
  rawClientData: any,
  sendResponse: typeof sendToMainSocket,
) {
  if (rawClientData.InterceptedWebSocket) {
    if (
      rawClientData.InterceptedWebSocket?.[0].startsWith(
        "wss://socket.svr.colonist.io/",
      )
    ) {
      console.debug("handleMessage.init", {
        rawClientData,
        sendToMainSocket,
      });
      sendToMainSocket = (data) => {
        if (data.data) {
          data.data.sequence = ++latestSequence;
        }
        sendResponse(data);
      };
      sendResponse({ type: "Connected", userSessionId: store.me.userId });
      sendResponse({ type: "SessionEstablished" });
      sendResponse({
        id: State.LobbyStateUpdate.toString(),
        data: {
          type: LobbyState.SessionState,
          payload: { id: store.me.userId },
        },
      });
    }
    return;
  }
  const clientData = parseClientData(rawClientData);
  const __socketCatannMessage = {
    ...clientData,
  };
  if ((clientData.payload ?? null) === null) {
    delete __socketCatannMessage.payload;
  }
  delete __socketCatannMessage.channel;
  delete __socketCatannMessage._header;
  window.__socketCatannMessages.push({
    trigger: "clientData",
    data: __socketCatannMessage,
  });
  if (clientData._header[0] === SocketRouteType.SocketRouter) {
    if (clientData._header[1] === ServerActionType.Echo) {
      return sendResponse({
        id: State.SocketMonitorUpdate.toString(),
        data: {
          timestamp:
            typeof clientData.data?.timestamp === "number"
              ? clientData.data.timestamp
              : Date.now(),
        },
      });
    }
    return;
  }
  if (clientData._header[0] === SocketRouteType.RouteToServerDirect) {
    if (
      clientData._header[1] === ServerActionType.GameAction &&
      clientData.payload === clientData.channel
    ) {
      if (firebaseData.GAME) {
        return sendResponse(firebaseData.GAME);
      }
    }
    if (clientData._header[1] === ServerActionType.GameAction) {
      if (applyGameAction(clientData)) {
        return;
      }
    }
  }
  if (clientData._header[0] === SocketRouteType.RouteToServerType) {
    if (clientData._header[1] === ServerActionType.GeneralAction) {
      if (
        [
          GeneralAction.ChangeOnlineStatus,
          GeneralAction.GetAllFriendsOnlineStatus,
          GeneralAction.RegisterToFriendService,
          GeneralAction.RegisterToNotificationService,
          GeneralAction.GetAllRoomInvitesReceived,
          GeneralAction.GetNotifications,
        ].includes(clientData.action)
      ) {
        return;
      }
    }
    if (clientData._header[1] === ServerActionType.LobbyAction) {
      if (
        [
          LobbyAction.SetAdBlockStatus,
          LobbyAction.WatchRoomList,
          LobbyAction.SaveClientReferrer,
        ].includes(clientData.action)
      ) {
        return;
      }
      if (clientData.action === LobbyAction.AccessGameLink) {
        return sendResponse(spoofHostRoom());
      }
    }
    if (clientData._header[1] === ServerActionType.ShuffleAction) {
      if (
        [ShuffleQueueAction.GetShuffleQueueData].includes(clientData.action)
      ) {
        return;
      }
    }
    console.debug("handleMessage", clientData);
    if (clientData._header[1] === ServerActionType.RoomCommand) {
      if (clientData.type === "startGame") {
        sendToMainSocket?.({
          id: State.GameStateUpdate.toString(),
          data: {
            type: GameStateUpdateType.CanResignGame,
            payload: false,
          },
        });
        setFirebaseData(
          {
            ...firebaseData,
            GAME: window.__testOverrides?.databaseGame?.aggregated ?? newGame(),
          },
          { parsed: clientData },
        );
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
      if (clientData.type.startsWith("set")) {
        const capitalKey = clientData.type.replace(/^set/, "");
        const key = `${capitalKey.charAt(0).toLowerCase()}${capitalKey.slice(1)}`;
        (firebaseData.ROOM!.data as Record<string, any>)[key] = clientData[key];
        setFirebaseData(firebaseData, { parsed: clientData });
        return sendResponse(spoofHostRoom());
      }
      if (clientData.type === "selectColor") {
        firebaseData.ROOM!.data.sessions.find(
          (s: { roomSessionId: string }) =>
            s.roomSessionId === clientData.roomSessionId,
        )!.selectedColor = clientData.color;
        setFirebaseData(firebaseData, { parsed: clientData });
        return sendResponse(spoofHostRoom());
      }
      if (clientData.type === "leave") {
        setFirebaseData(null, { parsed: clientData });
        window.location.reload();
        return;
      }
    }
  }
  // codex: dont remove this, its for debugging
  const e = `msg not implemented: ${JSON.stringify(clientData)}`;
  // console.error(e);
  throw new Error(e);
}

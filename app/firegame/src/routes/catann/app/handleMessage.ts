import store from "../../../shared/store";
import {
  GeneralAction,
  LobbyAction,
  LobbyState,
  ServerActionType,
  ShuffleQueueAction,
  SocketRouteType,
  State,
} from "./catann_files_enums";
import { firebaseData, setFirebaseData } from "./FirebaseWrapper";
import {
  gameStarter,
  newFirstGameState,
  newGame,
  placeRoad,
  placeSettlement,
  sendCornerHighlights,
  spoofHostRoom,
} from "./gameLogic";
import { packServerData, parseClientData } from "./parseMessagepack";

declare global {
  interface Window {
    __socketCatannMessages: { trigger: string; data: any }[];
  }
}
window.__socketCatannMessages = [];

window.addEventListener("message", (event) => {
  const { id, clientData, catann } = event.data || {};
  if (!catann) return;
  if (!id) return handleClientUpdate(clientData);
  handleMessage(clientData, (rawServerData) => {
    const serverData = packServerData(rawServerData);
    window.__socketCatannMessages.push({
      trigger: "serverData",
      data: serverData,
    });
    event.source!.postMessage({ id, serverData }, { targetOrigin: "*" });
  });
});

function handleClientUpdate(clientData: any) {
  Object.assign(
    firebaseData.ROOM.data.sessions.find(
      (s: any) => s.userId === store.me.userId,
    ),
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

const GAME_ACTION = {
  WantToBuildRoad: 10,
  ConfirmBuildRoad: 11,
  ConfirmBuildRoadSkippingSelection: 12,
  WantToBuildSettlement: 14,
  ConfirmBuildSettlement: 15,
  ConfirmBuildSettlementSkippingSelection: 16,
} as const;

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
  window.__socketCatannMessages.push({
    trigger: "clientData",
    data: {
      ...clientData,
      payload: clientData.payload ?? undefined,
      channel: undefined,
      _header: undefined,
    },
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
    return;
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
    console.log("handleMessage", clientData);
    if (clientData._header[1] === ServerActionType.RoomCommand) {
      if (clientData.type === "startGame") {
        setFirebaseData(
          { ...firebaseData, GAME: newGame() },
          { parsed: clientData },
        );
        return;
      }
      if (clientData.type.startsWith("set")) {
        const capitalKey = clientData.type.replace(/^set/, "");
        const key = `${capitalKey.charAt(0).toLowerCase()}${capitalKey.slice(1)}`;
        firebaseData.ROOM.data[key] = clientData[key];
        setFirebaseData(firebaseData, { parsed: clientData });
        return sendResponse(spoofHostRoom());
      }
      if (clientData.type === "selectColor") {
        firebaseData.ROOM.data.sessions.find(
          (s: { roomSessionId: string }) =>
            s.roomSessionId === clientData.roomSessionId,
        ).selectedColor = clientData.color;
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
  const e = `not implemented: ${JSON.stringify(clientData)}`;
  // console.error(e);
  throw new Error(e);
}

export function initializeGame() {
  const firstGameState = newFirstGameState();
  const gameStartUpdate = gameStarter();

  sendToMainSocket?.(firstGameState);
  sendToMainSocket?.(firebaseData.GAME);
  sendToMainSocket?.(gameStartUpdate);
  sendCornerHighlights(firebaseData.GAME);
}

const applyGameAction = (parsed: { action?: number; payload?: unknown }) => {
  if (!firebaseData.GAME) return false;
  if (
    parsed.action !== GAME_ACTION.ConfirmBuildRoad &&
    parsed.action !== GAME_ACTION.ConfirmBuildRoadSkippingSelection &&
    parsed.action !== GAME_ACTION.WantToBuildRoad &&
    parsed.action !== GAME_ACTION.ConfirmBuildSettlement &&
    parsed.action !== GAME_ACTION.ConfirmBuildSettlementSkippingSelection &&
    parsed.action !== GAME_ACTION.WantToBuildSettlement
  ) {
    return false;
  }

  if (parsed.action === GAME_ACTION.WantToBuildSettlement) {
    return true;
  }
  if (parsed.action === GAME_ACTION.WantToBuildRoad) {
    return true;
  }

  if (
    parsed.action === GAME_ACTION.ConfirmBuildSettlement ||
    parsed.action === GAME_ACTION.ConfirmBuildSettlementSkippingSelection
  ) {
    const cornerIndex = parsed.payload as number;

    placeSettlement(cornerIndex);

    return true;
  }

  if (
    parsed.action === GAME_ACTION.ConfirmBuildRoad ||
    parsed.action === GAME_ACTION.ConfirmBuildRoadSkippingSelection
  ) {
    const edgeIndex = parsed.payload as number;

    placeRoad(edgeIndex);
    return true;
  }

  return true;
};

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
import { parseClientData } from "./parseMessagepack";

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
  clientData: any,
  sendResponse: typeof sendToMainSocket,
) {
  if (clientData.InterceptedWebSocket) {
    if (
      clientData.InterceptedWebSocket?.[0].startsWith(
        "wss://socket.svr.colonist.io/",
      )
    ) {
      console.debug("handleMessage.init", { clientData, sendToMainSocket });
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
  const parsed = parseClientData(clientData);
  if (parsed._header[0] === SocketRouteType.SocketRouter) {
    if (parsed._header[1] === ServerActionType.Echo) {
      return sendResponse({
        id: State.SocketMonitorUpdate.toString(),
        data: {
          timestamp:
            typeof parsed.data?.timestamp === "number"
              ? parsed.data.timestamp
              : Date.now(),
        },
      });
    }
    return;
  }
  if (parsed._header[0] === SocketRouteType.RouteToServerDirect) {
    if (
      parsed._header[1] === ServerActionType.GameAction &&
      parsed.payload === parsed.channel
    ) {
      if (firebaseData.GAME) {
        return sendResponse(firebaseData.GAME);
      }
    }
    if (parsed._header[1] === ServerActionType.GameAction) {
      if (applyGameAction(parsed)) {
        return;
      }
    }
    return;
  }
  if (parsed._header[0] === SocketRouteType.RouteToServerType) {
    if (parsed._header[1] === ServerActionType.GeneralAction) {
      if (
        [
          GeneralAction.ChangeOnlineStatus,
          GeneralAction.GetAllFriendsOnlineStatus,
          GeneralAction.RegisterToFriendService,
          GeneralAction.RegisterToNotificationService,
          GeneralAction.GetAllRoomInvitesReceived,
          GeneralAction.GetNotifications,
        ].includes(parsed.action)
      ) {
        return;
      }
    }
    if (parsed._header[1] === ServerActionType.LobbyAction) {
      if (
        [
          LobbyAction.SetAdBlockStatus,
          LobbyAction.WatchRoomList,
          LobbyAction.SaveClientReferrer,
        ].includes(parsed.action)
      ) {
        return;
      }
      if (parsed.action === LobbyAction.AccessGameLink) {
        return sendResponse(spoofHostRoom());
      }
    }
    if (parsed._header[1] === ServerActionType.ShuffleAction) {
      if ([ShuffleQueueAction.GetShuffleQueueData].includes(parsed.action)) {
        return;
      }
    }
    console.log("handleMessage", parsed);
    if (parsed._header[1] === ServerActionType.RoomCommand) {
      if (parsed.type === "startGame") {
        setFirebaseData({ ...firebaseData, GAME: newGame() }, { parsed });
        return;
      }
      if (parsed.type.startsWith("set")) {
        const capitalKey = parsed.type.replace(/^set/, "");
        const key = `${capitalKey.charAt(0).toLowerCase()}${capitalKey.slice(1)}`;
        firebaseData.ROOM.data[key] = parsed[key];
        setFirebaseData(firebaseData, { parsed });
        return sendResponse(spoofHostRoom());
      }
      if (parsed.type === "selectColor") {
        firebaseData.ROOM.data.sessions.find(
          (s: { roomSessionId: string }) =>
            s.roomSessionId === parsed.roomSessionId,
        ).selectedColor = parsed.color;
        setFirebaseData(firebaseData, { parsed });
        return sendResponse(spoofHostRoom());
      }
      if (parsed.type === "leave") {
        setFirebaseData(null, { parsed });
        window.location.reload();
        return;
      }
    }
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(parsed)}`;
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

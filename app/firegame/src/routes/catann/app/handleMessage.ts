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
import { firebase_data } from "./FirebaseWrapper";
import { newGame } from "./gameLogic";
import { parseClientData } from "./parseMessagepack";

export const FUTURE = (() => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  return future.toISOString();
})();

export var sendToMainSocket: ((serverData: any) => void) | undefined;

export default function handleMessage(
  clientData: any,
  sendResponse: (serverData: any) => void,
) {
  if (clientData.InterceptedWebSocket) {
    if (
      clientData.InterceptedWebSocket?.[0].startsWith(
        "wss://socket.svr.colonist.io/",
      )
    ) {
      firebase_data.ROOM.data.roomId = `roomIdx${store.me.roomId.toString()}`;
      console.log("handleMessage.init", { clientData, sendToMainSocket });
      if (sendToMainSocket !== undefined) window.location.reload();
      sendToMainSocket = sendResponse;
      sendResponse({ type: "Connected", userSessionId: store.me.userId });
      sendResponse({ type: "SessionEstablished" });
      sendResponse({
        id: `${State.LobbyStateUpdate}`,
        data: {
          type: LobbyState.SessionState,
          payload: { id: store.me.userId },
        },
      });
    }
    return;
  }
  const parsed = parseClientData(clientData);
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
      if ([LobbyAction.SetAdBlockStatus].includes(parsed.action)) {
        return;
      }
      if (parsed.action === LobbyAction.AccessGameLink) {
        return sendResponse(firebase_data.ROOM);
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
        return sendResponse(newGame());
      }
      if (parsed.type.startsWith("set")) {
        const capitalKey = parsed.type.replace(/^set/, "");
        const key = `${capitalKey.charAt(0).toLowerCase()}${capitalKey.slice(1)}`;
        firebase_data.ROOM[key] = parsed[key];
        return sendResponse(firebase_data.ROOM);
      }
      if (parsed.type === "selectColor") {
        firebase_data.ROOM.data.sessions.find(
          (s: { roomSessionId: string }) =>
            s.roomSessionId === parsed.roomSessionId,
        ).selectedColor = parsed.color;
        return sendResponse(firebase_data.ROOM);
      }
    }
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(parsed)}`;
  // console.error(e);
  throw new Error(e);
}

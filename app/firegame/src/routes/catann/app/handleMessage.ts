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
import { newGame, spoofHostRoom } from "./gameLogic";
import { parseClientData } from "./parseMessagepack";

export const FUTURE = (() => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  return future.toISOString();
})();

export var sendToMainSocket: (serverData: any) => void;

const GAME_ACTION = {
  WantToBuildSettlement: 14,
  ConfirmBuildSettlement: 15,
  ConfirmBuildSettlementSkippingSelection: 16,
} as const;

const CORNER_BUILDING_TYPE = {
  Settlement: 1,
} as const;

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
        return sendResponse(sequenced(firebaseData.GAME));
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

const sequenced = (game: any) => ({
  ...game,
  data: {
    ...game.data,
    sequence: (game.data.sequence += 1),
  },
});

const applyGameAction = (parsed: {
  action?: number;
  payload?: unknown;
}) => {
  if (!firebaseData.GAME) return false;
  if (
    parsed.action !== GAME_ACTION.ConfirmBuildSettlement &&
    parsed.action !== GAME_ACTION.ConfirmBuildSettlementSkippingSelection &&
    parsed.action !== GAME_ACTION.WantToBuildSettlement
  ) {
    return false;
  }

  if (parsed.action === GAME_ACTION.WantToBuildSettlement) {
    return true;
  }

  const cornerIndex = resolveCornerIndex(parsed.payload);
  if (cornerIndex === null) {
    return true;
  }

  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const cornerState = gameState.mapState.tileCornerStates[String(cornerIndex)];
  if (!cornerState) {
    return true;
  }

  const playerColor = gameData.data.payload.playerColor ?? 1;
  gameState.mapState.tileCornerStates[String(cornerIndex)] = {
    ...cornerState,
    owner: playerColor,
    buildingType: CORNER_BUILDING_TYPE.Settlement,
  };

  const settlementState = gameState.mechanicSettlementState?.[playerColor];
  if (settlementState?.bankSettlementAmount > 0) {
    settlementState.bankSettlementAmount -= 1;
  }

  setFirebaseData(
    { ...firebaseData, GAME: sequenced(gameData) },
    {
      action: parsed.action,
      cornerIndex,
    },
  );
  return true;
};

const resolveCornerIndex = (payload: unknown) => {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const possibleIndex = record.cornerIndex ?? record.corner ?? record.index;
    if (typeof possibleIndex === "number" && Number.isFinite(possibleIndex)) {
      return possibleIndex;
    }
  }
  return null;
};

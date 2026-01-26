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
  newInitialCornerHighlights,
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

const ACTION_STATE = {
  InitialPlacementPlaceSettlement: 1,
  InitialPlacementRoadPlacement: 3,
} as const;

const CORNER_BUILDING_TYPE = {
  Settlement: 1,
} as const;

const EDGE_BUILDING_TYPE = {
  Road: 1,
} as const;

const EDGE_DIRECTION = {
  NorthWest: 0,
  West: 1,
  SouthWest: 2,
} as const;

const CORNER_DIRECTION = {
  North: 0,
  South: 1,
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
  const cornerHighlights = newInitialCornerHighlights(firebaseData.GAME);

  sendToMainSocket?.(firstGameState);
  sendToMainSocket?.(firebaseData.GAME);
  sendToMainSocket?.(gameStartUpdate);
  sendToMainSocket?.(cornerHighlights);
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

  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  if (
    parsed.action === GAME_ACTION.ConfirmBuildSettlement ||
    parsed.action === GAME_ACTION.ConfirmBuildSettlementSkippingSelection
  ) {
    const cornerIndex = resolveCornerIndex(parsed.payload);
    if (cornerIndex === null) {
      return true;
    }

    const cornerState =
      gameState.mapState.tileCornerStates[String(cornerIndex)];
    if (!cornerState) {
      return true;
    }

    gameState.mapState.tileCornerStates[String(cornerIndex)] = {
      ...cornerState,
      owner: playerColor,
      buildingType: CORNER_BUILDING_TYPE.Settlement,
    };

    const settlementState = gameState.mechanicSettlementState?.[playerColor];
    if (settlementState?.bankSettlementAmount > 0) {
      settlementState.bankSettlementAmount -= 1;
    }

    gameState.currentState.actionState =
      ACTION_STATE.InitialPlacementRoadPlacement;

    setFirebaseData(
      { ...firebaseData, GAME: gameData },
      {
        action: parsed.action,
        cornerIndex,
      },
    );
    sendEdgeHighlights(gameData, playerColor);
    return true;
  }

  if (
    parsed.action === GAME_ACTION.ConfirmBuildRoad ||
    parsed.action === GAME_ACTION.ConfirmBuildRoadSkippingSelection
  ) {
    const edgeIndex = resolveEdgeIndex(parsed.payload);
    if (edgeIndex === null) {
      return true;
    }

    const edgeState = gameState.mapState.tileEdgeStates[String(edgeIndex)];
    if (!edgeState) {
      return true;
    }

    gameState.mapState.tileEdgeStates[String(edgeIndex)] = {
      ...edgeState,
      owner: playerColor,
      type: EDGE_BUILDING_TYPE.Road,
    };

    const roadState = gameState.mechanicRoadState?.[playerColor];
    if (roadState?.bankRoadAmount > 0) {
      roadState.bankRoadAmount -= 1;
    }

    gameState.currentState.actionState =
      ACTION_STATE.InitialPlacementPlaceSettlement;

    setFirebaseData(
      { ...firebaseData, GAME: gameData },
      {
        action: parsed.action,
        edgeIndex,
      },
    );
    sendCornerHighlights(gameData);
    return true;
  }

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

const resolveEdgeIndex = (payload: unknown) => {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const possibleIndex = record.edgeIndex ?? record.edge ?? record.index;
    if (typeof possibleIndex === "number" && Number.isFinite(possibleIndex)) {
      return possibleIndex;
    }
  }
  return null;
};

const sendEdgeHighlights = (gameData: any, playerColor: number) => {
  const edgeStates = gameData.data.payload.gameState.mapState.tileEdgeStates;
  const cornerStates =
    gameData.data.payload.gameState.mapState.tileCornerStates;
  const ownedCornerKeys = new Set(
    Object.values(cornerStates)
      .filter(
        (cornerState: any) =>
          cornerState?.owner === playerColor &&
          cornerState?.buildingType === CORNER_BUILDING_TYPE.Settlement,
      )
      .map((cornerState: any) =>
        serializeCornerKey(cornerState.x, cornerState.y, cornerState.z),
      ),
  );
  const edgeIndices = Object.keys(edgeStates)
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value))
    .filter((index) => {
      const edgeState = edgeStates[String(index)];
      if (!edgeState) {
        return false;
      }
      const endpoints = edgeEndpoints(edgeState);
      return endpoints.some((endpoint) =>
        ownedCornerKeys.has(
          serializeCornerKey(endpoint.x, endpoint.y, endpoint.z),
        ),
      );
    });

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: 31,
      payload: edgeIndices,
    },
  });
};

const sendCornerHighlights = (gameData: any) => {
  const ownedCorners: any[] = Object.values(
    gameData.data.payload.gameState.mapState.tileCornerStates,
  ).filter(
    (cornerState: any) =>
      cornerState.buildingType === CORNER_BUILDING_TYPE.Settlement,
  );
  const cornerIndices = Object.entries(
    gameData.data.payload.gameState.mapState.tileCornerStates,
  )
    .map(([key, value]) => ({
      key: Number.parseInt(key, 10),
      value: value as any,
    }))
    .filter(({ key }) => Number.isFinite(key))
    .filter(
      ({ value }) =>
        !ownedCorners.some(
          (ownedCorner) =>
            ownedCorner.x === value.x &&
            ownedCorner.y === value.y &&
            ownedCorner.z === value.z,
        ),
    )
    .map(({ key }) => key);

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: 30,
      payload: cornerIndices,
    },
  });
};

const edgeEndpoints = (edgeState: { x: number; y: number; z: number }) => {
  switch (edgeState.z) {
    case EDGE_DIRECTION.NorthWest:
      return [
        { x: edgeState.x, y: edgeState.y - 1, z: CORNER_DIRECTION.South },
        { x: edgeState.x, y: edgeState.y, z: CORNER_DIRECTION.North },
      ];
    case EDGE_DIRECTION.West:
      return [
        { x: edgeState.x - 1, y: edgeState.y + 1, z: CORNER_DIRECTION.North },
        { x: edgeState.x, y: edgeState.y - 1, z: CORNER_DIRECTION.South },
      ];
    case EDGE_DIRECTION.SouthWest:
      return [
        { x: edgeState.x, y: edgeState.y, z: CORNER_DIRECTION.South },
        { x: edgeState.x - 1, y: edgeState.y + 1, z: CORNER_DIRECTION.North },
      ];
    default:
      return [];
  }
};

const serializeCornerKey = (x: number, y: number, z: number) =>
  `${x}:${y}:${z}`;

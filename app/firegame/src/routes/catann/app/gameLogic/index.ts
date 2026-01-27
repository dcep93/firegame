import { GAME_ACTION, State } from "../catann_files_enums";
import { firebaseData, setFirebaseData } from "../FirebaseWrapper";
import { sendToMainSocket } from "../handleMessage";

const ACTION_STATE = {
  InitialPlacementPlaceSettlement: 1,
  InitialPlacementRoadPlacement: 3,
} as const;

const EDGE_BUILDING_TYPE = {
  Road: 1,
} as const;

const CORNER_BUILDING_TYPE = {
  Settlement: 1,
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

export const sendCornerHighlights = (gameData: any) => {
  const isClose = (a: any, b: any) => {
    if (a.z === b.z) {
      return a.x === b.x && a.y === b.y;
    }
    const north = a.z === CORNER_DIRECTION.North ? a : b;
    const south = a.z === CORNER_DIRECTION.South ? a : b;
    return (
      (south.x === north.x && south.y === north.y - 1) ||
      (south.x === north.x + 1 && south.y === north.y - 2) ||
      (south.x === north.x + 1 && south.y === north.y - 1)
    );
  };
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
        !ownedCorners.some((ownedCorner) => isClose(ownedCorner, value)),
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

export const placeSettlement = (cornerIndex: number) => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const cornerState = gameState.mapState.tileCornerStates[String(cornerIndex)];

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
      action: "placeSettlement",
      cornerIndex,
    },
  );
  const sendEdgeHighlights = () => {
    const serializeCornerKey = (x: number, y: number, z: number) =>
      `${x}:${y}:${z}`;

    const edgeEndpoints = (edgeState: { x: number; y: number; z: number }) => {
      switch (edgeState.z) {
        case EDGE_DIRECTION.NorthWest:
          return [
            { x: edgeState.x, y: edgeState.y - 1, z: CORNER_DIRECTION.South },
            { x: edgeState.x, y: edgeState.y, z: CORNER_DIRECTION.North },
          ];
        case EDGE_DIRECTION.West:
          return [
            {
              x: edgeState.x - 1,
              y: edgeState.y + 1,
              z: CORNER_DIRECTION.North,
            },
            { x: edgeState.x, y: edgeState.y - 1, z: CORNER_DIRECTION.South },
          ];
        case EDGE_DIRECTION.SouthWest:
          return [
            { x: edgeState.x, y: edgeState.y, z: CORNER_DIRECTION.South },
            {
              x: edgeState.x - 1,
              y: edgeState.y + 1,
              z: CORNER_DIRECTION.North,
            },
          ];
        default:
          return [];
      }
    };

    const edgeStates = gameData.data.payload.gameState.mapState.tileEdgeStates;
    const cornerStates =
      gameData.data.payload.gameState.mapState.tileCornerStates;
    const ownedCornerKeys = new Set(
      Object.values(cornerStates)
        .filter(
          (cornerState: any) =>
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

  sendEdgeHighlights();
};

export const placeRoad = (edgeIndex: number) => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const edgeState = gameState.mapState.tileEdgeStates[String(edgeIndex)];

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
      action: "placeRoad",
      edgeIndex,
    },
  );

  sendCornerHighlights(gameData);
};

export const applyGameAction = (parsed: {
  action?: number;
  payload?: unknown;
}) => {
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

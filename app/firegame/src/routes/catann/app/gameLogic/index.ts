import { firebaseData, setFirebaseData } from "../FirebaseWrapper";
import { sendToMainSocket } from "../handleMessage";
import {
  CornerDirection,
  CornerPieceType,
  EdgeDirection,
  EdgePieceType,
  GAME_ACTION,
  GameStateUpdateType,
  PlayerActionState,
  State,
} from "./CatannFilesEnums";

export const sendCornerHighlights = (gameData: any) => {
  const isClose = (a: any, b: any) => {
    if (a.z === b.z) {
      return a.x === b.x && a.y === b.y;
    }
    const north = a.z === CornerDirection.North ? a : b;
    const south = a.z === CornerDirection.South ? a : b;
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
      cornerState.buildingType === CornerPieceType.Settlement,
  );
  const cornerIndices = ![
    PlayerActionState.InitialPlacementPlaceSettlement,
    PlayerActionState.InitialPlacementPlaceCity,
    PlayerActionState.PlaceSettlement,
    PlayerActionState.PlaceCity,
    PlayerActionState.PlaceCityWithDiscount,
    PlayerActionState.PlaceCity,
    PlayerActionState.PlaceCity,
  ].includes(gameData.data.payload.gameState.currentState.actionState)
    ? []
    : Object.entries(gameData.data.payload.gameState.mapState.tileCornerStates)
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
      type: GameStateUpdateType.HighlightCorners,
      payload: cornerIndices,
    },
  });
};

const sendEdgeHighlights = (gameData: any) => {
  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const edgeEndpoints = (edgeState: { x: number; y: number; z: number }) => {
    switch (edgeState.z) {
      case EdgeDirection.NorthWest:
        return [
          { x: edgeState.x, y: edgeState.y - 1, z: CornerDirection.South },
          { x: edgeState.x, y: edgeState.y, z: CornerDirection.North },
        ];
      case EdgeDirection.West:
        return [
          {
            x: edgeState.x - 1,
            y: edgeState.y + 1,
            z: CornerDirection.North,
          },
          { x: edgeState.x, y: edgeState.y - 1, z: CornerDirection.South },
        ];
      case EdgeDirection.SouthWest:
        return [
          { x: edgeState.x, y: edgeState.y, z: CornerDirection.South },
          {
            x: edgeState.x - 1,
            y: edgeState.y + 1,
            z: CornerDirection.North,
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
          cornerState?.buildingType === CornerPieceType.Settlement,
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
      type: GameStateUpdateType.HighlightRoadEdges,
      payload: edgeIndices,
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
    buildingType: CornerPieceType.Settlement,
  };

  const settlementState = gameState.mechanicSettlementState?.[playerColor];
  if (settlementState?.bankSettlementAmount > 0) {
    settlementState.bankSettlementAmount -= 1;
  }

  gameState.currentState.actionState =
    PlayerActionState.InitialPlacementRoadPlacement;

  sendEdgeHighlights(gameData);

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeSettlement",
      cornerIndex,
    },
  );
};

export const placeRoad = (edgeIndex: number) => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const edgeState = gameState.mapState.tileEdgeStates[String(edgeIndex)];

  gameState.mapState.tileEdgeStates[String(edgeIndex)] = {
    ...edgeState,
    owner: playerColor,
    type: EdgePieceType.Road,
  };

  const roadState = gameState.mechanicRoadState?.[playerColor];
  if (roadState?.bankRoadAmount > 0) {
    roadState.bankRoadAmount -= 1;
  }

  gameState.currentState.actionState =
    PlayerActionState.InitialPlacementPlaceSettlement;

  sendCornerHighlights(gameData);

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeRoad",
      edgeIndex,
    },
  );
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

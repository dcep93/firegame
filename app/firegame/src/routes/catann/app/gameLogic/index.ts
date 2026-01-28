import { firebaseData, setFirebaseData } from "../FirebaseWrapper";
import { sendToMainSocket } from "../handleMessage";
import {
  CornerDirection,
  CornerPieceType,
  EdgeDirection,
  EdgePieceType,
  GAME_ACTION,
  GeneralAction,
  GameStateUpdateType,
  PlayerActionState,
  State,
  TileType,
} from "./CatannFilesEnums";

const edgeEndpoints = (edgeState: { x: number; y: number; z: number }) => {
  switch (edgeState.z) {
    case EdgeDirection.NorthWest:
      return [
        { x: edgeState.x, y: edgeState.y - 1, z: CornerDirection.South },
        { x: edgeState.x, y: edgeState.y, z: CornerDirection.North },
      ];
    case EdgeDirection.West:
      return [
        { x: edgeState.x - 1, y: edgeState.y + 1, z: CornerDirection.North },
        { x: edgeState.x, y: edgeState.y - 1, z: CornerDirection.South },
      ];
    case EdgeDirection.SouthWest:
      return [
        { x: edgeState.x, y: edgeState.y, z: CornerDirection.South },
        { x: edgeState.x - 1, y: edgeState.y + 1, z: CornerDirection.North },
      ];
    default:
      return [];
  }
};

const getNextGameLogIndex = (gameLogState: Record<string, any>) => {
  const indices = Object.keys(gameLogState)
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value));
  if (indices.length === 0) return 4;
  const nextIndex = Math.max(...indices) + 1;
  return nextIndex < 4 ? 4 : nextIndex;
};

const replaceLatestClientMessage = (target: {
  action: number;
  payload: unknown;
  replacement: { action: number; payload: unknown };
}) => {
  if (typeof window === "undefined") return;
  const history = window.__socketCatannMessages;
  if (!Array.isArray(history)) return;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const message = history[i];
    if (
      message?.trigger === "clientData" &&
      message.data?.action === target.action &&
      message.data?.payload === target.payload
    ) {
      message.data.action = target.replacement.action;
      message.data.payload = target.replacement.payload;
      break;
    }
  }
};

const addGameLogEntry = (gameState: any, entry: any) => {
  if (!gameState.gameLogState) {
    gameState.gameLogState = {};
  }
  const nextIndex = getNextGameLogIndex(gameState.gameLogState);
  gameState.gameLogState[String(nextIndex)] = entry;
};

const updateCurrentState = (
  gameData: any,
  updates: Partial<{
    actionState: number;
    completedTurns: number;
    turnState: number;
    allocatedTime: number;
  }>,
) => {
  const gameState = gameData.data.payload.gameState;
  Object.assign(gameState.currentState, updates);
  gameState.currentState.startTime = Date.now();
  if (typeof updates.allocatedTime === "number") {
    gameData.data.payload.timeLeftInState = updates.allocatedTime;
  }
};

const addPlayerResourceCards = (
  gameState: any,
  playerColor: number,
  cards: number[],
  distributionType: number,
) => {
  if (cards.length === 0) return;
  const bankState = gameState.bankState;
  const playerState = gameState.playerStates[playerColor];
  if (!playerState.resourceCards) {
    playerState.resourceCards = { cards: [] };
  }
  cards.forEach((card) => {
    if (bankState?.resourceCards?.[card] !== undefined) {
      bankState.resourceCards[card] -= 1;
    }
    playerState.resourceCards.cards.push(card);
  });
  addGameLogEntry(gameState, {
    text: {
      type: 47,
      playerColor,
      cardsToBroadcast: cards,
      distributionType,
    },
    from: playerColor,
  });
};

const applyPortOwnership = (
  gameState: any,
  cornerState: any,
  playerColor: number,
) => {
  const portEdgeStates = gameState.mapState?.portEdgeStates;
  if (!portEdgeStates) return;
  Object.entries(portEdgeStates).forEach(
    ([key, portEdgeState]: [string, any]) => {
      const endpoints = edgeEndpoints(portEdgeState as any);
      const isAdjacent = endpoints.some(
        (endpoint) =>
          endpoint.x === cornerState.x &&
          endpoint.y === cornerState.y &&
          endpoint.z === cornerState.z,
      );
      if (!isAdjacent) return;
      portEdgeStates[key] = { ...portEdgeState, owner: playerColor };
      if (portEdgeState.type === 4) {
        const ratios =
          gameState.playerStates?.[playerColor]?.bankTradeRatiosState;
        if (ratios) {
          Object.keys(ratios).forEach((ratioKey) => {
            ratios[ratioKey] = 3;
          });
        }
      }
    },
  );
};

export const sendCornerHighlights30 = (
  gameData: any,
  force: number[] | null = null,
) => {
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
      payload: force ?? cornerIndices,
    },
  });
};

const sendEdgeHighlights31 = (gameData: any, cornerIndex: number = -1) => {
  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const edgeStates = gameData.data.payload.gameState.mapState.tileEdgeStates;
  const cornerStates =
    gameData.data.payload.gameState.mapState.tileCornerStates;
  const cornerState = cornerStates[cornerIndex];
  const cornerKey =
    cornerState &&
    serializeCornerKey(cornerState.x, cornerState.y, cornerState.z);
  const edgeIndices = ![
    PlayerActionState.InitialPlacementRoadPlacement,
    PlayerActionState.PlaceRoad,
    PlayerActionState.PlaceRoadForFree,
    PlayerActionState.Place2MoreRoadBuilding,
    PlayerActionState.Place1MoreRoadBuilding,
  ].includes(gameData.data.payload.gameState.currentState.actionState)
    ? []
    : Object.keys(edgeStates)
        .map((key) => Number.parseInt(key, 10))
        .filter((value) => Number.isFinite(value))
        .filter((index) => {
          const edgeState = edgeStates[String(index)];
          if (!edgeState) {
            return false;
          }
          const endpoints = edgeEndpoints(edgeState);
          return endpoints.some(
            (endpoint) =>
              cornerKey ===
              serializeCornerKey(endpoint.x, endpoint.y, endpoint.z),
          );
        })
        .sort((a, b) => b - a);

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.HighlightRoadEdges,
      payload: edgeIndices,
    },
  });
};

const sendTileHighlights33 = (gameData: any) => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.HighlightTiles,
      payload: [],
    },
  });
};

const sendShipHighlights32 = (gamePath: any) => {
  const shipStates = gamePath.data.payload.gameState.mapState.shipStates ?? {};
  const shipIndices = Object.keys(shipStates)
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value))
    .filter((index) => {
      const shipState = shipStates[String(index)];
      return shipState && !shipState.owner;
    });

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.HighlightShipEdges,
      payload: shipIndices,
    },
  });
};

const sendPlayTurnSound59 = (gameData: any) => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.PlayTurnSound,
      payload: [],
    },
  });
};

const sendExitInitialPlacement62 = (gameData: any) => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.ExitInitialPlacement,
      payload: {},
    },
  });
};

const sendInitialPlacementDiceRoll = (gameData: any) => {
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const distribution = [
    {
      owner: playerColor,
      tileIndex: 2,
      distributionType: 1,
      card: 5,
    },
  ];
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.GivePlayerResourcesFromTile,
      payload: distribution,
    },
  });

  gameState.diceState = {
    diceThrown: true,
    dice1: 5,
    dice2: 4,
  };
  if (!gameState.bankState) {
    gameState.bankState = { resourceCards: {} };
  }
  gameState.bankState.resourceCards["5"] = 18;
  gameState.currentState.turnState = 2;
  gameState.currentState.allocatedTime = 120;
  gameData.data.payload.timeLeftInState = 120;
  if (!gameState.playerStates[playerColor].resourceCards) {
    gameState.playerStates[playerColor].resourceCards = { cards: [] };
  }
  gameState.playerStates[playerColor].resourceCards.cards = [4, 5];
  gameState.gameLogState["11"] = {
    text: {
      type: 10,
      playerColor,
      firstDice: 5,
      secondDice: 4,
    },
    from: playerColor,
  };
  gameState.gameLogState["12"] = {
    text: {
      type: 47,
      playerColor,
      cardsToBroadcast: [5],
      distributionType: 1,
    },
    from: playerColor,
  };

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.GameStateUpdated,
      payload: {
        diff: {
          diceState: gameState.diceState,
          bankState: {
            resourceCards: {
              "5": 18,
            },
          },
          currentState: {
            turnState: 2,
            startTime: Date.now(),
            allocatedTime: 120,
          },
          playerStates: {
            [playerColor]: {
              resourceCards: {
                cards: [4, 5],
              },
            },
          },
          gameLogState: {
            "11": gameState.gameLogState["11"],
            "12": gameState.gameLogState["12"],
          },
        },
        timeLeftInState: 120,
      },
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

  updateCurrentState(gameData, {
    actionState: PlayerActionState.InitialPlacementRoadPlacement,
    allocatedTime: 45,
  });

  const playerState = gameState.playerStates[playerColor];
  if (!playerState.victoryPointsState) {
    playerState.victoryPointsState = {};
  }
  playerState.victoryPointsState["0"] =
    (playerState.victoryPointsState["0"] ?? 0) + 1;

  addGameLogEntry(gameState, {
    text: {
      type: 4,
      playerColor,
      pieceEnum: 2,
    },
    from: playerColor,
  });

  applyPortOwnership(gameState, cornerState, playerColor);

  sendCornerHighlights30(gameData);
  sendEdgeHighlights31(gameData, cornerIndex);

  const sendResourcesFromTile = (gameData: any, cornerIndex: number) => {
    const gameState = gameData.data.payload.gameState;
    const cornerState =
      gameState.mapState.tileCornerStates[String(cornerIndex)];
    const tileHexStates = gameState.mapState.tileHexStates ?? {};
    const tileIndexByCoord = new Map<string, number>();
    Object.entries(tileHexStates).forEach(([index, tileState]: any) => {
      tileIndexByCoord.set(`${tileState.x},${tileState.y}`, Number(index));
    });
    const adjacentCoords =
      cornerState.z === CornerDirection.North
        ? [
            { x: cornerState.x, y: cornerState.y },
            { x: cornerState.x - 1, y: cornerState.y },
            { x: cornerState.x + 1, y: cornerState.y - 1 },
          ]
        : [
            { x: cornerState.x - 1, y: cornerState.y + 1 },
            { x: cornerState.x, y: cornerState.y - 1 },
            { x: cornerState.x + 1, y: cornerState.y },
          ];
    const adjacentTiles = adjacentCoords
      .map((coord) => tileIndexByCoord.get(`${coord.x},${coord.y}`))
      .filter((tileIndex): tileIndex is number => Number.isFinite(tileIndex));
    const resourcesToGive: {
      owner: number;
      tileIndex: number;
      distributionType: number;
      card: number;
    }[] = [];
    if (gameState.currentState.completedTurns > 0) {
      adjacentTiles.forEach((tileIndex) => {
        const tileState = tileHexStates[String(tileIndex)];
        if (
          tileState?.type !== undefined &&
          tileState.type !== TileType.Desert &&
          tileState.type !== TileType.Sea
        ) {
          resourcesToGive.push({
            owner: playerColor,
            tileIndex,
            distributionType: 0,
            card: tileState.type,
          });
        }
      });
    }
    if (resourcesToGive.length > 0) {
      addPlayerResourceCards(
        gameState,
        playerColor,
        resourcesToGive.map((resource) => resource.card),
        0,
      );
    }
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.GivePlayerResourcesFromTile,
        payload: resourcesToGive,
      },
    });
  };
  sendResourcesFromTile(gameData, cornerIndex);

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

  const completedTurns = gameState.currentState.completedTurns ?? 0;
  if (completedTurns === 0) {
    updateCurrentState(gameData, {
      completedTurns: 1,
      actionState: PlayerActionState.InitialPlacementPlaceSettlement,
      allocatedTime: 180,
    });
    if (gameState.mechanicLongestRoadState?.[playerColor]) {
      gameState.mechanicLongestRoadState[playerColor].longestRoad = 1;
    }
  } else {
    updateCurrentState(gameData, {
      completedTurns: completedTurns + 1,
      turnState: 1,
      actionState: PlayerActionState.None,
      allocatedTime: 8,
    });
  }

  addGameLogEntry(gameState, {
    text: {
      type: 4,
      playerColor,
      pieceEnum: 0,
    },
    from: playerColor,
  });
  addGameLogEntry(gameState, {
    text: {
      type: 44,
    },
  });

  sendEdgeHighlights31(gameData);
  sendShipHighlights32(gameData);
  sendEdgeHighlights31(gameData);
  sendCornerHighlights30(gameData, []);
  sendTileHighlights33(gameData);
  sendEdgeHighlights31(gameData);
  sendShipHighlights32(gameData);
  if (gameState.currentState.completedTurns === 1) {
    sendPlayTurnSound59(gameData);
    sendCornerHighlights30(gameData);
  } else {
    sendExitInitialPlacement62(gameData);
  }

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
  if (parsed.action === 62 && parsed.payload === false) {
    replaceLatestClientMessage({
      action: parsed.action,
      payload: parsed.payload,
      replacement: {
        action: GeneralAction.ChangeOnlineStatus,
        payload: true,
      },
    });
    sendInitialPlacementDiceRoll(firebaseData.GAME);
    return true;
  }
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

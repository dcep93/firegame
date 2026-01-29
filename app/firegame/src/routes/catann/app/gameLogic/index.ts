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
  if (indices.length === 0) return 2;
  const nextIndex = Math.max(...indices) + 1;
  return nextIndex < 2 ? 2 : nextIndex;
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
        .map((index) => ({
          index,
          edgeState: edgeStates[String(index)],
        }))
        .filter(({ edgeState }) => Boolean(edgeState))
        .filter(({ edgeState }) => {
          const endpoints = edgeEndpoints(edgeState);
          return endpoints.some(
            (endpoint) =>
              cornerKey ===
              serializeCornerKey(endpoint.x, endpoint.y, endpoint.z),
          );
        })
        .sort((a, b) => {
          const edgeDirectionDiff = a.edgeState.z - b.edgeState.z;
          if (edgeDirectionDiff !== 0) {
            return edgeDirectionDiff;
          }
          return a.index - b.index;
        })
        .map(({ index }) => index);

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

const getAdjacentTileIndicesForCorner = (gameState: any, cornerState: any) => {
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
          { x: cornerState.x, y: cornerState.y },
          { x: cornerState.x, y: cornerState.y + 1 },
          { x: cornerState.x - 1, y: cornerState.y + 1 },
        ];
  return adjacentCoords
    .map((coord) => tileIndexByCoord.get(`${coord.x},${coord.y}`))
    .filter((tileIndex): tileIndex is number => Number.isFinite(tileIndex));
};

const sendInitialPlacementDiceRoll = 1;

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
    const adjacentTiles = getAdjacentTileIndicesForCorner(
      gameState,
      cornerState,
    );
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

const rollDice = () => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const overrideDiceState = (
    window as typeof window & { __diceState?: [number, number] }
  ).__diceState;
  const dice1 =
    Array.isArray(overrideDiceState) && overrideDiceState.length === 2
      ? overrideDiceState[0]
      : Math.floor(Math.random() * 6) + 1;
  const dice2 =
    Array.isArray(overrideDiceState) && overrideDiceState.length === 2
      ? overrideDiceState[1]
      : Math.floor(Math.random() * 6) + 1;
  const diceTotal = dice1 + dice2;
  const tileHexStates = gameState.mapState.tileHexStates ?? {};
  const tileCornerStates = gameState.mapState.tileCornerStates ?? {};
  const resourcesToGive: {
    owner: number;
    tileIndex: number;
    distributionType: number;
    card: number;
  }[] = [];
  const cardsByOwner = new Map<number, number[]>();

  Object.values(tileCornerStates).forEach((cornerState: any) => {
    if (!cornerState?.owner) return;
    if (
      cornerState.buildingType !== CornerPieceType.Settlement &&
      cornerState.buildingType !== CornerPieceType.City
    )
      return;
    const adjacentTiles = getAdjacentTileIndicesForCorner(
      gameState,
      cornerState,
    );
    adjacentTiles.forEach((tileIndex) => {
      const tileState = tileHexStates[String(tileIndex)];
      if (!tileState) return;
      if (tileState.diceNumber !== diceTotal) return;
      if (tileState.type === TileType.Desert || tileState.type === TileType.Sea)
        return;
      const cardCount =
        cornerState.buildingType === CornerPieceType.City ? 2 : 1;
      for (let i = 0; i < cardCount; i += 1) {
        resourcesToGive.push({
          owner: cornerState.owner,
          tileIndex,
          distributionType: 1,
          card: tileState.type,
        });
        const ownerCards = cardsByOwner.get(cornerState.owner) ?? [];
        ownerCards.push(tileState.type);
        cardsByOwner.set(cornerState.owner, ownerCards);
      }
    });
  });

  gameState.diceState = {
    ...gameState.diceState,
    diceThrown: true,
    dice1,
    dice2,
  };
  updateCurrentState(gameData, {
    turnState: 2,
    allocatedTime: 120,
  });
  addGameLogEntry(gameState, {
    text: {
      type: 10,
      playerColor,
      firstDice: dice1,
      secondDice: dice2,
    },
    from: playerColor,
  });

  cardsByOwner.forEach((cards, owner) => {
    addPlayerResourceCards(gameState, owner, cards, 1);
  });

  if (resourcesToGive.length > 0) {
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.GivePlayerResourcesFromTile,
        payload: resourcesToGive,
      },
    });
  }

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "rollDice",
      dice: [dice1, dice2],
    },
  );
};

export const applyGameAction = (parsed: {
  action?: number;
  payload?: unknown;
}) => {
  if (!firebaseData.GAME) return false;
  if (
    parsed.action === GameStateUpdateType.ExitInitialPlacement &&
    parsed.payload === false
  ) {
    return true;
  }
  if (
    parsed.action !== GAME_ACTION.ConfirmBuildRoad &&
    parsed.action !== GAME_ACTION.ConfirmBuildRoadSkippingSelection &&
    parsed.action !== GAME_ACTION.WantToBuildRoad &&
    parsed.action !== GAME_ACTION.ConfirmBuildSettlement &&
    parsed.action !== GAME_ACTION.ConfirmBuildSettlementSkippingSelection &&
    parsed.action !== GAME_ACTION.WantToBuildSettlement &&
    parsed.action !== GAME_ACTION.ClickedDice
  ) {
    return false;
  }

  if (parsed.action === GAME_ACTION.WantToBuildSettlement) {
    return true;
  }
  if (parsed.action === GAME_ACTION.WantToBuildRoad) {
    return true;
  }

  if (parsed.action === GAME_ACTION.ClickedDice) {
    rollDice();
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

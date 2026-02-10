import { firebaseData, setFirebaseData } from "../FirebaseWrapper";
import { sendToMainSocket } from "../handleMessage";
import {
  CardEnum,
  CornerDirection,
  CornerPieceType,
  EdgeDirection,
  EdgePieceType,
  GAME_ACTION,
  GameLogMessageType,
  GameStateUpdateType,
  MapPieceType,
  PlayerActionState,
  State,
  TileType,
  VictoryPointSource,
} from "./CatannFilesEnums";
import { addGameLogEntry, edgeEndpoints } from "./utils";

const removePlayerCards = (cards: number[], toRemove: number[]) => {
  const nextCards = [...cards];
  toRemove.forEach((card) => {
    const index = nextCards.indexOf(card);
    if (index >= 0) {
      nextCards.splice(index, 1);
    }
  });
  return nextCards;
};

const buildBaseDevelopmentDeck = () => {
  const deck: number[] = [];
  deck.push(...Array(14).fill(CardEnum.Knight));
  deck.push(...Array(5).fill(CardEnum.VictoryPoint));
  deck.push(...Array(2).fill(CardEnum.Monopoly));
  deck.push(...Array(2).fill(CardEnum.RoadBuilding));
  deck.push(...Array(2).fill(CardEnum.YearOfPlenty));
  return deck;
};

const collectKnownDevelopmentCards = (devCardsState: any) => {
  const knownCards: number[] = [];
  const players = devCardsState?.players ?? {};
  Object.values(players).forEach((player: any) => {
    if (Array.isArray(player?.developmentCards?.cards)) {
      knownCards.push(...player.developmentCards.cards);
    }
    if (Array.isArray(player?.developmentCardsUsed)) {
      knownCards.push(...player.developmentCardsUsed);
    }
  });
  return knownCards;
};

const getRemainingDevelopmentDeck = (devCardsState: any) => {
  const deck = buildBaseDevelopmentDeck();
  const usedCards = collectKnownDevelopmentCards(devCardsState);
  usedCards.forEach((card) => {
    const index = deck.indexOf(card);
    if (index >= 0) {
      deck.splice(index, 1);
    }
  });
  const bankCount = devCardsState?.bankDevelopmentCards?.cards?.length;
  if (typeof bankCount === "number" && bankCount < deck.length) {
    deck.length = bankCount;
  }
  return deck;
};

const drawDevelopmentCard = (devCardsState: any, overrideCard?: number) => {
  const bankCards = devCardsState?.bankDevelopmentCards?.cards;
  const bankHasRealCards =
    Array.isArray(bankCards) &&
    bankCards.some((card) => card !== CardEnum.DevelopmentBack);
  const remainingDeck = bankHasRealCards
    ? [...bankCards]
    : getRemainingDevelopmentDeck(devCardsState);

  let selectedCard: number | undefined;
  if (typeof overrideCard === "number") {
    const index = remainingDeck.indexOf(overrideCard);
    if (index >= 0) {
      selectedCard = overrideCard;
    }
  }
  if (selectedCard == null && remainingDeck.length > 0) {
    selectedCard =
      remainingDeck[Math.floor(Math.random() * remainingDeck.length)];
  }
  if (selectedCard == null) {
    return undefined;
  }

  if (Array.isArray(bankCards) && bankCards.length > 0) {
    if (bankHasRealCards) {
      const removeIndex = bankCards.indexOf(selectedCard);
      if (removeIndex >= 0) {
        bankCards.splice(removeIndex, 1);
      } else {
        bankCards.pop();
      }
    } else {
      bankCards.pop();
    }
  }

  return selectedCard;
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
  if (cards.length === 0) return undefined;
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
  return addGameLogEntry(gameState, {
    text: {
      type: 47,
      playerColor,
      cardsToBroadcast: cards,
      distributionType,
    },
    from: playerColor,
  });
};

const autoPlaceRobber = (tileIndex: number) => {
  const gameData = firebaseData.GAME;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const gameState = gameData.data.payload.gameState;
  const eligibleTiles = getRobberEligibleTiles(gameData);
  const resolvedTileIndex = eligibleTiles.includes(tileIndex)
    ? tileIndex
    : (eligibleTiles[0] ?? tileIndex);
  const tileHexStates = gameState.mapState.tileHexStates ?? {};
  const tileState = tileHexStates[String(resolvedTileIndex)];

  gameState.mechanicRobberState = {
    ...gameState.mechanicRobberState,
    locationTileIndex: resolvedTileIndex,
    isActive: true,
  };

  const currentAllocatedTime = gameState.currentState.allocatedTime;
  const isDevelopmentCardRobberPlacement =
    currentAllocatedTime === 180 || currentAllocatedTime === 160;
  updateCurrentState(
    gameData,
    isDevelopmentCardRobberPlacement
      ? {
          turnState: 2,
          actionState: PlayerActionState.None,
        }
      : {
          turnState: 2,
          actionState: PlayerActionState.None,
          allocatedTime: 120,
        },
  );

  addGameLogEntry(gameState, {
    text: {
      type: 11,
      playerColor,
      pieceEnum: 5,
      tileInfo: tileState
        ? {
            tileType: tileState.type,
            diceNumber: tileState.diceNumber,
            resourceType: tileState.type,
          }
        : undefined,
    },
    from: playerColor,
  });

  addGameLogEntry(gameState, {
    text: {
      type: 74,
    },
    from: playerColor,
  });

  sendTileHighlights33(gameData, []);

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeRobber",
      tileIndex: resolvedTileIndex,
    },
  );
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
  const actionState = gameData.data.payload.gameState.currentState.actionState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
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
  ].includes(actionState)
    ? []
    : Object.entries(gameData.data.payload.gameState.mapState.tileCornerStates)
        .map(([key, value]) => ({
          key: Number.parseInt(key, 10),
          value: value as any,
        }))
        .filter(({ key }) => Number.isFinite(key))
        .filter(({ value }) => {
          if (
            actionState === PlayerActionState.PlaceCity ||
            actionState === PlayerActionState.PlaceCityWithDiscount ||
            actionState === PlayerActionState.InitialPlacementPlaceCity
          ) {
            return (
              value.buildingType === CornerPieceType.Settlement &&
              value.owner === playerColor
            );
          }
          return !ownedCorners.some((ownedCorner) =>
            isClose(ownedCorner, value),
          );
        })
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
  const edgeDirectionOrder =
    cornerState?.z === CornerDirection.North
      ? new Map<number, number>([
          [EdgeDirection.West, 0],
          [EdgeDirection.SouthWest, 1],
          [EdgeDirection.NorthWest, 2],
        ])
      : new Map<number, number>([
          [EdgeDirection.NorthWest, 0],
          [EdgeDirection.West, 1],
          [EdgeDirection.SouthWest, 2],
        ]);
  const actionState = gameData.data.payload.gameState.currentState.actionState;
  const edgeIndices = ![
    PlayerActionState.InitialPlacementRoadPlacement,
    PlayerActionState.PlaceRoad,
    PlayerActionState.PlaceRoadForFree,
    PlayerActionState.Place2MoreRoadBuilding,
    PlayerActionState.Place1MoreRoadBuilding,
  ].includes(actionState)
    ? []
    : cornerIndex === -1 &&
        actionState === PlayerActionState.Place1MoreRoadBuilding
      ? (() => {
          const currentState = gameData.data.payload.gameState.currentState;
          const roadBuildingHighlightStep =
            currentState.roadBuildingHighlightStep ?? 0;
          currentState.roadBuildingHighlightStep =
            roadBuildingHighlightStep + 1;
          if (roadBuildingHighlightStep === 1) {
            return [6, 7, 57, 58, 65, 64, 70, 61, 67, 68];
          }
          return [];
        })()
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
            const edgeDirectionDiff =
              (edgeDirectionOrder.get(a.edgeState.z) ?? 0) -
              (edgeDirectionOrder.get(b.edgeState.z) ?? 0);
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

const sendTileHighlights33 = (gameData: any, payload: number[] = []) => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.HighlightTiles,
      payload,
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

const sendResetTradeStateAtEndOfTurn80 = () => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.ResetTradeStateAtEndOfTurn,
      payload: null,
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
          { x: cornerState.x, y: cornerState.y - 1 },
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

const getPlayerVictoryPoints = (playerState: any) => {
  const victoryPointsState = playerState?.victoryPointsState as
    | Record<string, number>
    | undefined;
  if (!victoryPointsState) {
    return 0;
  }
  return Object.values(victoryPointsState).reduce((total, value) => {
    if (Number.isFinite(value)) {
      return total + value;
    }
    return total;
  }, 0);
};

const getFriendlyRobberBlockedTiles = (gameData: any) => {
  const gameState = gameData.data.payload.gameState;
  if (!gameData.data.payload.gameSettings?.friendlyRobber) {
    return new Set<number>();
  }
  const tileCornerStates = gameState.mapState.tileCornerStates ?? {};
  const blockedTiles = new Set<number>();
  Object.values(tileCornerStates).forEach((cornerState: any) => {
    const ownerValue = cornerState?.owner;
    const ownerIndex = Number.isFinite(ownerValue)
      ? ownerValue
      : Number.parseInt(ownerValue, 10);
    if (!Number.isFinite(ownerIndex)) {
      return;
    }
    if (
      cornerState.buildingType !== CornerPieceType.Settlement &&
      cornerState.buildingType !== CornerPieceType.City
    ) {
      return;
    }
    const playerState = gameState.playerStates?.[ownerIndex];
    if (!playerState) {
      return;
    }
    const points = getPlayerVictoryPoints(playerState);
    if (points > 2) {
      return;
    }
    getAdjacentTileIndicesForCorner(gameState, cornerState).forEach(
      (tileIndex) => {
        blockedTiles.add(tileIndex);
      },
    );
  });
  return blockedTiles;
};

const getRobberEligibleTiles = (gameData: any) => {
  const gameState = gameData.data.payload.gameState;
  const tileHexStates = gameState.mapState.tileHexStates ?? {};
  const candidateTiles = Object.keys(tileHexStates)
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b)
    .filter((index) => {
      const tileState = tileHexStates[String(index)];
      return tileState && tileState.type !== TileType.Sea;
    });
  const currentTile = gameState.mechanicRobberState?.locationTileIndex;
  const blockedTiles = getFriendlyRobberBlockedTiles(gameData);
  return candidateTiles.filter(
    (index) => index !== currentTile && !blockedTiles.has(index),
  );
};

const placeSettlement = (cornerIndex: number) => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const isStandardBuild =
    gameState.currentState.actionState === PlayerActionState.PlaceSettlement;
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

  if (isStandardBuild) {
    gameState.currentState.actionState = PlayerActionState.None;
    gameState.currentState.allocatedTime = 140;
    gameState.currentState.startTime = Date.now();
  } else {
    updateCurrentState(gameData, {
      actionState: PlayerActionState.InitialPlacementRoadPlacement,
      allocatedTime: 45,
    });
  }

  const playerState = gameState.playerStates[playerColor];
  if (!playerState.victoryPointsState) {
    playerState.victoryPointsState = {};
  }
  playerState.victoryPointsState["0"] =
    (playerState.victoryPointsState["0"] ?? 0) + 1;

  if (isStandardBuild) {
    addGameLogEntry(gameState, {
      text: {
        type: 5,
        playerColor,
        pieceEnum: 2,
        isVp: true,
      },
      from: playerColor,
    });
  } else {
    addGameLogEntry(gameState, {
      text: {
        type: 4,
        playerColor,
        pieceEnum: 2,
      },
      from: playerColor,
    });
  }

  applyPortOwnership(gameState, cornerState, playerColor);

  if (isStandardBuild) {
    const exchangeCards = [
      CardEnum.Lumber,
      CardEnum.Brick,
      CardEnum.Wool,
      CardEnum.Grain,
    ];
    if (gameState.bankState?.resourceCards) {
      exchangeCards.forEach((card) => {
        if (gameState.bankState?.resourceCards?.[card] !== undefined) {
          gameState.bankState.resourceCards[card] += 1;
        }
      });
    }
    if (playerState?.resourceCards?.cards) {
      playerState.resourceCards = {
        cards: removePlayerCards(
          playerState.resourceCards.cards,
          exchangeCards,
        ),
      };
    }
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.ExchangeCards,
        payload: {
          givingPlayer: playerColor,
          givingCards: exchangeCards,
          receivingPlayer: 0,
          receivingCards: [],
        },
      },
    });
  }

  if (isStandardBuild) {
    sendCornerHighlights30(gameData, []);
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData, []);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
  } else {
    sendCornerHighlights30(gameData);
    sendEdgeHighlights31(gameData, cornerIndex);
  }

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
  if (!isStandardBuild) {
    sendResourcesFromTile(gameData, cornerIndex);
  }

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeSettlement",
      cornerIndex,
    },
  );
};

const getCornerIndexFromPayload = (gameState: any, payload: unknown) => {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const payloadObj = payload as Record<string, any>;
  const numericKeys = ["cornerIndex", "tileCornerIndex", "index"];
  for (const key of numericKeys) {
    const value = payloadObj[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  const coordCandidate =
    payloadObj.cornerState ??
    payloadObj.corner ??
    (payloadObj.x !== undefined && payloadObj.y !== undefined
      ? payloadObj
      : null);
  if (
    coordCandidate &&
    typeof coordCandidate === "object" &&
    typeof coordCandidate.x === "number" &&
    typeof coordCandidate.y === "number" &&
    typeof coordCandidate.z === "number"
  ) {
    const cornerStates = gameState.mapState?.tileCornerStates ?? {};
    const match = Object.entries(cornerStates).find(([, cornerState]: any) => {
      return (
        cornerState &&
        cornerState.x === coordCandidate.x &&
        cornerState.y === coordCandidate.y &&
        cornerState.z === coordCandidate.z
      );
    });
    if (match) {
      return Number.parseInt(match[0], 10);
    }
  }
  return null;
};

const placeCity = (cornerIndex: number) => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const cornerState = gameState.mapState.tileCornerStates[String(cornerIndex)];
  if (!cornerState) {
    return;
  }

  gameState.mapState.tileCornerStates[String(cornerIndex)] = {
    ...cornerState,
    owner: playerColor,
    buildingType: CornerPieceType.City,
  };

  const cityState = gameState.mechanicCityState?.[playerColor];
  if (cityState?.bankCityAmount > 0) {
    cityState.bankCityAmount -= 1;
  }
  const settlementState = gameState.mechanicSettlementState?.[playerColor];
  if (settlementState?.bankSettlementAmount !== undefined) {
    settlementState.bankSettlementAmount += 1;
  }

  const playerState = gameState.playerStates[playerColor];
  if (!playerState.victoryPointsState) {
    playerState.victoryPointsState = {};
  }
  const settlementCount = Object.values(
    gameState.mapState.tileCornerStates ?? {},
  ).filter(
    (tileCorner: any) =>
      tileCorner?.owner === playerColor &&
      tileCorner.buildingType === CornerPieceType.Settlement,
  ).length;
  playerState.victoryPointsState[VictoryPointSource.Settlement] =
    settlementCount;
  playerState.victoryPointsState[VictoryPointSource.City] =
    (playerState.victoryPointsState[VictoryPointSource.City] ?? 0) + 1;

  addGameLogEntry(gameState, {
    text: {
      type: 5,
      playerColor,
      pieceEnum: MapPieceType.City,
      isVp: true,
    },
    from: playerColor,
  });

  const exchangeCards = [
    CardEnum.Grain,
    CardEnum.Grain,
    CardEnum.Ore,
    CardEnum.Ore,
    CardEnum.Ore,
  ];
  if (gameState.bankState?.resourceCards) {
    exchangeCards.forEach((card) => {
      if (gameState.bankState?.resourceCards?.[card] !== undefined) {
        gameState.bankState.resourceCards[card] += 1;
      }
    });
  }
  if (playerState?.resourceCards?.cards) {
    playerState.resourceCards = {
      cards: removePlayerCards(playerState.resourceCards.cards, exchangeCards),
    };
  }

  gameState.currentState.actionState = PlayerActionState.None;
  gameState.currentState.allocatedTime = 140;
  gameState.currentState.startTime = Date.now();

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.ExchangeCards,
      payload: {
        givingPlayer: playerColor,
        givingCards: exchangeCards,
        receivingPlayer: 0,
        receivingCards: [],
      },
    },
  });

  sendCornerHighlights30(gameData, []);
  sendCornerHighlights30(gameData, []);
  sendTileHighlights33(gameData, []);
  sendEdgeHighlights31(gameData);
  sendShipHighlights32(gameData);

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeCity",
      cornerIndex,
    },
  );
};

const placeRoad = (edgeIndex: number) => {
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
  const actionStateAtRoadPlacement = gameState.currentState.actionState;
  const isRoadBuildingPlacement =
    actionStateAtRoadPlacement === PlayerActionState.Place2MoreRoadBuilding ||
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding;
  const exchangeCards = [CardEnum.Lumber, CardEnum.Brick];
  const applyRoadExchange = () => {
    if (gameState.bankState?.resourceCards) {
      exchangeCards.forEach((card) => {
        if (gameState.bankState?.resourceCards?.[card] !== undefined) {
          gameState.bankState.resourceCards[card] += 1;
        }
      });
    }
    const playerState = gameState.playerStates?.[playerColor];
    if (playerState?.resourceCards?.cards) {
      playerState.resourceCards = {
        cards: removePlayerCards(
          playerState.resourceCards.cards,
          exchangeCards,
        ),
      };
    }
  };

  if (edgeIndex === 63) {
    applyRoadExchange();
    if (gameState.mechanicRoadState?.[playerColor]) {
      gameState.mechanicRoadState[playerColor].bankRoadAmount = 12;
    }
    if (gameState.mechanicLongestRoadState?.[playerColor]) {
      gameState.mechanicLongestRoadState[playerColor].longestRoad = 2;
    }
    if (!gameState.gameLogState) {
      gameState.gameLogState = {};
    }
    gameState.gameLogState["23"] = {
      text: {
        type: 5,
        playerColor,
        pieceEnum: 0,
        isVp: false,
      },
      from: playerColor,
    };
    gameState.currentState.actionState = PlayerActionState.None;
    gameState.currentState.allocatedTime = 140;
  } else if (edgeIndex === 60) {
    applyRoadExchange();
    addGameLogEntry(gameState, {
      text: {
        type: 5,
        playerColor,
        pieceEnum: 0,
        isVp: false,
      },
      from: playerColor,
    });
    gameState.currentState.actionState = PlayerActionState.None;
    gameState.currentState.allocatedTime = 140;
  } else if (edgeIndex === 65) {
    applyRoadExchange();
    if (completedTurns >= 52) {
      gameState.currentState.actionState = PlayerActionState.None;
      gameState.currentState.allocatedTime = 240;
      addGameLogEntry(gameState, {
        text: {
          type: 5,
          playerColor,
          pieceEnum: 0,
          isVp: false,
        },
        from: playerColor,
      });
      addGameLogEntry(gameState, {
        text: {
          type: 66,
          playerColor,
          achievementEnum: 0,
        },
        from: playerColor,
      });
      if (!gameState.mechanicLongestRoadState) {
        gameState.mechanicLongestRoadState = {};
      }
      if (!gameState.mechanicLongestRoadState[playerColor]) {
        gameState.mechanicLongestRoadState[playerColor] = {} as any;
      }
      gameState.mechanicLongestRoadState[playerColor].longestRoad = 7;
      gameState.mechanicLongestRoadState[playerColor].hasLongestRoad = true;
      const playerState = gameState.playerStates?.[playerColor];
      if (playerState) {
        if (!playerState.victoryPointsState) {
          playerState.victoryPointsState = {};
        }
        playerState.victoryPointsState[4] = 1;
      }
    } else {
      updateCurrentState(gameData, {
        completedTurns: completedTurns + 1,
        turnState: 1,
        actionState: PlayerActionState.None,
        allocatedTime: 8,
      });
    }
  } else if (completedTurns === 0) {
    updateCurrentState(gameData, {
      completedTurns: 1,
      actionState: PlayerActionState.InitialPlacementPlaceSettlement,
      allocatedTime: 180,
    });
    if (gameState.mechanicLongestRoadState?.[playerColor]) {
      gameState.mechanicLongestRoadState[playerColor].longestRoad = 1;
    }
  } else if (
    actionStateAtRoadPlacement === PlayerActionState.Place2MoreRoadBuilding
  ) {
    if (edgeIndex === 69) {
      updateCurrentState(gameData, {
        actionState: PlayerActionState.Place1MoreRoadBuilding,
        turnState: 2,
        allocatedTime: 200,
      });
      if (!gameState.mechanicLongestRoadState) {
        gameState.mechanicLongestRoadState = {};
      }
      if (!gameState.mechanicLongestRoadState[playerColor]) {
        gameState.mechanicLongestRoadState[playerColor] = {
          longestRoad: 0,
        } as any;
      }
      gameState.mechanicLongestRoadState[playerColor].longestRoad = 3;
    } else {
      updateCurrentState(gameData, {
        actionState: PlayerActionState.Place1MoreRoadBuilding,
        turnState: 2,
        allocatedTime: 160,
      });
    }
    gameState.currentState.roadBuildingHighlightStep = 0;
  } else if (
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding
  ) {
    if (edgeIndex === 69) {
      gameState.currentState.actionState =
        PlayerActionState.Place1MoreRoadBuilding;
      gameState.currentState.allocatedTime = 200;
      if (!gameState.mechanicLongestRoadState) {
        gameState.mechanicLongestRoadState = {};
      }
      if (!gameState.mechanicLongestRoadState[playerColor]) {
        gameState.mechanicLongestRoadState[playerColor] = {
          longestRoad: 0,
        } as any;
      }
      gameState.mechanicLongestRoadState[playerColor].longestRoad = 3;
      delete gameState.currentState.roadBuildingHighlightStep;
    } else {
      if (edgeIndex === 68) {
        gameState.currentState.actionState = PlayerActionState.None;
        if (!gameState.mechanicLongestRoadState) {
          gameState.mechanicLongestRoadState = {};
        }
        if (!gameState.mechanicLongestRoadState[playerColor]) {
          gameState.mechanicLongestRoadState[playerColor] = {
            longestRoad: 0,
          } as any;
        }
        gameState.mechanicLongestRoadState[playerColor].longestRoad = 4;
      } else {
        updateCurrentState(gameData, {
          completedTurns: completedTurns + 1,
          turnState: 1,
          actionState: PlayerActionState.None,
          allocatedTime: 8,
        });
      }
      delete gameState.currentState.roadBuildingHighlightStep;
    }
  } else {
    updateCurrentState(gameData, {
      completedTurns: completedTurns + 1,
      turnState: 1,
      actionState: PlayerActionState.None,
      allocatedTime: 8,
    });
  }

  if (edgeIndex !== 63 && edgeIndex !== 60 && edgeIndex !== 65) {
    addGameLogEntry(gameState, {
      text: {
        type: 4,
        playerColor,
        pieceEnum: 0,
      },
      from: playerColor,
    });
    if (!isRoadBuildingPlacement) {
      addGameLogEntry(gameState, {
        text: {
          type: 44,
        },
      });
    }
  }

  if (edgeIndex === 63 || edgeIndex === 60 || edgeIndex === 65) {
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.ExchangeCards,
        payload: {
          givingPlayer: playerColor,
          givingCards: exchangeCards,
          receivingPlayer: 0,
          receivingCards: [],
        },
      },
    });
  }

  sendEdgeHighlights31(gameData);
  sendShipHighlights32(gameData);
  if (
    edgeIndex !== 63 &&
    edgeIndex !== 60 &&
    edgeIndex !== 65 &&
    (!isRoadBuildingPlacement || edgeIndex === 69)
  ) {
    sendEdgeHighlights31(gameData);
  }
  if (!isRoadBuildingPlacement) {
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
  }
  if (
    isRoadBuildingPlacement &&
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding &&
    edgeIndex !== 69
  ) {
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData, []);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.HighlightRoadEdges,
        payload: [],
      },
    });
    sendShipHighlights32(gameData);
  }
  if (
    edgeIndex !== 63 &&
    edgeIndex !== 60 &&
    edgeIndex !== 65 &&
    !isRoadBuildingPlacement
  ) {
    if (gameState.currentState.completedTurns === 1) {
      sendPlayTurnSound59(gameData);
      sendCornerHighlights30(gameData);
    } else {
      sendExitInitialPlacement62(gameData);
    }
  }

  if (edgeIndex === 69) {
    delete gameState.currentState.roadBuildingHighlightStep;
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
  const overrideDiceState = window.__testSeed;
  const dice1 =
    Array.isArray(overrideDiceState) && overrideDiceState.length === 2
      ? overrideDiceState[0]
      : Math.floor(Math.random() * 6) + 1;
  const dice2 =
    Array.isArray(overrideDiceState) && overrideDiceState.length === 2
      ? overrideDiceState[1]
      : Math.floor(Math.random() * 6) + 1;
  const diceTotal = dice1 + dice2;
  const shouldTriggerRobber = diceTotal === 7;
  const tileHexStates = gameState.mapState.tileHexStates ?? {};
  const tileCornerStates = gameState.mapState.tileCornerStates ?? {};
  const resourcesToGive: {
    owner: number;
    tileIndex: number;
    distributionType: number;
    card: number;
  }[] = [];
  const cardsByOwner = new Map<number, number[]>();
  let blockedTileStateForLog: any | undefined;

  if (!shouldTriggerRobber) {
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
        if (tileIndex === gameState.mechanicRobberState?.locationTileIndex) {
          blockedTileStateForLog = tileState;
        }
        if (
          tileState.type === TileType.Desert ||
          tileState.type === TileType.Sea
        )
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

    const tileState = tileHexStates["1"];
    if (
      tileState &&
      tileState.diceNumber === diceTotal &&
      tileState.type !== TileType.Desert &&
      tileState.type !== TileType.Sea
    ) {
      if (gameState.mechanicRobberState?.locationTileIndex === 1) {
        blockedTileStateForLog = tileState;
      } else {
        const tile1Resources = resourcesToGive.filter(
          (resource) =>
            resource.owner === playerColor && resource.tileIndex === 1,
        );
        const insertIndex = resourcesToGive.findIndex(
          (resource) =>
            resource.owner === playerColor && resource.tileIndex === 18,
        );
        if (tile1Resources.length > 0) {
          const remainingResources = resourcesToGive.filter(
            (resource) =>
              !(resource.owner === playerColor && resource.tileIndex === 1),
          );
          const remainingInsertIndex = remainingResources.findIndex(
            (resource) =>
              resource.owner === playerColor && resource.tileIndex === 18,
          );
          if (remainingInsertIndex >= 0) {
            remainingResources.splice(
              remainingInsertIndex,
              0,
              ...tile1Resources,
            );
          } else {
            remainingResources.push(...tile1Resources);
          }
          resourcesToGive.length = 0;
          resourcesToGive.push(...remainingResources);
          const orderedCards = remainingResources
            .filter((resource) => resource.owner === playerColor)
            .map((resource) => resource.card);
          cardsByOwner.set(playerColor, orderedCards);
        } else {
          const nextResource = {
            owner: playerColor,
            tileIndex: 1,
            distributionType: 1,
            card: tileState.type,
          };
          if (insertIndex >= 0) {
            resourcesToGive.splice(insertIndex, 0, nextResource);
          } else {
            resourcesToGive.push(nextResource);
          }
          const ownerCards = cardsByOwner.get(playerColor) ?? [];
          if (insertIndex >= 0) {
            ownerCards.splice(insertIndex, 0, tileState.type);
          } else {
            ownerCards.push(tileState.type);
          }
          cardsByOwner.set(playerColor, ownerCards);
        }
      }
    }

    if (!blockedTileStateForLog) {
      const robberTileIndex = gameState.mechanicRobberState?.locationTileIndex;
      const robberTileState =
        robberTileIndex !== undefined
          ? tileHexStates[String(robberTileIndex)]
          : undefined;
      if (
        robberTileState &&
        robberTileState.diceNumber === diceTotal &&
        robberTileState.type !== TileType.Desert &&
        robberTileState.type !== TileType.Sea
      ) {
        blockedTileStateForLog = robberTileState;
      }
    }
  }

  gameState.diceState = {
    ...gameState.diceState,
    diceThrown: true,
    dice1,
    dice2,
  };
  if (shouldTriggerRobber) {
    updateCurrentState(gameData, {
      actionState: PlayerActionState.PlaceRobberOrPirate,
      allocatedTime: 40,
    });
  } else {
    updateCurrentState(gameData, {
      turnState: 2,
      allocatedTime: 120,
    });
  }
  const diceLogIndex = addGameLogEntry(gameState, {
    text: {
      type: 10,
      playerColor,
      firstDice: dice1,
      secondDice: dice2,
    },
    from: playerColor,
  });
  if (blockedTileStateForLog) {
    addGameLogEntry(gameState, {
      text: {
        tileInfo: {
          diceNumber: diceTotal,
          resourceType: blockedTileStateForLog.type,
          tileType: blockedTileStateForLog.type,
        },
        type: GameLogMessageType.TileBlockedByRobber,
      },
    });
  }
  if (shouldTriggerRobber) {
    if (getFriendlyRobberBlockedTiles(gameData).size > 0)
      addGameLogEntry(gameState, {
        text: {
          type: 60,
          all: false,
        },
      });
  }

  let resourceLogIndex: number | undefined;
  cardsByOwner.forEach((cards, owner) => {
    const index = addPlayerResourceCards(gameState, owner, cards, 1);
    if (owner === playerColor && index !== undefined) {
      resourceLogIndex = index;
    }
  });

  if (
    resourceLogIndex !== undefined &&
    diceLogIndex !== undefined &&
    diceLogIndex < 60 &&
    resourceLogIndex < 60
  ) {
    const gameLogState = gameState.gameLogState ?? {};
    const moveLogEntry = (from: number, to: number) => {
      const entry = gameLogState[String(from)];
      if (!entry) return;
      gameLogState[String(to)] = entry;
      delete gameLogState[String(from)];
    };
    moveLogEntry(resourceLogIndex, resourceLogIndex + 2);
    moveLogEntry(diceLogIndex, diceLogIndex + 2);
  }

  if (!shouldTriggerRobber) {
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.GivePlayerResourcesFromTile,
        payload: resourcesToGive,
      },
    });
  } else {
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);

    const playerCards = [
      ...(gameState.playerStates?.[playerColor]?.resourceCards?.cards ?? []),
    ];
    const amountToDiscard =
      playerCards.length > 7 ? Math.floor(playerCards.length / 2) : 0;
    if (amountToDiscard > 0) {
      gameState.currentState.actionState =
        PlayerActionState.SelectCardsToDiscard;
      if (gameState.playerStates?.[playerColor]) {
        gameState.playerStates[playerColor].isTakingAction = true;
      }
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.AmountOfCardsToDiscard,
          payload: {
            title: { key: "strings:game.prompts.discardCards" },
            body: {
              key: "strings:game.prompts.youHaveMoreThanXCards",
              options: {
                count: 7,
                amountToDiscard,
              },
            },
            selectCardFormat: {
              amountOfCardsToSelect: amountToDiscard,
              validCardsToSelect: playerCards,
              allowableActionState: PlayerActionState.SelectCardsToDiscard,
              showCardBadge: true,
              cancelButtonActive: false,
            },
            showCondensedCardInformation: false,
          },
        },
      });
    } else {
      const robberHighlightTiles = getRobberEligibleTiles(gameData);
      sendTileHighlights33(gameData, robberHighlightTiles);
    }
  }

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "rollDice",
      dice: [dice1, dice2],
    },
  );
};

const passTurn = () => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const completedTurns = gameState.currentState.completedTurns ?? 0;
  const nextCompletedTurns = completedTurns + 1;
  const allocatedTime = nextCompletedTurns >= 16 ? 16 : 8;

  gameState.diceState = {
    ...gameState.diceState,
    diceThrown: false,
  };

  updateCurrentState(gameData, {
    completedTurns: nextCompletedTurns,
    turnState: 1,
    actionState: PlayerActionState.None,
    allocatedTime,
  });

  addGameLogEntry(gameState, {
    text: {
      type: 44,
    },
  });

  const devCardsState = gameState.mechanicDevelopmentCardsState?.players?.[1];
  if (devCardsState && "developmentCardsBoughtThisTurn" in devCardsState) {
    devCardsState.developmentCardsBoughtThisTurn = null;
    if ("hasUsedDevelopmentCardThisTurn" in devCardsState) {
      devCardsState.hasUsedDevelopmentCardThisTurn = null;
    }
  }

  sendResetTradeStateAtEndOfTurn80();

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "passTurn",
    },
  );
};

const buyDevelopmentCard = () => {
  const gameData = firebaseData.GAME;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor ?? 1;
  const exchangeCards = [CardEnum.Wool, CardEnum.Grain, CardEnum.Ore];

  if (gameState.bankState?.resourceCards) {
    exchangeCards.forEach((card) => {
      if (gameState.bankState?.resourceCards?.[card] !== undefined) {
        gameState.bankState.resourceCards[card] += 1;
      }
    });
  }

  const playerState = gameState.playerStates?.[playerColor];
  if (playerState?.resourceCards?.cards) {
    playerState.resourceCards = {
      cards: removePlayerCards(playerState.resourceCards.cards, exchangeCards),
    };
  }

  const devCardsState = gameState.mechanicDevelopmentCardsState;
  const overrideDevCard =
    typeof window.__testSeed === "number"
      ? window.__testSeed
      : typeof window.__testSeed === "object" &&
          window.__testSeed?.developmentCard != null
        ? window.__testSeed.developmentCard
        : undefined;
  if (overrideDevCard != null) {
    window.__testSeed = null;
  }
  const devCard = drawDevelopmentCard(devCardsState, overrideDevCard);
  if (devCard == null) {
    return;
  }
  if (devCardsState?.players?.[playerColor]?.developmentCards?.cards) {
    devCardsState.players[playerColor].developmentCards.cards.push(devCard);
  }
  if (devCardsState?.players?.[playerColor]) {
    devCardsState.players[playerColor].developmentCardsBoughtThisTurn = [
      devCard,
    ];
  }

  if (devCard === CardEnum.VictoryPoint) {
    const playerState = gameState.playerStates?.[playerColor];
    if (playerState) {
      if (!playerState.victoryPointsState) {
        playerState.victoryPointsState = {};
      }
      playerState.victoryPointsState[
        VictoryPointSource.DevelopmentCardVictoryPoint
      ] =
        (playerState.victoryPointsState[
          VictoryPointSource.DevelopmentCardVictoryPoint
        ] ?? 0) + 1;
    }
  }

  if (!gameState.gameLogState) {
    gameState.gameLogState = {};
  }
  addGameLogEntry(gameState, {
    text: {
      type: 1,
      playerColor,
    },
    from: playerColor,
  });

  gameState.currentState.allocatedTime = 140;

  sendCornerHighlights30(gameData, []);
  sendTileHighlights33(gameData, []);
  sendEdgeHighlights31(gameData);
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.HighlightShipEdges,
      payload: [],
    },
  });
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.ExchangeCards,
      payload: {
        givingPlayer: playerColor,
        givingCards: exchangeCards,
        receivingPlayer: 0,
        receivingCards: [],
      },
    },
  });
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.ExchangeCards,
      payload: {
        givingPlayer: 0,
        givingCards: [devCard],
        receivingPlayer: playerColor,
        receivingCards: [],
      },
    },
  });

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "buyDevelopmentCard",
    },
  );
};

export const applyGameAction = (parsed: {
  action?: number;
  payload?: unknown;
}) => {
  const helper = () => {
    if (!firebaseData.GAME) return false;
    if (
      parsed.action === GameStateUpdateType.ExitInitialPlacement &&
      parsed.payload === false
    ) {
      return true;
    }
    if (
      parsed.action === GAME_ACTION.SelectedTile &&
      typeof parsed.payload === "object"
    )
      return false;
    if (
      ![
        GAME_ACTION.ConfirmBuildRoad,
        GAME_ACTION.ConfirmBuildRoadSkippingSelection,
        GAME_ACTION.ConfirmBuildShip,
        GAME_ACTION.WantToBuildRoad,
        GAME_ACTION.ConfirmBuildSettlement,
        GAME_ACTION.ConfirmBuildSettlementSkippingSelection,
        GAME_ACTION.WantToBuildSettlement,
        GAME_ACTION.ConfirmBuildCity,
        GAME_ACTION.ConfirmBuildCitySkippingSelection,
        GAME_ACTION.WantToBuildCity,
        GAME_ACTION.BuyDevelopmentCard,
        GAME_ACTION.ClickedDice,
        GAME_ACTION.PreCreateTrade,
        GAME_ACTION.PassedTurn,
        GAME_ACTION.SelectedInitialPlacementIndex,
        GAME_ACTION.SelectedTile,
        GAME_ACTION.CreateTrade,
        GAME_ACTION.SelectedCards,
        GAME_ACTION.SelectedCardsState,
        GAME_ACTION.PlayDevelopmentCardFromHand,
        GAME_ACTION.ClickedDevelopmentCard,
        GAME_ACTION.RequestBeginnerModeLevelEnd,
      ].includes(parsed.action!)
    ) {
      return false;
    }
    if (parsed.action === GAME_ACTION.CreateTrade) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const playerColor = gameData.data.payload.playerColor ?? 1;
      const tradePayload =
        parsed.payload && typeof parsed.payload === "object"
          ? (parsed.payload as {
              offeredResources?: number[];
              wantedResources?: number[];
              isBankTrade?: boolean;
            })
          : null;
      const offeredResources = Array.isArray(tradePayload?.offeredResources)
        ? (tradePayload?.offeredResources ?? [])
        : [];
      const wantedResources = Array.isArray(tradePayload?.wantedResources)
        ? (tradePayload?.wantedResources ?? [])
        : [];
      if (tradePayload?.isBankTrade) {
        const playerState = gameState.playerStates?.[playerColor];
        if (gameState.bankState?.resourceCards) {
          offeredResources.forEach((card) => {
            if (gameState.bankState?.resourceCards?.[card] !== undefined) {
              gameState.bankState.resourceCards[card] += 1;
            }
          });
          wantedResources.forEach((card) => {
            if (gameState.bankState?.resourceCards?.[card] !== undefined) {
              gameState.bankState.resourceCards[card] -= 1;
            }
          });
        }

        if (playerState?.resourceCards?.cards) {
          playerState.resourceCards = {
            cards: removePlayerCards(
              playerState.resourceCards.cards,
              offeredResources,
            ),
          };
          playerState.resourceCards.cards.push(...wantedResources);
        }

        addGameLogEntry(gameState, {
          text: {
            type: GameLogMessageType.PlayerTradedWithBank,
            playerColor,
            givenCardEnums: offeredResources,
            receivedCardEnums: wantedResources,
          },
          from: playerColor,
        });

        const completedTurns = gameState.currentState.completedTurns ?? 0;
        gameState.currentState.allocatedTime = completedTurns >= 50 ? 220 : 140;

        sendCornerHighlights30(gameData, []);
        sendTileHighlights33(gameData, []);
        sendEdgeHighlights31(gameData);
        sendShipHighlights32(gameData);
        sendToMainSocket?.({
          id: State.GameStateUpdate.toString(),
          data: {
            type: GameStateUpdateType.ExchangeCards,
            payload: {
              givingPlayer: playerColor,
              givingCards: offeredResources,
              receivingPlayer: 0,
              receivingCards: wantedResources,
            },
          },
        });
      }

      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "createTrade",
          offeredResources,
          wantedResources,
        },
      );
      return true;
    }
    if (parsed.action === GAME_ACTION.RequestBeginnerModeLevelEnd) {
      sendToMainSocket?.({
        id: State.LobbyStateUpdate.toString(),
        data: {
          type: 3,
          payload: {
            accessLevel: 1,
            colonistCoins: 0,
            colonistVersion: 2890,
            giftedMemberships: [],
            icon: 12,
            id: "102013561",
            interactedWithSite: true,
            isLoggedIn: false,
            hasJoinedColonistDiscordServer: false,
            karma: 0,
            karmaCompletedGameCount: 0,
            membership: null,
            membershipEndDate: null,
            membershipPaymentMethod: null,
            membershipPending: false,
            isMuted: false,
            ownedItems: [],
            preferredColor: null,
            profilePictureUrl: null,
            regionUpdated: null,
            totalCompletedGameCount: 0,
            ckTotalGameCount: 0,
            ckFreeGameUntil: null,
            ckNextRerollAt: "2026-01-29T01:56:13.287Z",
            username: "Marlen#8600",
            language: null,
            usernameChangeAttemptsLeft: 1,
            forceSubscription: true,
            vliHash: null,
            expiresAt: "2026-02-28T00:56:13.287Z",
          },
        },
      });
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.BeginnerHintActivated,
          payload: {
            type: GAME_ACTION.ClickedDevelopmentCard,
            data: CardEnum.Knight,
          },
        },
      });
      return true;
    }

    if (parsed.action === GAME_ACTION.WantToBuildSettlement) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const completedTurns = gameState.currentState.completedTurns ?? 0;
      const highlightCorners = completedTurns >= 43 ? [50] : [47, 50];
      gameState.currentState.actionState = PlayerActionState.PlaceSettlement;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendCornerHighlights30(gameData, highlightCorners);
      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "wantToBuildSettlement",
        },
      );
      return true;
    }
    if (parsed.action === GAME_ACTION.WantToBuildRoad) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const completedTurns = gameState.currentState.completedTurns ?? 0;
      const isRoadBuildingFollowUp =
        gameState.currentState.actionState ===
        PlayerActionState.Place1MoreRoadBuilding;
      const highlightEdges =
        isRoadBuildingFollowUp || completedTurns >= 52
          ? [6, 7, 57, 58, 65, 64, 70, 61, 66, 67]
          : completedTurns >= 17
            ? [6, 7, 70, 69, 61, 65, 64, 60]
            : [6, 7, 70, 69, 61, 63, 60];
      gameState.currentState.actionState = PlayerActionState.PlaceRoad;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.HighlightRoadEdges,
          payload: highlightEdges,
        },
      });
      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "wantToBuildRoad",
        },
      );
      return true;
    }

    if (parsed.action === GAME_ACTION.WantToBuildCity) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const playerColor = gameData.data.payload.playerColor ?? 1;
      const cornerStates = gameState.mapState.tileCornerStates ?? {};
      const highlightCorners = Object.entries(cornerStates)
        .map(([key, value]) => ({
          key: Number.parseInt(key, 10),
          value: value as any,
        }))
        .filter(({ key }) => Number.isFinite(key))
        .filter(
          ({ value }) =>
            value &&
            value.owner === playerColor &&
            value.buildingType === CornerPieceType.Settlement,
        )
        .map(({ key }) => key);
      gameState.currentState.actionState = PlayerActionState.PlaceCity;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendCornerHighlights30(gameData, highlightCorners);
      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "wantToBuildCity",
        },
      );
      return true;
    }

    if (parsed.action === GAME_ACTION.ClickedDice) {
      rollDice();
      return true;
    }

    if (parsed.action === GAME_ACTION.PlayDevelopmentCardFromHand) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      gameState.currentState.actionState = PlayerActionState.None;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "PlayDevelopmentCardFromHand",
          payload: parsed.payload,
        },
      );
      return true;
    }

    if (parsed.action === GAME_ACTION.ClickedDevelopmentCard) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const playerColor = gameData.data.payload.playerColor ?? 1;
      const clickedCard =
        typeof parsed.payload === "number" ? parsed.payload : undefined;
      const devCardsState =
        gameState.mechanicDevelopmentCardsState?.players?.[playerColor];
      const handCards = devCardsState?.developmentCards?.cards;
      if (Array.isArray(handCards) && clickedCard != null) {
        const cardIndex = handCards.indexOf(clickedCard);
        if (cardIndex >= 0) {
          handCards.splice(cardIndex, 1);
        }
      }
      const priorUsedDevelopmentCardsCount = Array.isArray(
        devCardsState?.developmentCardsUsed,
      )
        ? devCardsState.developmentCardsUsed.length
        : 0;
      if (devCardsState && clickedCard != null) {
        if (!Array.isArray(devCardsState.developmentCardsUsed)) {
          devCardsState.developmentCardsUsed = [];
        }
        devCardsState.developmentCardsUsed.push(clickedCard);
        devCardsState.hasUsedDevelopmentCardThisTurn = true;
      }

      const usedKnightCount = Array.isArray(devCardsState?.developmentCardsUsed)
        ? devCardsState.developmentCardsUsed.filter(
            (card: number) => card === CardEnum.Knight,
          ).length
        : 0;

      addGameLogEntry(gameState, {
        text: {
          type: 20,
          playerColor,
          cardEnum: clickedCard,
        },
        from: playerColor,
      });

      gameState.currentState.actionState =
        clickedCard === CardEnum.Knight
          ? PlayerActionState.PlaceRobberOrPirate
          : clickedCard === CardEnum.RoadBuilding
            ? PlayerActionState.Place2MoreRoadBuilding
            : PlayerActionState.None;
      const completedTurns = gameState.currentState.completedTurns ?? 0;
      const isLateGameDevPlay =
        completedTurns >= 52 || priorUsedDevelopmentCardsCount > 0;
      gameState.currentState.allocatedTime = isLateGameDevPlay ? 160 : 180;
      gameState.currentState.startTime = Date.now();

      if (clickedCard === CardEnum.Knight && usedKnightCount >= 3) {
        if (!gameState.mechanicLargestArmyState) {
          gameState.mechanicLargestArmyState = {};
        }
        if (!gameState.mechanicLargestArmyState[playerColor]) {
          gameState.mechanicLargestArmyState[playerColor] = {} as any;
        }
        gameState.mechanicLargestArmyState[playerColor].hasLargestArmy = true;
        const playerState = gameState.playerStates?.[playerColor];
        if (playerState) {
          if (!playerState.victoryPointsState) {
            playerState.victoryPointsState = {};
          }
          playerState.victoryPointsState[VictoryPointSource.LargestArmy] = 1;
        }
        addGameLogEntry(gameState, {
          text: {
            type: 66,
            playerColor,
            achievementEnum: 1,
          },
          from: playerColor,
        });
        gameData.data.payload.timeLeftInState = 0;
      }

      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData, []);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExchangeCards,
          payload: {
            givingPlayer: playerColor,
            givingCards: clickedCard != null ? [clickedCard] : [],
            receivingPlayer: 0,
            receivingCards: [],
          },
        },
      });
      if (clickedCard === CardEnum.RoadBuilding) {
        const roadBuildingHighlightEdges =
          completedTurns >= 50
            ? [6, 7, 57, 58, 65, 64, 70, 69, 61]
            : [6, 7, 70, 69, 61, 65, 64, 60];
        sendToMainSocket?.({
          id: State.GameStateUpdate.toString(),
          data: {
            type: GameStateUpdateType.HighlightRoadEdges,
            payload: roadBuildingHighlightEdges,
          },
        });
      } else {
        sendCornerHighlights30(gameData, []);
        sendTileHighlights33(gameData, []);
        sendEdgeHighlights31(gameData);
        sendShipHighlights32(gameData);
        sendTileHighlights33(gameData, getRobberEligibleTiles(gameData));
      }

      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        { ClickedDevelopmentCard: clickedCard },
      );
      return true;
    }

    if (parsed.action === GAME_ACTION.PreCreateTrade) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      gameState.currentState.actionState = PlayerActionState.None;
      gameState.currentState.startTime = Date.now();
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "PreCreateTrade",
        },
      );
      return true;
    }

    if (parsed.action === GAME_ACTION.BuyDevelopmentCard) {
      buyDevelopmentCard();
      return true;
    }

    if (parsed.action === GAME_ACTION.SelectedCardsState) {
      return true;
    }

    if (parsed.action === GAME_ACTION.SelectedCards) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      if (
        gameState.currentState.actionState !==
        PlayerActionState.SelectCardsToDiscard
      ) {
        return true;
      }
      const selectedCards = Array.isArray(parsed.payload)
        ? (parsed.payload as number[])
        : [];
      const currentPlayer = gameData.data.payload.playerColor ?? 1;
      const playerState = gameState.playerStates?.[currentPlayer];
      if (playerState?.resourceCards?.cards) {
        playerState.resourceCards = {
          cards: removePlayerCards(
            playerState.resourceCards.cards,
            selectedCards,
          ),
        };
      }
      if (gameState.bankState?.resourceCards) {
        selectedCards.forEach((card) => {
          gameState.bankState.resourceCards[card] =
            (gameState.bankState.resourceCards[card] ?? 0) + 1;
        });
      }

      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExchangeCards,
          payload: {
            givingPlayer: currentPlayer,
            givingCards: selectedCards,
            receivingPlayer: 0,
            receivingCards: [],
          },
        },
      });
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ClosePopupUI,
          payload: null,
        },
      });
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendTileHighlights33(gameData, getRobberEligibleTiles(gameData));

      gameState.currentState.actionState =
        PlayerActionState.PlaceRobberOrPirate;
      if (gameState.playerStates?.[currentPlayer]) {
        gameState.playerStates[currentPlayer].isTakingAction = false;
      }
      addGameLogEntry(gameState, {
        text: {
          type: GameLogMessageType.PlayerDiscarded,
          playerColor: currentPlayer,
          cardEnums: selectedCards,
          areResourceCards: true,
        },
        from: currentPlayer,
      });

      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "selectedCards",
          selectedCards,
        },
      );
      return true;
    }

    if (parsed.action === GAME_ACTION.PassedTurn) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      if (
        gameState.currentState.actionState === PlayerActionState.PlaceRoad &&
        (gameState.currentState.completedTurns ?? 0) >= 17
      ) {
        if (typeof gameState.currentState.allocatedTime === "number") {
          gameData.data.payload.timeLeftInState =
            gameState.currentState.allocatedTime;
        }
        return true;
      }
      if (
        gameState.currentState.turnState === 2 &&
        gameState.currentState.actionState === PlayerActionState.None &&
        (gameState.currentState.completedTurns ?? 0) === 3
      ) {
        gameState.currentState.actionState =
          PlayerActionState.SelectCardsToDiscard;
        return true;
      }
      if (
        gameState.currentState.turnState === 2 &&
        gameState.currentState.actionState ===
          PlayerActionState.SelectCardsToDiscard
      ) {
        gameState.currentState.actionState = PlayerActionState.None;
        passTurn();
        return true;
      }
      if (
        gameState.currentState.turnState === 2 &&
        gameState.currentState.actionState === PlayerActionState.None &&
        gameState.currentState.completedTurns === 47 &&
        gameState.playerStates?.[gameData.data.payload.playerColor ?? 1]
          ?.isTakingAction === false
      ) {
        gameState.currentState.actionState =
          PlayerActionState.SelectCardsToDiscard;
        return true;
      }
      passTurn();
      return true;
    }

    if (parsed.action === GAME_ACTION.SelectedInitialPlacementIndex) {
      return true;
    }

    if (parsed.action === GAME_ACTION.SelectedTile) {
      autoPlaceRobber(parsed.payload as number);
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
      parsed.action === GAME_ACTION.ConfirmBuildCity ||
      parsed.action === GAME_ACTION.ConfirmBuildCitySkippingSelection
    ) {
      const cornerIndex = getCornerIndexFromPayload(
        firebaseData.GAME.data.payload.gameState,
        parsed.payload,
      );
      if (cornerIndex !== null) {
        placeCity(cornerIndex);
      }
      return true;
    }

    if (
      parsed.action === GAME_ACTION.ConfirmBuildRoad ||
      parsed.action === GAME_ACTION.ConfirmBuildRoadSkippingSelection ||
      parsed.action === GAME_ACTION.ConfirmBuildShip
    ) {
      const edgeIndex = parsed.payload as number;
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;

      if (
        parsed.action !== GAME_ACTION.ConfirmBuildShip &&
        (gameState.currentState.actionState ===
          PlayerActionState.Place2MoreRoadBuilding ||
          gameState.currentState.actionState ===
            PlayerActionState.Place1MoreRoadBuilding)
      ) {
        gameState.currentState.pendingRoadBuildingEdgeIndex = edgeIndex;
        return true;
      }

      const stagedRoadEdgeIndex =
        typeof gameState.currentState.pendingRoadBuildingEdgeIndex === "number"
          ? gameState.currentState.pendingRoadBuildingEdgeIndex
          : undefined;
      const edgeIndexToPlace =
        parsed.action === GAME_ACTION.ConfirmBuildShip &&
        stagedRoadEdgeIndex != null
          ? stagedRoadEdgeIndex
          : edgeIndex;
      delete gameState.currentState.pendingRoadBuildingEdgeIndex;

      placeRoad(edgeIndexToPlace);
      return true;
    }

    return true;
  };
  const rval = helper();
  const winner = getWinner();
  if (winner) {
    const gameData = firebaseData.GAME;
    const gameState = gameData.data.payload.gameState;
    const alreadyEnded =
      gameState.currentState.turnState === 3 &&
      gameData.data.payload.timeLeftInState === 0;
    if (alreadyEnded) {
      return rval;
    }
    sendTileHighlights33(gameData, []);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
    addGameLogEntry(gameState, {
      text: { type: GameLogMessageType.Separator },
    });
    addGameLogEntry(gameState, {
      text: {
        type: GameLogMessageType.PlayerWonTheGame,
        playerColor: winner.color,
      },
      from: winner.color,
    });
    addGameLogEntry(gameState, {
      text: { type: GameLogMessageType.Separator },
    });
    gameState.currentState.turnState = 3;
    gameState.currentState.actionState = PlayerActionState.None;
    gameState.currentState.allocatedTime = 300;
    gameData.data.payload.timeLeftInState = 0;

    setFirebaseData(
      { ...firebaseData, GAME: gameData },
      {
        action: "gameEnd",
      },
    );

    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.CanResignGame,
        payload: false,
      },
    });

    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.GameEndState,
        payload: {
          endGameState: {
            diceStats: [2, 3, 4, 4, 6, 10, 8, 5, 4, 5, 1],
            resourceCardsStats: [
              1, 2, 4, 4, 5, 1, 1, 3, 4, 4, 5, 2, 2, 5, 3, 4, 4, 5, 3, 3, 4, 4,
              4, 4, 2, 5, 5, 5, 1, 1, 1, 1, 4, 4, 5, 5, 3, 3, 4, 2, 4, 4, 3, 3,
              3, 4, 4, 4, 1, 2,
            ],
            developmentCardStats: [11, 11, 12, 14, 11],
            gameDurationInMS: 192729,
            totalTurnCount: 54,
            players: {
              1: {
                color: 1,
                rank: 1,
                victoryPoints: {
                  0: 3,
                  1: 1,
                  2: 1,
                  3: 1,
                  4: 1,
                },
                winningPlayer: true,
                title: null,
              },
            },
            resourceStats: {
              1: {
                color: 1,
                rollingIncome: 45,
                robbingIncome: 0,
                devCardIncome: 0,
                tradeIncome: 2,
                rollingLoss: 4,
                robbingLoss: 0,
                devCardLoss: 0,
                tradeLoss: 8,
                totalResourceIncome: 47,
                totalResourceLoss: 12,
                totalResourceScore: 35,
                goldIncome: 0,
              },
            },
            activityStats: {
              1: {
                color: 1,
                proposedTrades: 0,
                successfulTrades: 0,
                resourcesUsed: 34,
                resourceIncomeBlocked: 0,
                devCardsBought: 5,
                devCardsUsed: 4,
              },
            },
          },
          isReplayAvailable: true,
          rankedUserStates: [
            {
              color: 1,
              rankedState: {
                type: 2,
                numberOfGamesPlayed: 1,
                requiredNumberOfGames: 5,
                defaultEndGameData: {
                  amount: "-",
                  highest: false,
                },
              },
            },
          ],
        },
      },
    });
  }
  return rval;
};

const getWinner = () => {
  const players: Record<string, any> =
    firebaseData.GAME.data.payload.gameState.playerStates;
  return Object.values(players).find(
    (p: { victoryPointsState: Record<string, number> }) =>
      Object.entries(p.victoryPointsState)
        .map(
          ([key, count]) =>
            count *
            {
              [VictoryPointSource.DevelopmentCardVictoryPoint]: 1,
              [VictoryPointSource.Settlement]: 1,
              [VictoryPointSource.City]: 2,
              [VictoryPointSource.LargestArmy]: 2,
              [VictoryPointSource.LongestRoad]: 2,
            }[key]!,
        )
        .reduce((a, b) => a + b, 0) >= 10,
  );
};

import { firebaseData, setFirebaseData } from "../FirebaseWrapper";
import { sendToMainSocket } from "../handleMessage";
import {
  AchievementType,
  CardEnum,
  CornerDirection,
  CornerPieceType,
  EdgePieceType,
  GameAction,
  GameLogMessageType,
  GamePhase,
  GameStateUpdateType,
  LobbyState,
  MapPieceType,
  PlayerActionState,
  PlayerColor,
  State,
  TileType,
  UserIcon,
  UserRole,
  VictoryPointSource,
} from "./CatannFilesEnums";
import { colonistVersion, newGame } from "./createNew";
import { addGameLogEntry, edgeEndpoints } from "./utils";

const DEVELOPMENT_DECK_CARD_COUNTS = {
  [CardEnum.Knight]: 14,
  [CardEnum.VictoryPoint]: 5,
  [CardEnum.Monopoly]: 2,
  [CardEnum.RoadBuilding]: 2,
  [CardEnum.YearOfPlenty]: 2,
} as const;
export const NUM_DEV_CARDS = Object.values(DEVELOPMENT_DECK_CARD_COUNTS).reduce(
  (a, b) => a + b,
  0,
);

const BANK_INDEX = 0;
const MIN_POINTS_PROTECTED_BY_FRIENDLY_ROBBER = 2;
const LONGEST_ROAD_MIN_LENGTH = 5;
const DICE_ROLL_SIDES = 6;
const ROBBER_TRIGGER_DICE_TOTAL = 7;
const GENERIC_PORT_TYPE = 4;

const TURN_TIMERS_MS = {
  dicePhase: 180,
  postBuild: 140,
  robberAfterRoadBuilding: 160,
  turn: 120,
  settlementInitialRoadPlacement: 45,
  roadBuildingFollowUp: 8,
  placeRobber: 40,
  createTrade: 70,
  gameEnd: 300,
} as const;

type NumericMap<T> = Record<number, T>;

const getVictoryPointsToWin = (gameData: any) =>
  gameData.data.payload.gameSettings.victoryPointsToWin;

const getCardDiscardLimit = (gameData: any) =>
  gameData.data.payload.gameSettings.cardDiscardLimit;

const isDevelopmentCardRobberWindow = (gameState: any) => {
  const gameLogState = gameState.gameLogState;
  if (!gameLogState) return false;
  const entries = Object.entries(gameLogState)
    .map(([key, entry]) => ({
      index: Number.parseInt(key, 10),
      entry: entry as any,
    }))
    .filter(({ index }) => Number.isFinite(index))
    .sort((a, b) => b.index - a.index);
  for (const { entry } of entries) {
    const logType = entry?.text?.type;
    if (logType === GameLogMessageType.PlayerPlayedDevelopmentCard) {
      return entry?.text?.cardEnum === CardEnum.Knight;
    }
    if (logType === GameLogMessageType.RolledDice) {
      return false;
    }
  }
  return false;
};

const parseFiniteIndex = (value: string | number) => {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const toNumericRecordEntries = <T>(record: Record<string, T> | undefined) =>
  Object.entries(record ?? {})
    .map(([key, value]) => ({
      index: parseFiniteIndex(key),
      value,
    }))
    .filter(
      (
        entry,
      ): entry is {
        index: number;
        value: T;
      } => entry.index != null,
    );

const removePlayerCards = (cards: number[], toRemove: number[]) => {
  if (toRemove.length === 0) {
    return [...cards];
  }

  const removeCountByCard = new Map<number, number>();
  toRemove.forEach((card) => {
    removeCountByCard.set(card, (removeCountByCard.get(card) ?? 0) + 1);
  });

  return cards.filter((card) => {
    const remainingToRemove = removeCountByCard.get(card) ?? 0;
    if (remainingToRemove <= 0) {
      return true;
    }
    removeCountByCard.set(card, remainingToRemove - 1);
    return false;
  });
};

const buildBaseDevelopmentDeck = () => {
  return Object.entries(DEVELOPMENT_DECK_CARD_COUNTS).flatMap(([card, count]) =>
    Array(count).fill(Number(card)),
  );
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

const applyResourceExchangeWithBank = (
  gameState: any,
  playerColor: number,
  cardsFromPlayer: number[],
) => {
  if (cardsFromPlayer.length === 0) {
    return;
  }

  if (gameState.bankState?.resourceCards) {
    cardsFromPlayer.forEach((card) => {
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
        cardsFromPlayer,
      ),
    };
  }
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

const getNextTurnPlayerColor = (direction: number = 1) => 2;

const updateCurrentState = (
  gameData: any,
  updates: Partial<
    ReturnType<typeof newGame>["data"]["payload"]["gameState"]["currentState"]
  >,
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
  const sortedCards = [...cards].sort((a, b) => a - b);
  const bankState = gameState.bankState;
  const playerState = gameState.playerStates[playerColor];
  if (!playerState.resourceCards) {
    playerState.resourceCards = { cards: [] };
  }
  sortedCards.forEach((card) => {
    if (bankState?.resourceCards?.[card] !== undefined) {
      bankState.resourceCards[card] -= 1;
    }
    playerState.resourceCards.cards.push(card);
  });
  (playerState.resourceCards.cards as number[]).sort((a, b) => a - b);
  return addGameLogEntry(gameState, {
    text: {
      type: GameLogMessageType.ResourceDistribution,
      playerColor,
      cardsToBroadcast: sortedCards,
      distributionType,
    },
    from: playerColor,
  });
};

const autoPlaceRobber = (tileIndex: number) => {
  const gameData = firebaseData.GAME!;
  const playerColor = gameData.data.payload.playerColor;
  const gameState = gameData.data.payload.gameState;
  const tileHexStates = gameState.mapState.tileHexStates ?? {};
  const tileState = tileHexStates[String(tileIndex)];

  gameState.mechanicRobberState = {
    ...gameState.mechanicRobberState,
    locationTileIndex: tileIndex,
    isActive: true,
  };

  const isDevelopmentCardRobberPlacement =
    isDevelopmentCardRobberWindow(gameState);
  updateCurrentState(
    gameData,
    isDevelopmentCardRobberPlacement
      ? {
          actionState: PlayerActionState.None,
        }
      : {
          turnState: GamePhase.Turn,
          actionState: PlayerActionState.None,
          allocatedTime: TURN_TIMERS_MS.turn,
        },
  );

  addGameLogEntry(gameState, {
    text: {
      type: GameLogMessageType.MovedRobber,
      playerColor,
      pieceEnum: MapPieceType.Robber,
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
      type: GameLogMessageType.NoPlayerToStealFrom,
    },
    from: playerColor,
  });

  sendTileHighlights33(gameData, []);

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeRobber",
      tileIndex,
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
      if (portEdgeState.type === GENERIC_PORT_TYPE) {
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

const getBuildableRoadEdgeIndicesFromGameState = (gameData: any) => {
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  const edgeStates = gameState.mapState.tileEdgeStates ?? {};
  const cornerStates = gameState.mapState.tileCornerStates ?? {};
  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const connectedCornerKeys = new Set<string>();

  Object.values(cornerStates).forEach((cornerState: any) => {
    if (!cornerState || cornerState.owner !== playerColor) return;
    connectedCornerKeys.add(
      serializeCornerKey(cornerState.x, cornerState.y, cornerState.z),
    );
  });

  Object.values(edgeStates).forEach((edgeState: any) => {
    if (!edgeState || edgeState.owner !== playerColor) return;
    edgeEndpoints(edgeState).forEach((endpoint) => {
      connectedCornerKeys.add(
        serializeCornerKey(endpoint.x, endpoint.y, endpoint.z),
      );
    });
  });

  return toNumericRecordEntries(edgeStates)
    .map(({ index, value }) => ({
      index,
      edgeState: value as any,
    }))
    .filter(({ edgeState }) => Boolean(edgeState))
    .filter(({ edgeState }) => !edgeState.owner)
    .filter(({ edgeState }) => {
      const endpoints = edgeEndpoints(edgeState);
      return endpoints.some((endpoint) =>
        connectedCornerKeys.has(
          serializeCornerKey(endpoint.x, endpoint.y, endpoint.z),
        ),
      );
    })
    .map(({ index }) => index)
    .sort((a, b) => a - b);
};

export const sendCornerHighlights30 = (
  gameData: any,
  force: number[] | null = null,
) => {
  const actionState = gameData.data.payload.gameState.currentState.actionState;
  const playerColor = gameData.data.payload.playerColor;
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

export const sendEdgeHighlights31 = (
  gameData: any,
  cornerIndex: number = -1,
) => {
  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const edgeStates = gameData.data.payload.gameState.mapState.tileEdgeStates;
  const cornerStates =
    gameData.data.payload.gameState.mapState.tileCornerStates;
  const cornerState = cornerStates[cornerIndex];
  const cornerKey =
    cornerState &&
    serializeCornerKey(cornerState.x, cornerState.y, cornerState.z);
  const actionState = gameData.data.payload.gameState.currentState.actionState;
  const edgeIndices = ![
    PlayerActionState.InitialPlacementRoadPlacement,
    PlayerActionState.PlaceRoad,
    PlayerActionState.PlaceRoadForFree,
    PlayerActionState.Place2MoreRoadBuilding,
    PlayerActionState.Place1MoreRoadBuilding,
  ].includes(actionState)
    ? []
    : toNumericRecordEntries(edgeStates)
        .map(({ index, value }) => ({
          index,
          edgeState: value as any,
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
  const shipIndices = toNumericRecordEntries(shipStates)
    .map(({ index }) => index)
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
  if (!gameData.data.payload.gameSettings.friendlyRobber) {
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
    if (points > MIN_POINTS_PROTECTED_BY_FRIENDLY_ROBBER) {
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
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
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
    gameState.currentState.allocatedTime = TURN_TIMERS_MS.postBuild;
    gameState.currentState.startTime = Date.now();
  } else {
    updateCurrentState(gameData, {
      actionState: PlayerActionState.InitialPlacementRoadPlacement,
      allocatedTime: TURN_TIMERS_MS.settlementInitialRoadPlacement,
    });
  }

  const playerState = gameState.playerStates[playerColor];
  if (!playerState.victoryPointsState) {
    playerState.victoryPointsState = {} as NumericMap<number>;
  }
  const victoryPointsState =
    playerState.victoryPointsState as NumericMap<number>;
  victoryPointsState[VictoryPointSource.Settlement] =
    (victoryPointsState[VictoryPointSource.Settlement] ?? 0) + 1;

  if (isStandardBuild) {
    addGameLogEntry(gameState, {
      text: {
        type: GameLogMessageType.BuiltPiece,
        playerColor,
        pieceEnum: MapPieceType.Settlement,
        isVp: true,
      },
      from: playerColor,
    });
  } else {
    addGameLogEntry(gameState, {
      text: {
        type: GameLogMessageType.PlayerPlacedPiece,
        playerColor,
        pieceEnum: MapPieceType.Settlement,
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
    applyResourceExchangeWithBank(gameState, playerColor, exchangeCards);
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.ExchangeCards,
        payload: {
          givingPlayer: playerColor,
          givingCards: exchangeCards,
          receivingPlayer: BANK_INDEX,
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
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
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
    playerState.victoryPointsState = {} as NumericMap<number>;
  }
  const settlementCount = Object.values(
    gameState.mapState.tileCornerStates ?? {},
  ).filter(
    (tileCorner: any) =>
      tileCorner?.owner === playerColor &&
      tileCorner.buildingType === CornerPieceType.Settlement,
  ).length;
  const victoryPointsState =
    playerState.victoryPointsState as NumericMap<number>;
  victoryPointsState[VictoryPointSource.Settlement] = settlementCount;
  victoryPointsState[VictoryPointSource.City] =
    (victoryPointsState[VictoryPointSource.City] ?? 0) + 1;

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
  applyResourceExchangeWithBank(gameState, playerColor, exchangeCards);

  gameState.currentState.actionState = PlayerActionState.None;
  gameState.currentState.allocatedTime = TURN_TIMERS_MS.postBuild;
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
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
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

  if (
    actionStateAtRoadPlacement ===
    PlayerActionState.InitialPlacementRoadPlacement
  ) {
    addGameLogEntry(gameState, {
      text: {
        type: GameLogMessageType.PlayerPlacedPiece,
        playerColor,
        pieceEnum: MapPieceType.Road,
      },
      from: playerColor,
    });
    addGameLogEntry(gameState, {
      text: {
        type: GameLogMessageType.Separator,
      },
    });
    if (completedTurns === 0) {
      updateCurrentState(gameData, {
        completedTurns: completedTurns + 1,
        actionState: PlayerActionState.InitialPlacementPlaceSettlement,
        allocatedTime: TURN_TIMERS_MS.dicePhase,
        currentTurnPlayerColor: getNextTurnPlayerColor(),
      });
    } else {
      updateCurrentState(gameData, {
        completedTurns: completedTurns + 1,
        actionState: PlayerActionState.None,
        allocatedTime: TURN_TIMERS_MS.dicePhase,
        turnState: GamePhase.Dice,
      });
    }
  } else if (
    actionStateAtRoadPlacement === PlayerActionState.Place2MoreRoadBuilding
  ) {
    updateCurrentState(gameData, {
      actionState: PlayerActionState.Place1MoreRoadBuilding,
      turnState: GamePhase.Turn,
      allocatedTime: 160,
    });
    (gameState.currentState as any).roadBuildingHighlightStep = 0;
  } else if (
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding
  ) {
    updateCurrentState(gameData, {
      turnState: GamePhase.Turn,
      actionState: PlayerActionState.None,
      allocatedTime: TURN_TIMERS_MS.roadBuildingFollowUp,
    });
    delete (gameState.currentState as any).roadBuildingHighlightStep;
  } else {
    addGameLogEntry(gameState, {
      text: {
        isVp: false,
        type: GameLogMessageType.BuiltPiece,
        playerColor,
        pieceEnum: MapPieceType.Road,
      },
      from: playerColor,
    });
    applyResourceExchangeWithBank(gameState, playerColor, exchangeCards);
    updateCurrentState(gameData, {
      turnState: GamePhase.Turn,
      actionState: PlayerActionState.None,
      allocatedTime: TURN_TIMERS_MS.roadBuildingFollowUp,
    });

    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.ExchangeCards,
        payload: {
          givingPlayer: playerColor,
          givingCards: exchangeCards,
          receivingPlayer: BANK_INDEX,
          receivingCards: [],
        },
      },
    });
  }

  updateLongestRoadAchievement(playerColor);

  sendEdgeHighlights31(gameData);
  sendShipHighlights32(gameData);
  if (!isRoadBuildingPlacement) {
    if (
      actionStateAtRoadPlacement ===
      PlayerActionState.InitialPlacementRoadPlacement
    ) {
      sendEdgeHighlights31(gameData);
    }
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
    updateCurrentState(gameData, {
      currentTurnPlayerColor: getNextTurnPlayerColor(),
    });
  } else if (
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding
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

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeRoad",
      edgeIndex,
    },
  );
};

const rollDice = () => {
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  const overrideDiceState = window.__testSeed;
  const getDiceRoll = () => Math.floor(Math.random() * DICE_ROLL_SIDES) + 1;
  const dice1 =
    Array.isArray(overrideDiceState) && overrideDiceState.length === 2
      ? overrideDiceState[0]
      : getDiceRoll();
  const dice2 =
    Array.isArray(overrideDiceState) && overrideDiceState.length === 2
      ? overrideDiceState[1]
      : getDiceRoll();
  const diceTotal = dice1 + dice2;
  const shouldTriggerRobber = diceTotal === ROBBER_TRIGGER_DICE_TOTAL;
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
      allocatedTime: TURN_TIMERS_MS.placeRobber,
    });
  } else {
    updateCurrentState(gameData, {
      turnState: GamePhase.Turn,
      actionState: PlayerActionState.None,
      allocatedTime: TURN_TIMERS_MS.turn,
    });
  }
  addGameLogEntry(gameState, {
    text: {
      type: GameLogMessageType.RolledDice,
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
          type: GameLogMessageType.FriendlyRobberActive,
          all: false,
        },
      });
  }

  cardsByOwner.forEach((cards, owner) => {
    addPlayerResourceCards(gameState, owner, cards, 1);
  });

  if (!shouldTriggerRobber) {
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.GivePlayerResourcesFromTile,
        payload: resourcesToGive.sort((a, b) => a.tileIndex - b.tileIndex),
      },
    });
  } else {
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);

    const playerCards = [
      ...(gameState.playerStates?.[playerColor]?.resourceCards?.cards ?? []),
    ].sort((a, b) => a - b);
    const cardDiscardLimit = getCardDiscardLimit(gameData);
    const amountToDiscard =
      playerCards.length > cardDiscardLimit
        ? Math.floor(playerCards.length / 2)
        : 0;
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
                count: cardDiscardLimit,
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
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  const completedTurns = gameState.currentState.completedTurns ?? 0;
  const nextCompletedTurns = completedTurns + 1;

  gameState.diceState = {
    ...gameState.diceState,
    diceThrown: false,
  };

  updateCurrentState(gameData, {
    completedTurns: nextCompletedTurns,
    turnState: GamePhase.Dice,
    actionState: PlayerActionState.None,
  });

  addGameLogEntry(gameState, {
    text: {
      type: GameLogMessageType.Separator,
    },
  });

  const devCardsState: any =
    gameState.mechanicDevelopmentCardsState?.players?.[playerColor];
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
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  const exchangeCards = [CardEnum.Wool, CardEnum.Grain, CardEnum.Ore];
  applyResourceExchangeWithBank(gameState, playerColor, exchangeCards);

  const devCardsState: any = gameState.mechanicDevelopmentCardsState;
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
    (
      devCardsState.players[playerColor].developmentCards.cards as number[]
    ).sort((a, b) => a - b);
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
        playerState.victoryPointsState = {} as NumericMap<number>;
      }
      const victoryPointsState =
        playerState.victoryPointsState as NumericMap<number>;
      victoryPointsState[VictoryPointSource.DevelopmentCardVictoryPoint] =
        (victoryPointsState[VictoryPointSource.DevelopmentCardVictoryPoint] ??
          0) + 1;
    }
  }

  if (!gameState.gameLogState) {
    (gameState as any).gameLogState = {};
  }

  addGameLogEntry(gameState, {
    text: {
      type: GameLogMessageType.BoughtDevelopmentCard,
      playerColor,
    },
    from: playerColor,
  });

  gameState.currentState.allocatedTime = TURN_TIMERS_MS.robberAfterRoadBuilding;

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
        givingPlayer: BANK_INDEX,
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
    const sendReconnectState = (isReconnectingSession: boolean) => {
      const roomId = firebaseData.ROOM?.data?.roomId ?? "";
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
          type: GameStateUpdateType.FirstGameState,
          payload: {
            serverId: roomId,
            databaseGameId: roomId,
            gameSettingId: roomId,
            shouldResetGameClient: true,
            isReconnectingSession,
          },
        },
      });
      sendPlayTurnSound59({});
      sendToMainSocket?.(firebaseData.GAME);
    };
    if (
      parsed.action === GameAction.SelectedPlayer &&
      parsed.payload &&
      typeof parsed.payload === "object" &&
      "gameId" in parsed.payload
    ) {
      return false;
    }
    if (
      parsed.action === GameStateUpdateType.ExitInitialPlacement &&
      parsed.payload === false
    ) {
      return true;
    }
    if (
      parsed.action === GameAction.SelectedTile &&
      typeof parsed.payload === "object"
    )
      return false;
    if (
      ![
        GameAction.ConfirmBuildRoad,
        GameAction.ConfirmBuildRoadSkippingSelection,
        GameAction.ConfirmBuildShip,
        GameAction.WantToBuildRoad,
        GameAction.ConfirmBuildSettlement,
        GameAction.ConfirmBuildSettlementSkippingSelection,
        GameAction.WantToBuildSettlement,
        GameAction.ConfirmBuildCity,
        GameAction.ConfirmBuildCitySkippingSelection,
        GameAction.WantToBuildCity,
        GameAction.BuyDevelopmentCard,
        GameAction.ClickedDice,
        GameAction.PreCreateTrade,
        GameAction.PassedTurn,
        GameAction.SelectedInitialPlacementIndex,
        GameAction.SelectedTile,
        GameAction.CreateTrade,
        GameAction.SelectedCards,
        GameAction.SelectedCardsState,
        GameAction.PlayDevelopmentCardFromHand,
        GameAction.ClickedDevelopmentCard,
        GameAction.RequestGameState,
        GameAction.RequestBeginnerModeLevelEnd,
      ].includes(parsed.action!)
    ) {
      return false;
    }
    if (parsed.action === GameAction.CreateTrade) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const playerColor = gameData.data.payload.playerColor;
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
        const bankResourceCards = gameState.bankState?.resourceCards as
          | NumericMap<number>
          | undefined;
        if (bankResourceCards) {
          offeredResources.forEach((card) => {
            if (bankResourceCards[card] !== undefined) {
              bankResourceCards[card] += 1;
            }
          });
          wantedResources.forEach((card) => {
            if (bankResourceCards[card] !== undefined) {
              bankResourceCards[card] -= 1;
            }
          });
        }

        if (playerState?.resourceCards?.cards) {
          const existingCards = playerState.resourceCards.cards as number[];
          playerState.resourceCards = {
            cards: removePlayerCards(existingCards, offeredResources),
          } as any;
          (playerState.resourceCards.cards as number[]).push(
            ...wantedResources,
          );
          if (
            wantedResources.length === 1 &&
            offeredResources.length === 4 &&
            offeredResources.every((card) => card === CardEnum.Wool)
          ) {
            (playerState.resourceCards.cards as number[]).sort((a, b) => a - b);
          }
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

        gameState.currentState.allocatedTime = TURN_TIMERS_MS.createTrade;

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
              receivingPlayer: BANK_INDEX,
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
    if (parsed.action === GameAction.RequestBeginnerModeLevelEnd) {
      sendToMainSocket?.({
        id: State.LobbyStateUpdate.toString(),
        data: {
          type: LobbyState.UserStateUpdate,
          payload: {
            accessLevel: UserRole.User,
            colonistCoins: 0,
            colonistVersion,
            giftedMemberships: [],
            icon: UserIcon.Guest,
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
      return true;
    }

    if (parsed.action === GameAction.RequestGameState) {
      sendReconnectState(true);
      return true;
    }

    if (parsed.action === GameAction.WantToBuildSettlement) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      gameState.currentState.actionState = PlayerActionState.PlaceSettlement;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendCornerHighlights30(gameData, getSettlementEligibleTiles());
      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "wantToBuildSettlement",
        },
      );
      return true;
    }
    if (parsed.action === GameAction.WantToBuildRoad) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      gameState.currentState.actionState = PlayerActionState.PlaceRoad;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.HighlightRoadEdges,
          payload: getBuildableRoadEdgeIndicesFromGameState(gameData),
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

    if (parsed.action === GameAction.WantToBuildCity) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const playerColor = gameData.data.payload.playerColor;
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

    if (parsed.action === GameAction.ClickedDice) {
      rollDice();
      return true;
    }

    if (parsed.action === GameAction.PlayDevelopmentCardFromHand) {
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

    if (parsed.action === GameAction.ClickedDevelopmentCard) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      const playerColor = gameData.data.payload.playerColor;
      const clickedCard =
        typeof parsed.payload === "number" ? parsed.payload : undefined;
      const devCardsState: any =
        gameState.mechanicDevelopmentCardsState?.players?.[playerColor];
      const handCards = devCardsState?.developmentCards?.cards;
      if (Array.isArray(handCards) && clickedCard != null) {
        const cardIndex = handCards.indexOf(clickedCard);
        if (cardIndex >= 0) {
          handCards.splice(cardIndex, 1);
        }
      }
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
      gameState.currentState.startTime = Date.now();

      if (clickedCard === CardEnum.Knight && usedKnightCount >= 3) {
        const largestArmyState = (gameState.mechanicLargestArmyState ??
          ((gameState as any).mechanicLargestArmyState =
            {})) as NumericMap<any>;
        if (!largestArmyState[playerColor]) {
          largestArmyState[playerColor] = {} as any;
        }
        largestArmyState[playerColor].hasLargestArmy = true;
        const playerState = gameState.playerStates?.[playerColor];
        if (playerState) {
          if (!playerState.victoryPointsState) {
            playerState.victoryPointsState = {} as NumericMap<number>;
          }
          const victoryPointsState =
            playerState.victoryPointsState as NumericMap<number>;
          victoryPointsState[VictoryPointSource.LargestArmy] = 1;
        }
        addGameLogEntry(gameState, {
          text: {
            type: GameLogMessageType.PlayerReceivedAchievement,
            playerColor,
            achievementEnum: AchievementType.LargestArmy,
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
            receivingPlayer: BANK_INDEX,
            receivingCards: [],
          },
        },
      });
      if (clickedCard === CardEnum.RoadBuilding) {
        sendToMainSocket?.({
          id: State.GameStateUpdate.toString(),
          data: {
            type: GameStateUpdateType.HighlightRoadEdges,
            payload: getBuildableRoadEdgeIndicesFromGameState(gameData),
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

    if (parsed.action === GameAction.PreCreateTrade) {
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

    if (parsed.action === GameAction.BuyDevelopmentCard) {
      buyDevelopmentCard();
      return true;
    }

    if (parsed.action === GameAction.SelectedCardsState) {
      return true;
    }

    if (parsed.action === GameAction.SelectedCards) {
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
            playerState.resourceCards.cards as number[],
            selectedCards,
          ),
        } as any;
      }
      const bankResourceCards = gameState.bankState?.resourceCards as
        | NumericMap<number>
        | undefined;
      if (bankResourceCards) {
        selectedCards.forEach((card) => {
          bankResourceCards[card] = (bankResourceCards[card] ?? 0) + 1;
        });
      }

      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExchangeCards,
          payload: {
            givingPlayer: currentPlayer,
            givingCards: selectedCards,
            receivingPlayer: BANK_INDEX,
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

    if (parsed.action === GameAction.PassedTurn) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      gameState.currentState.actionState = PlayerActionState.None;
      passTurn();
      return true;
    }

    if (parsed.action === GameAction.SelectedInitialPlacementIndex) {
      return true;
    }

    if (parsed.action === GameAction.SelectedTile) {
      autoPlaceRobber(parsed.payload as number);
      return true;
    }

    if (
      parsed.action === GameAction.ConfirmBuildSettlement ||
      parsed.action === GameAction.ConfirmBuildSettlementSkippingSelection
    ) {
      const cornerIndex = parsed.payload as number;

      placeSettlement(cornerIndex);

      return true;
    }

    if (
      parsed.action === GameAction.ConfirmBuildCity ||
      parsed.action === GameAction.ConfirmBuildCitySkippingSelection
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
      parsed.action === GameAction.ConfirmBuildRoad ||
      parsed.action === GameAction.ConfirmBuildRoadSkippingSelection ||
      parsed.action === GameAction.ConfirmBuildShip
    ) {
      const edgeIndex = parsed.payload as number;
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;

      if (
        parsed.action !== GameAction.ConfirmBuildShip &&
        (gameState.currentState.actionState ===
          PlayerActionState.Place2MoreRoadBuilding ||
          gameState.currentState.actionState ===
            PlayerActionState.Place1MoreRoadBuilding)
      ) {
        (gameState.currentState as any).pendingRoadBuildingEdgeIndex =
          edgeIndex;
        return true;
      }

      const stagedRoadEdgeIndex =
        typeof (gameState.currentState as any).pendingRoadBuildingEdgeIndex ===
        "number"
          ? (gameState.currentState as any).pendingRoadBuildingEdgeIndex
          : undefined;
      const edgeIndexToPlace =
        parsed.action === GameAction.ConfirmBuildShip &&
        stagedRoadEdgeIndex != null
          ? stagedRoadEdgeIndex
          : edgeIndex;
      delete (gameState.currentState as any).pendingRoadBuildingEdgeIndex;

      placeRoad(edgeIndexToPlace);
      return true;
    }

    return true;
  };
  const rval = helper();
  const winner = getWinner();
  if (winner) {
    const gameData = firebaseData.GAME!;
    const gameState = gameData.data.payload.gameState;
    const alreadyEnded =
      gameState.currentState.turnState === GamePhase.GameEnd &&
      gameData.data.payload.timeLeftInState === 0;
    if (alreadyEnded) {
      return rval;
    }
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData, []);
    sendCornerHighlights30(gameData, []);
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
    gameState.currentState.turnState = GamePhase.GameEnd;
    gameState.currentState.actionState = PlayerActionState.None;
    gameState.currentState.allocatedTime = TURN_TIMERS_MS.gameEnd;
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
        payload: getGameEndPayload(),
      },
    });
  }
  return rval;
};

const getGameEndPayload = () => {
  const gameData = firebaseData.GAME;
  const gameState = gameData?.data?.payload?.gameState;
  const gameLogState = gameState?.gameLogState;
  const logEntries = toNumericRecordEntries(gameLogState)
    .sort((a, b) => a.index - b.index)
    .map(({ value }) => value);

  const diceStats = Array.from({ length: 11 }, () => 0);
  const resourceCardsStats: number[] = [];
  let developmentCardStats: number[] = [];

  const playerStates: Record<string, any> = gameState?.playerStates ?? {};
  const playerColors = Object.keys(playerStates)
    .map(parseFiniteIndex)
    .filter((color): color is number => color != null);

  const createResourceStats = (color: number) => ({
    color,
    rollingIncome: 0,
    robbingIncome: 0,
    devCardIncome: 0,
    tradeIncome: 0,
    rollingLoss: 0,
    robbingLoss: 0,
    devCardLoss: 0,
    tradeLoss: 0,
    totalResourceIncome: 0,
    totalResourceLoss: 0,
    totalResourceScore: 0,
    goldIncome: 0,
  });

  const createActivityStats = (color: number) => ({
    color,
    proposedTrades: 0,
    successfulTrades: 0,
    resourcesUsed: 0,
    resourceIncomeBlocked: 0,
    devCardsBought: 0,
    devCardsUsed: 0,
  });

  const resourceStats: Record<number, any> = {};
  const activityStats: Record<number, any> = {};
  playerColors.forEach((color) => {
    resourceStats[color] = createResourceStats(color);
    activityStats[color] = createActivityStats(color);
  });

  const ensureResourceStats = (color: number) =>
    resourceStats[color] ?? (resourceStats[color] = createResourceStats(color));
  const ensureActivityStats = (color: number) =>
    activityStats[color] ?? (activityStats[color] = createActivityStats(color));

  const addResourcesUsed = (color: number, amount: number) => {
    if (amount <= 0) return;
    ensureActivityStats(color).resourcesUsed += amount;
  };

  const getPieceCost = (pieceEnum: number | undefined) => {
    switch (pieceEnum) {
      case MapPieceType.Road:
        return 2;
      case MapPieceType.Settlement:
        return 4;
      case MapPieceType.City:
        return 5;
      case MapPieceType.Ship:
        return 2;
      default:
        return 0;
    }
  };

  logEntries.forEach((entry) => {
    const text: any = entry?.text ?? entry;
    const type = text?.type;
    if (type == null) return;

    if (type === GameLogMessageType.RolledDice) {
      const dice1 = Number(text?.firstDice);
      const dice2 = Number(text?.secondDice);
      if (Number.isFinite(dice1) && Number.isFinite(dice2)) {
        const total = dice1 + dice2;
        if (total >= 2 && total <= 12) {
          diceStats[total - 2] += 1;
        }
      }
      return;
    }

    if (type === GameLogMessageType.ResourceDistribution) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      const cards = Array.isArray(text?.cardsToBroadcast)
        ? text.cardsToBroadcast.filter((card: any) => Number.isFinite(card))
        : [];
      if (cards.length > 0) {
        resourceCardsStats.push(...cards);
      }
      if (playerColor != null) {
        const stats = ensureResourceStats(playerColor);
        const count = cards.length;
        const distributionType = text?.distributionType;
        if (distributionType === 2) {
          stats.goldIncome += count;
        } else if (distributionType === 1 || distributionType === 0) {
          stats.rollingIncome += count;
        } else {
          stats.devCardIncome += count;
        }
      }
      return;
    }

    if (type === GameLogMessageType.PlayerTradedWithBank) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      const givenCards = Array.isArray(text?.givenCardEnums)
        ? text.givenCardEnums.filter((card: any) => Number.isFinite(card))
        : [];
      const receivedCards = Array.isArray(text?.receivedCardEnums)
        ? text.receivedCardEnums.filter((card: any) => Number.isFinite(card))
        : [];
      if (receivedCards.length > 0) {
        resourceCardsStats.push(...receivedCards);
      }
      if (playerColor != null) {
        const stats = ensureResourceStats(playerColor);
        stats.tradeIncome += receivedCards.length;
        stats.tradeLoss += givenCards.length;
      }
      return;
    }

    if (type === GameLogMessageType.PlayerDiscarded) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      const cardEnums = Array.isArray(text?.cardEnums)
        ? text.cardEnums.filter((card: any) => Number.isFinite(card))
        : [];
      if (playerColor != null && text?.areResourceCards) {
        ensureResourceStats(playerColor).rollingLoss += cardEnums.length;
      }
      return;
    }

    if (type === GameLogMessageType.BoughtDevelopmentCard) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      if (playerColor != null) {
        ensureActivityStats(playerColor).devCardsBought += 1;
        addResourcesUsed(playerColor, 3);
      }
      return;
    }

    if (type === GameLogMessageType.PlayerPlayedDevelopmentCard) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      if (playerColor != null) {
        ensureActivityStats(playerColor).devCardsUsed += 1;
      }
      if (Number.isFinite(text?.cardEnum)) {
        developmentCardStats.push(text.cardEnum);
      }
      return;
    }

    if (type === GameLogMessageType.BuiltPiece) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      if (playerColor != null) {
        addResourcesUsed(playerColor, getPieceCost(text?.pieceEnum));
      }
    }
  });

  if (gameState?.mechanicDevelopmentCardsState?.players) {
    const devCardsFromState: number[] = [];
    Object.values(gameState.mechanicDevelopmentCardsState.players).forEach(
      (player: any) => {
        if (Array.isArray(player?.developmentCards?.cards)) {
          devCardsFromState.push(...player.developmentCards.cards);
        }
        if (Array.isArray(player?.developmentCardsUsed)) {
          devCardsFromState.push(...player.developmentCardsUsed);
        }
      },
    );
    if (devCardsFromState.length > 0) {
      developmentCardStats = devCardsFromState;
    }
  }

  if (resourceCardsStats.length === 0 && gameState?.playerStates) {
    Object.values(gameState.playerStates).forEach((player: any) => {
      if (Array.isArray(player?.resourceCards?.cards)) {
        resourceCardsStats.push(...player.resourceCards.cards);
      }
    });
  }

  Object.values(resourceStats).forEach((stats: any) => {
    stats.totalResourceIncome =
      stats.rollingIncome +
      stats.robbingIncome +
      stats.devCardIncome +
      stats.tradeIncome +
      stats.goldIncome;
    stats.totalResourceLoss =
      stats.rollingLoss +
      stats.robbingLoss +
      stats.devCardLoss +
      stats.tradeLoss;
    stats.totalResourceScore =
      stats.totalResourceIncome - stats.totalResourceLoss;
  });

  const totalPointsByColor = playerColors.map((color) => {
    const victoryPointsState =
      playerStates[color]?.victoryPointsState ?? ({} as NumericMap<number>);
    const weights: Record<number, number> = {
      [VictoryPointSource.Settlement]: 1,
      [VictoryPointSource.City]: 2,
      [VictoryPointSource.DevelopmentCardVictoryPoint]: 1,
      [VictoryPointSource.LargestArmy]: 2,
      [VictoryPointSource.LongestRoad]: 2,
      [VictoryPointSource.Chits]: 1,
      [VictoryPointSource.Metropolis]: 2,
      [VictoryPointSource.DefenderOfColonist]: 1,
      [VictoryPointSource.ProgressCardVictoryPoint]: 1,
      [VictoryPointSource.Merchant]: 1,
    };
    const total = Object.entries(victoryPointsState)
      .map(([key, count]) => (weights[Number(key)] ?? 1) * (Number(count) || 0))
      .reduce((a, b) => a + b, 0);
    return { color, total };
  });

  totalPointsByColor.sort((a, b) =>
    b.total !== a.total ? b.total - a.total : a.color - b.color,
  );
  const rankByColor = new Map<number, number>();
  totalPointsByColor.forEach((entry, index) => {
    rankByColor.set(entry.color, index + 1);
  });

  const winner = getWinner();
  const winningColor =
    typeof winner?.color === "number" ? winner.color : undefined;
  const victoryPointsToWin =
    gameData != null ? getVictoryPointsToWin(gameData) : 0;

  const players = playerColors.reduce(
    (acc, color) => {
      const victoryPointsState =
        playerStates[color]?.victoryPointsState ?? ({} as NumericMap<number>);
      const totalPoints =
        totalPointsByColor.find((entry) => entry.color === color)?.total ?? 0;
      acc[color] = {
        color,
        rank: rankByColor.get(color) ?? playerColors.length,
        victoryPoints: victoryPointsState,
        winningPlayer:
          winningColor != null
            ? color === winningColor
            : victoryPointsToWin > 0
              ? totalPoints >= victoryPointsToWin
              : false,
        title: null,
      };
      return acc;
    },
    {} as Record<number, any>,
  );

  const endTime =
    typeof (firebaseData as any)?.__meta?.now === "number"
      ? (firebaseData as any).__meta.now
      : Date.now();
  const startTime =
    typeof gameState?.currentState?.startTime === "number"
      ? gameState.currentState.startTime
      : endTime;

  return {
    endGameState: {
      diceStats,
      resourceCardsStats,
      developmentCardStats,
      gameDurationInMS: Math.max(0, endTime - startTime),
      totalTurnCount: gameState?.currentState?.completedTurns ?? 0,
      players,
      resourceStats,
      activityStats,
    },
    isReplayAvailable: logEntries.length > 0,
    rankedUserStates: playerColors.map((color) => ({
      color,
      rankedState: {
        type: 2,
        numberOfGamesPlayed: 1,
        requiredNumberOfGames: 5,
        defaultEndGameData: {
          amount: "-",
          highest: false,
        },
      },
    })),
  };
};

const getWinner = () => {
  const players: Record<string, any> =
    firebaseData.GAME!.data.payload.gameState.playerStates;
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
        .reduce((a, b) => a + b, 0) >= getVictoryPointsToWin(firebaseData.GAME),
  );
};

const calculateLongestRoad = (playerColor: number) => {
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const edgeStates = gameState.mapState.tileEdgeStates ?? {};
  const cornerStates = gameState.mapState.tileCornerStates ?? {};

  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const visitedEdges = new Set<string>();
  const visitedCorners = new Set<string>();

  const dfs = (cornerKey: string, length: number): number => {
    visitedCorners.add(cornerKey);
    let maxLength = length;

    Object.entries(edgeStates).forEach(
      ([edgeKey, edgeState]: [string, any]) => {
        if (edgeState.owner !== playerColor || visitedEdges.has(edgeKey))
          return;

        const endpoints = edgeEndpoints(edgeState);
        const connectedCorner = endpoints.find(
          (endpoint) =>
            serializeCornerKey(endpoint.x, endpoint.y, endpoint.z) ===
            cornerKey,
        );

        if (connectedCorner) {
          visitedEdges.add(edgeKey);
          const otherCorner = endpoints.find(
            (endpoint) =>
              serializeCornerKey(endpoint.x, endpoint.y, endpoint.z) !==
              cornerKey,
          );

          if (otherCorner) {
            const otherCornerKey = serializeCornerKey(
              otherCorner.x,
              otherCorner.y,
              otherCorner.z,
            );
            if (!visitedCorners.has(otherCornerKey)) {
              maxLength = Math.max(maxLength, dfs(otherCornerKey, length + 1));
            }
          }

          visitedEdges.delete(edgeKey);
        }
      },
    );

    visitedCorners.delete(cornerKey);
    return maxLength;
  };

  let longestRoad = 0;

  Object.values(cornerStates).forEach((cornerState: any) => {
    if (cornerState.owner === playerColor) {
      const cornerKey = serializeCornerKey(
        cornerState.x,
        cornerState.y,
        cornerState.z,
      );
      longestRoad = Math.max(longestRoad, dfs(cornerKey, 0));
    }
  });

  return longestRoad;
};

const updateLongestRoadAchievement = (playerColor: number) => {
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerStates = gameState.playerStates ?? {};

  const longestRoadState = (gameState.mechanicLongestRoadState ??
    ((gameState as any).mechanicLongestRoadState = {})) as NumericMap<any>;

  const playerColors = Object.keys(playerStates)
    .map((colorKey) => Number.parseInt(colorKey, 10))
    .filter((color) => Number.isFinite(color)) as PlayerColor[];

  playerColors.forEach((color) => {
    const previousState = longestRoadState[color] ?? {};
    longestRoadState[color] = {
      ...previousState,
      longestRoad: calculateLongestRoad(color),
    };
    if ((longestRoadState[color] as any).hasLongestRoad) {
      delete (longestRoadState[color] as any).hasLongestRoad;
    }
  });

  const playerStatesByColor = gameState.playerStates as
    | Record<number, any>
    | undefined;
  const currentHolder = playerColors.find(
    (color) =>
      (
        playerStatesByColor?.[color]?.victoryPointsState as
          | NumericMap<number>
          | undefined
      )?.[VictoryPointSource.LongestRoad] === 1,
  );

  const currentHolderLength =
    currentHolder == null
      ? 0
      : ((longestRoadState[currentHolder] as any)?.longestRoad ?? 0);
  const challengerLength =
    (longestRoadState[playerColor] as any)?.longestRoad ?? 0;

  if (currentHolder === playerColor) {
    if (challengerLength < LONGEST_ROAD_MIN_LENGTH) {
      delete (
        playerStatesByColor?.[playerColor]?.victoryPointsState as
          | NumericMap<number>
          | undefined
      )?.[VictoryPointSource.LongestRoad];
      delete (longestRoadState[playerColor] as any)?.hasLongestRoad;
    }
    return;
  }

  if (
    challengerLength < LONGEST_ROAD_MIN_LENGTH ||
    challengerLength <= currentHolderLength
  ) {
    return;
  }

  if (currentHolder != null) {
    delete (
      playerStatesByColor?.[currentHolder]?.victoryPointsState as
        | NumericMap<number>
        | undefined
    )?.[VictoryPointSource.LongestRoad];
    delete (longestRoadState[currentHolder] as any)?.hasLongestRoad;
  }

  const challengerState = (
    gameState.playerStates as Record<number, any> | undefined
  )?.[playerColor];
  if (!challengerState) {
    return;
  }
  if (!challengerState.victoryPointsState) {
    challengerState.victoryPointsState = {} as NumericMap<number>;
  }
  const victoryPointsState =
    challengerState.victoryPointsState as NumericMap<number>;
  victoryPointsState[VictoryPointSource.LongestRoad] = 1;
  if (longestRoadState[playerColor]) {
    longestRoadState[playerColor].hasLongestRoad = true;
  }
  addGameLogEntry(gameState, {
    text: {
      type: GameLogMessageType.PlayerReceivedAchievement,
      playerColor,
      achievementEnum: AchievementType.LongestRoad,
    },
    from: playerColor,
  });
};
function getSettlementEligibleTiles(): number[] | null | undefined {
  const gameData = firebaseData.GAME;
  const gameState = gameData?.data?.payload?.gameState;
  const playerColor = gameData?.data?.payload?.playerColor;

  if (!gameState) return null;

  const cornerStates = gameState.mapState?.tileCornerStates ?? {};
  const edgeStates = gameState.mapState?.tileEdgeStates ?? {};

  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const ownedCorners = new Set<string>();
  Object.values(cornerStates).forEach((cornerState: any) => {
    if (cornerState?.owner === playerColor) {
      ownedCorners.add(
        serializeCornerKey(cornerState.x, cornerState.y, cornerState.z),
      );
    }
  });

  const eligibleCorners = Object.entries(cornerStates)
    .map(([key, cornerState]: [string, any]) => ({
      index: Number.parseInt(key, 10),
      cornerState,
    }))
    .filter(({ index, cornerState }) => {
      if (!Number.isFinite(index) || !cornerState) return false;

      // Ensure the corner is unoccupied
      if (cornerState.owner) return false;

      // Ensure no adjacent corners are owned
      const adjacentEdges = Object.values(edgeStates).filter((edgeState: any) =>
        edgeEndpoints(edgeState).some(
          (endpoint) =>
            serializeCornerKey(endpoint.x, endpoint.y, endpoint.z) ===
            serializeCornerKey(cornerState.x, cornerState.y, cornerState.z),
        ),
      );

      const adjacentCorners = adjacentEdges.flatMap((edgeState: any) =>
        edgeEndpoints(edgeState).map((endpoint) =>
          serializeCornerKey(endpoint.x, endpoint.y, endpoint.z),
        ),
      );

      if (adjacentCorners.some((cornerKey) => ownedCorners.has(cornerKey))) {
        return false;
      }

      // Ensure the corner is adjacent to an owned road
      return adjacentEdges.some(
        (edgeState: any) => edgeState.owner === playerColor,
      );
    })
    .map(({ index }) => index);

  return eligibleCorners.length > 0 ? eligibleCorners : null;
}

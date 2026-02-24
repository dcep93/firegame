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
  executeTrade: 80,
} as const;

type NumericMap<T> = Record<number, T>;
type JsonObject = Record<string, unknown>;
type GameData = ReturnType<typeof newGame>;
export type GameState = GameData["data"]["payload"]["gameState"];
type GameLogState = Record<string, { text?: JsonObject; from?: number }>;
type StringMap<T> = Record<string, T>;
type NumericMapOrStringMap<T> = NumericMap<T> | StringMap<T>;
type CoordinateState = { x: number; y: number; z: number };
type TileCornerState = JsonObject &
  CoordinateState & {
    owner?: number;
    buildingType?: number;
  };
type TileEdgeState = JsonObject &
  CoordinateState & {
    owner?: number;
    type?: number;
    buildingType?: number;
  };
type HexTileState = JsonObject & {
  x?: number;
  y?: number;
  type?: number;
  diceNumber?: number;
};
type PlayerState = JsonObject & {
  owner?: number;
  victoryPointsState?: NumericMap<number>;
  resourceCards?: { cards?: number[] };
  isTakingAction?: boolean;
  bankSettlementAmount?: number;
  bankCityAmount?: number;
  bankRoadAmount?: number;
  bankTradeRatiosState?: NumericMap<number>;
};
export type DevelopmentCardPlayerState = JsonObject & {
  developmentCards?: { cards?: number[] };
  developmentCardsUsed?: number[];
  developmentCardsBoughtThisTurn?: number[] | null;
  hasUsedDevelopmentCardThisTurn?: boolean | null;
};
type DevelopmentCardsMechanicState = JsonObject & {
  players?: StringMap<DevelopmentCardPlayerState>;
  bankDevelopmentCards?: { cards?: number[] };
};
type NumericResourceState = Record<number, number>;
type EndResourceStats = {
  color: number;
  rollingIncome: number;
  robbingIncome: number;
  devCardIncome: number;
  tradeIncome: number;
  rollingLoss: number;
  robbingLoss: number;
  devCardLoss: number;
  tradeLoss: number;
  totalResourceIncome: number;
  totalResourceLoss: number;
  totalResourceScore: number;
  goldIncome: number;
};
type EndActivityStats = {
  color: number;
  proposedTrades: number;
  successfulTrades: number;
  resourcesUsed: number;
  resourceIncomeBlocked: number;
  devCardsBought: number;
  devCardsUsed: number;
};
type LongestRoadMechanicState = {
  hasLongestRoad?: boolean;
  longestRoad: number;
};
type LargestArmyMechanicState = { hasLargestArmy?: boolean };
type FirebaseWithMeta = typeof firebaseData & { __meta?: { now?: number } };
type GameStateCurrentWithRuntime = GameState["currentState"] & {
  roadBuildingHighlightStep?: number;
  pendingRoadBuildingEdgeIndex?: number;
};
type GameStateWithLargestArmy = GameState & {
  mechanicLargestArmyState?: NumericMap<LargestArmyMechanicState>;
};
type GameStateWithLongestRoad = GameState & {
  mechanicLongestRoadState?: NumericMap<LongestRoadMechanicState>;
};
type WinnerResult = { color: number };

const getVictoryPointsToWin = (gameData: GameData) =>
  gameData.data.payload.gameSettings.victoryPointsToWin;

const getCardDiscardLimit = (gameData: GameData) =>
  gameData.data.payload.gameSettings.cardDiscardLimit;

const isDevelopmentCardRobberWindow = (gameState: GameState) => {
  const gameLogState = gameState.gameLogState as GameLogState | undefined;
  if (!gameLogState) return false;
  const entries = Object.entries(gameLogState)
    .map(([key, entry]) => ({
      index: Number.parseInt(key, 10),
      entry,
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

const parseFiniteIndex = (value: unknown) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;
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

const getByPlayerColor = <T>(
  record: NumericMapOrStringMap<T> | undefined,
  playerColor: number,
) => {
  return (record as StringMap<T> | undefined)?.[String(playerColor)];
};

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

const applyResourceExchangeWithPlayers = (
  gameState: GameState,
  givingPlayer: number,
  givingCards: number[],
  receivingPlayer: number,
  receivingCards: number[],
) => {
  if (
    givingPlayer === receivingPlayer ||
    (givingCards.length === 0 && receivingCards.length === 0)
  ) {
    return;
  }

  const giverState = getPlayerStateByColor(gameState, givingPlayer);
  if (giverState?.resourceCards?.cards) {
    giverState.resourceCards = {
      cards: [
        ...removePlayerCards(giverState.resourceCards.cards, givingCards),
        ...receivingCards,
      ].sort((a, b) => a - b),
    };
  }

  const receiverState = getPlayerStateByColor(gameState, receivingPlayer);
  if (receiverState?.resourceCards?.cards) {
    receiverState.resourceCards = {
      cards: [
        ...removePlayerCards(receiverState.resourceCards.cards, receivingCards),
        ...givingCards,
      ].sort((a, b) => a - b),
    };
  }
};

const buildBaseDevelopmentDeck = () => {
  return Object.entries(DEVELOPMENT_DECK_CARD_COUNTS).flatMap(([card, count]) =>
    Array(count).fill(Number(card)),
  );
};

const collectKnownDevelopmentCards = (
  devCardsState: DevelopmentCardsMechanicState | undefined,
) => {
  const knownCards: number[] = [];
  const players =
    (devCardsState?.players as
      | StringMap<DevelopmentCardPlayerState>
      | undefined) ?? {};
  Object.values(players).forEach((player) => {
    const playerObj = player as JsonObject;
    const cards = playerObj.developmentCards as
      | { cards?: number[] }
      | undefined;
    const usedCards = playerObj.developmentCardsUsed as number[] | undefined;
    const playerCards = cards?.cards;
    if (Array.isArray(playerCards)) {
      knownCards.push(...playerCards);
    }
    if (Array.isArray(usedCards)) {
      knownCards.push(...usedCards);
    }
  });
  return knownCards;
};

const applyResourceExchangeWithBank = (
  gameState: GameState,
  playerColor: number,
  cardsFromPlayer: number[],
) => {
  if (cardsFromPlayer.length === 0) {
    return;
  }

  if (gameState.bankState?.resourceCards) {
    const bankResourceCards = gameState.bankState.resourceCards as
      | NumericResourceState
      | undefined;
    cardsFromPlayer.forEach((card) => {
      if (bankResourceCards?.[card] !== undefined) {
        bankResourceCards[card] += 1;
      }
    });
  }

  const playerState = getPlayerStateByColor(gameState, playerColor);
  if (playerState?.resourceCards?.cards) {
    playerState.resourceCards = {
      cards: removePlayerCards(
        playerState.resourceCards.cards,
        cardsFromPlayer,
      ),
    };
  }
};

const getRemainingDevelopmentDeck = (
  devCardsState: DevelopmentCardsMechanicState | undefined,
) => {
  const deck = buildBaseDevelopmentDeck();
  if (!devCardsState) {
    return deck;
  }
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

const getPlayerStateByColor = (gameState: GameState, playerColor: number) => {
  return getByPlayerColor(
    gameState.playerStates as StringMap<PlayerState> | undefined,
    playerColor,
  ) as PlayerState | undefined;
};

const drawDevelopmentCard = (
  devCardsState: DevelopmentCardsMechanicState | undefined,
) => {
  const overrideDevCard = window.__testSeed;
  window.__testSeed = null;
  const bankCards = devCardsState?.bankDevelopmentCards?.cards;
  const bankHasRealCards =
    Array.isArray(bankCards) &&
    bankCards.some((card) => card !== CardEnum.DevelopmentBack);
  const remainingDeck = bankHasRealCards
    ? [...bankCards]
    : getRemainingDevelopmentDeck(devCardsState);

  let selectedCard: number | undefined;
  if (typeof overrideDevCard === "number") {
    const index = remainingDeck.indexOf(overrideDevCard);
    if (index >= 0) {
      selectedCard = overrideDevCard;
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

const goToNextPlayer = (gameData: GameData) => {
  updateCurrentState(gameData, {
    completedTurns:
      gameData.data.payload.gameState.currentState.completedTurns + 1,
  });

  const payload = firebaseData.GAME!.data.payload;
  const currPlayerIndex = payload.playOrder.indexOf(
    payload.gameState.currentState.currentTurnPlayerColor,
  );
  const rounds = getNumRounds();
  const direction = [1, 2].includes(rounds)
    ? 0
    : rounds > 1 && rounds < 2
      ? -1
      : 1;
  const nextPlayerIndex =
    (currPlayerIndex + payload.playOrder.length + direction) %
    payload.playOrder.length;
  const currentTurnPlayerColor = payload.playOrder[nextPlayerIndex];

  updateCurrentState(gameData, {
    currentTurnPlayerColor,
  });
};

const updateCurrentState = (
  gameData: GameData,
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
  gameState: GameState,
  playerColor: number,
  cards: number[],
  distributionType: number,
) => {
  if (cards.length === 0) return undefined;
  const sortedCards = [...cards].sort((a, b) => a - b);
  const bankState = gameState.bankState;
  const playerState = getPlayerStateByColor(gameState, playerColor);
  if (!playerState) {
    return;
  }
  if (!playerState.resourceCards) {
    playerState.resourceCards = { cards: [] };
  }
  const playerCards = playerState.resourceCards.cards ?? [];
  sortedCards.forEach((card) => {
    const bankResourceCards = bankState?.resourceCards as
      | NumericResourceState
      | undefined;
    if (bankResourceCards?.[card] !== undefined) {
      bankResourceCards[card] -= 1;
    }
    playerCards.push(card);
  });
  playerCards.sort((a, b) => a - b);
  playerState.resourceCards.cards = playerCards;
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
  sendTileHighlights33(gameData, []);

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

  const tileCornerStates = (gameState.mapState.tileCornerStates ??
    {}) as StringMap<TileCornerState>;
  const opponents = new Set<number>();
  const oppositeCandidates: number[] = [];
  Object.values(tileCornerStates).forEach((cornerState) => {
    const owner = parseFiniteIndex(cornerState?.owner);
    if (owner == null || owner === playerColor) return;
    const ownerState = getPlayerStateByColor(gameState, owner);
    const adjacentTileIndices = getAdjacentTileIndicesForCorner(
      gameState,
      cornerState,
    );
    if (!adjacentTileIndices.includes(tileIndex)) return;
    opponents.add(owner);
    if (!ownerState?.resourceCards?.cards?.length) return;
    oppositeCandidates.push(owner);
  });
  const uniqueOpponents = [...Array.from(new Set(oppositeCandidates))];

  let exchangeCardsPayload;
  if (uniqueOpponents.length > 0) {
    const targetPlayerColor =
      uniqueOpponents[Math.floor(Math.random() * uniqueOpponents.length)];
    const targetState = getPlayerStateByColor(gameState, targetPlayerColor);
    const targetCards = targetState?.resourceCards?.cards ?? [];
    const stolenCard =
      window.__testSeed ??
      targetCards[Math.floor(Math.random() * targetCards.length)];
    window.__testSeed = null;
    if (stolenCard !== undefined) {
      exchangeCardsPayload = {
        givingPlayer: targetPlayerColor,
        givingCards: [stolenCard],
        receivingPlayer: playerColor,
        receivingCards: [],
      };
      applyResourceExchangeWithPlayers(
        gameState,
        exchangeCardsPayload.givingPlayer,
        exchangeCardsPayload.givingCards,
        exchangeCardsPayload.receivingPlayer,
        exchangeCardsPayload.receivingCards,
      );
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExchangeCards,
          payload: exchangeCardsPayload,
        },
      });
      addGameLogEntry(gameState, {
        text: {
          playerColor: targetPlayerColor,
          cardEnums: [stolenCard],
          type: GameLogMessageType.StolenResourceCardThief,
        },
        from: playerColor,
        toSpectators: false,
        specificRecipients: [playerColor],
      });
      addGameLogEntry(gameState, {
        text: {
          playerColor,
          cardEnums: [stolenCard],
          type: GameLogMessageType.StolenResourceCardVictim,
        },
        from: playerColor,
        toSpectators: false,
        specificRecipients: [targetPlayerColor],
      });
      addGameLogEntry(gameState, {
        text: {},
        toSpectators: false,
        specificRecipients: [],
      });
    }
  }

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

  if (!exchangeCardsPayload) {
    addGameLogEntry(
      gameState,
      opponents.size === 0
        ? {
            text: {
              type: GameLogMessageType.NoPlayerToStealFrom,
            },
            from: playerColor,
          }
        : {
            text: {
              type: GameLogMessageType.CantStealPlayersDontHaveCards,
              playerCount: opponents.size,
            },
            from: playerColor,
          },
    );
  }

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeRobber",
      tileIndex,
      exchangeCardsPayloads: exchangeCardsPayload
        ? [exchangeCardsPayload]
        : undefined,
    },
  );
};

const applyPortOwnership = (
  gameState: GameState,
  cornerState: JsonObject,
  playerColor: number,
) => {
  const portEdgeStates = (gameState.mapState?.portEdgeStates ??
    {}) as StringMap<TileEdgeState>;
  if (!portEdgeStates) return;
  Object.entries(portEdgeStates).forEach(([key, portEdgeState]) => {
    const endpoints = edgeEndpoints(portEdgeState);
    const isAdjacent = endpoints.some(
      (endpoint) =>
        endpoint.x === cornerState.x &&
        endpoint.y === cornerState.y &&
        endpoint.z === cornerState.z,
    );
    if (!isAdjacent) return;
    portEdgeStates[key] = {
      ...portEdgeState,
      owner: playerColor,
    } as TileEdgeState;
    if (portEdgeState.type === GENERIC_PORT_TYPE) {
      const ratios = getPlayerStateByColor(
        gameState,
        playerColor,
      )?.bankTradeRatiosState;
      if (ratios) {
        Object.keys(ratios).forEach((ratioKey) => {
          const parsedRatioKey = Number.parseInt(ratioKey, 10);
          if (Number.isFinite(parsedRatioKey)) {
            ratios[parsedRatioKey] = 3;
          }
        });
      }
    }
  });
};

const getBuildableRoadEdgeIndicesFromGameState = (gameData: GameData) => {
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  const edgeStates = gameState.mapState
    .tileEdgeStates as StringMap<TileEdgeState>;
  const cornerStates = gameState.mapState
    .tileCornerStates as StringMap<TileCornerState>;
  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const connectedCornerKeys = new Set<string>();

  Object.values(cornerStates).forEach((cornerState: TileCornerState) => {
    if (!cornerState || cornerState.owner !== playerColor) return;
    connectedCornerKeys.add(
      serializeCornerKey(cornerState.x, cornerState.y, cornerState.z),
    );
  });

  Object.values(edgeStates).forEach((edgeState) => {
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
      edgeState: value,
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
  gameData: GameData,
  force: number[] | null = null,
) => {
  const actionState = gameData.data.payload.gameState.currentState.actionState;
  const playerColor = gameData.data.payload.playerColor;
  const tileCornerStates = gameData.data.payload.gameState.mapState
    .tileCornerStates as StringMap<TileCornerState>;
  const isClose = (a: TileCornerState, b: TileCornerState) => {
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
  const ownedCorners: TileCornerState[] = Object.values(
    tileCornerStates,
  ).filter(
    (cornerState: TileCornerState) =>
      cornerState.buildingType === CornerPieceType.Settlement,
  );
  const cornerIndices = [
    PlayerActionState.InitialPlacementPlaceSettlement,
    PlayerActionState.InitialPlacementPlaceCity,
  ].includes(actionState)
    ? Object.entries(tileCornerStates)
        .map(([key, value]) => ({
          key: Number.parseInt(key, 10),
          value: value as TileCornerState,
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
        .map(({ key }) => key)
    : [PlayerActionState.PlaceSettlement].includes(actionState)
      ? getSettlementEligibleTiles()
      : [
            PlayerActionState.PlaceCity,
            PlayerActionState.PlaceCityWithDiscount,
          ].includes(actionState)
        ? getCityEligibleTiles()
        : [];

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.HighlightCorners,
      payload: force ?? cornerIndices,
    },
  });
};

export const sendEdgeHighlights31 = (
  gameData: GameData,
  empty: boolean = true,
) => {
  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const edgeStates = gameData.data.payload.gameState.mapState
    .tileEdgeStates as StringMap<TileEdgeState>;
  const cornerStates = gameData.data.payload.gameState.mapState
    .tileCornerStates as StringMap<TileCornerState>;
  const cornerState =
    cornerStates[String(firebaseData.__meta?.change.cornerIndex || -1)];
  const cornerKey =
    cornerState &&
    serializeCornerKey(cornerState.x, cornerState.y, cornerState.z);
  const actionState = gameData.data.payload.gameState.currentState.actionState;
  const edgeIndices = !empty
    ? getBuildableRoadEdgeIndicesFromGameState(gameData)
    : ![
          PlayerActionState.InitialPlacementRoadPlacement,
          PlayerActionState.PlaceRoadForFree,
          PlayerActionState.Place2MoreRoadBuilding,
          PlayerActionState.Place1MoreRoadBuilding,
        ].includes(actionState)
      ? []
      : toNumericRecordEntries(edgeStates)
          .map(({ index, value }) => ({
            index,
            edgeState: value,
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

const sendTileHighlights33 = (gameData: GameData, payload: number[] = []) => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.HighlightTiles,
      payload,
    },
  });
};

const sendShipHighlights32 = (gamePath: GameData) => {
  const shipStates = ((
    gamePath.data.payload.gameState.mapState as StringMap<unknown>
  ).shipStates ?? {}) as StringMap<JsonObject>;
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

const sendPlayTurnSound59 = (gameData: GameData) => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.PlayTurnSound,
      payload: [],
    },
  });
};

export const sendExitInitialPlacement62 = () => {
  return;
  // sendToMainSocket?.({
  //   id: State.GameStateUpdate.toString(),
  //   data: {
  //     type: GameStateUpdateType.ExitInitialPlacement,
  //     payload: {},
  //   },
  // });
};

export const sendResetTradeStateAtEndOfTurn80 = () => {
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.ResetTradeStateAtEndOfTurn,
      payload: null,
    },
  });
};

const getAdjacentTileIndicesForCorner = (
  gameState: GameState,
  cornerState: TileCornerState,
) => {
  const tileHexStates = (gameState.mapState.tileHexStates ??
    {}) as StringMap<HexTileState>;
  const tileIndexByCoord = new Map<string, number>();
  Object.entries(tileHexStates).forEach(([index, tileState]) => {
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

const getPlayerVictoryPoints = (playerState?: {
  victoryPointsState?: Record<string, number>;
}) => {
  const victoryPointsState = playerState?.victoryPointsState as
    | Record<string, number>
    | undefined;
  if (!victoryPointsState) {
    return 0;
  }
  return Object.values(victoryPointsState).reduce((a, b) => a + b, 0);
};

const getFriendlyRobberBlockedTiles = (gameData: GameData) => {
  const gameState = gameData.data.payload.gameState;
  if (!gameData.data.payload.gameSettings.friendlyRobber) {
    return new Set<number>();
  }
  const tileCornerStates = gameState.mapState
    .tileCornerStates as StringMap<TileCornerState>;
  const blockedTiles = new Set<number>();
  Object.values(tileCornerStates).forEach((cornerState) => {
    const ownerIndex = parseFiniteIndex(cornerState?.owner);
    if (ownerIndex == null) {
      return;
    }
    if (
      cornerState.buildingType !== CornerPieceType.Settlement &&
      cornerState.buildingType !== CornerPieceType.City
    ) {
      return;
    }
    const playerState = getPlayerStateByColor(gameState, ownerIndex);
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

const getRobberEligibleTiles = (gameData: GameData) => {
  const gameState = gameData.data.payload.gameState;
  const tileHexStates = (gameState.mapState.tileHexStates ??
    {}) as StringMap<HexTileState>;
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
  const tileCornerStates = gameState.mapState
    .tileCornerStates as StringMap<TileCornerState>;
  const cornerState = tileCornerStates[String(cornerIndex)];

  tileCornerStates[String(cornerIndex)] = {
    ...cornerState,
    owner: playerColor,
    buildingType: CornerPieceType.Settlement,
    x: cornerState?.x,
    y: cornerState?.y,
    z: cornerState?.z,
  } as TileCornerState;

  const settlementState = getByPlayerColor(
    gameState.mechanicSettlementState as
      | StringMap<{ bankSettlementAmount?: number }>
      | undefined,
    playerColor,
  );
  if (
    settlementState &&
    settlementState.bankSettlementAmount != null &&
    settlementState.bankSettlementAmount > 0
  ) {
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

  const playerState = getPlayerStateByColor(gameState, playerColor);
  if (!playerState) {
    return;
  }
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
  var exchangeCardsPayload;

  if (isStandardBuild) {
    const exchangeCards = [
      CardEnum.Lumber,
      CardEnum.Brick,
      CardEnum.Wool,
      CardEnum.Grain,
    ];
    applyResourceExchangeWithBank(gameState, playerColor, exchangeCards);
    exchangeCardsPayload = {
      givingCards: exchangeCards,
      givingPlayer: playerColor,
      receivingCards: [],
      receivingPlayer: 0,
    };
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
  }
  const resourcesToGive: ResourcesToGiveType = [];

  const sendResourcesFromTile = (gameData: GameData, cornerIndex: number) => {
    const gameState = gameData.data.payload.gameState;
    const cornerState =
      gameState.mapState.tileCornerStates[String(cornerIndex)];
    const tileHexStates = (gameState.mapState.tileHexStates ??
      {}) as StringMap<HexTileState>;
    const adjacentTiles = getAdjacentTileIndicesForCorner(
      gameState,
      cornerState,
    );
    if (getNumRounds() >= 1) {
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
  };
  if (!isStandardBuild) {
    sendResourcesFromTile(gameData, cornerIndex);
  }

  if (isStandardBuild) {
    setFirebaseData(
      { ...firebaseData, GAME: gameData },
      {
        action: "placeSettlement",
        exchangeCardsPayloads: [exchangeCardsPayload],
      },
    );
  } else {
    setFirebaseData(
      { ...firebaseData, GAME: gameData },
      {
        action: "placeSettlement",
        resourcesToGive,
        cornerIndex,
      },
    );
  }
};

const getCornerIndexFromPayload = (gameState: GameState, payload: unknown) => {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const payloadObj = payload as Record<string, unknown>;
  const numericKeys = ["cornerIndex", "tileCornerIndex", "index"];
  for (const key of numericKeys) {
    const value = payloadObj[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  const coordCandidate = (payloadObj.cornerState ??
    payloadObj.corner ??
    (typeof payloadObj.x === "number" &&
    typeof payloadObj.y === "number" &&
    typeof payloadObj.z === "number"
      ? {
          x: payloadObj.x,
          y: payloadObj.y,
          z: payloadObj.z,
        }
      : null)) as JsonObject | null;
  if (
    coordCandidate &&
    typeof coordCandidate === "object" &&
    typeof coordCandidate.x === "number" &&
    typeof coordCandidate.y === "number" &&
    typeof coordCandidate.z === "number"
  ) {
    const cornerStates = gameState.mapState
      ?.tileCornerStates as StringMap<TileCornerState>;
    const match = Object.entries(cornerStates).find(([, cornerState]) => {
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
  const tileCornerStates = gameState.mapState
    .tileCornerStates as StringMap<TileCornerState>;
  const cornerState = tileCornerStates[String(cornerIndex)];
  if (!cornerState) {
    return;
  }

  tileCornerStates[String(cornerIndex)] = {
    ...cornerState,
    owner: playerColor,
    buildingType: CornerPieceType.City,
  };

  const cityState = getByPlayerColor(
    gameState.mechanicCityState as
      | StringMap<{ bankCityAmount?: number }>
      | undefined,
    playerColor,
  );
  if (
    cityState &&
    cityState.bankCityAmount != null &&
    cityState.bankCityAmount > 0
  ) {
    cityState.bankCityAmount -= 1;
  }
  const settlementState = getByPlayerColor(
    gameState.mechanicSettlementState as
      | StringMap<{ bankSettlementAmount?: number }>
      | undefined,
    playerColor,
  );
  if (
    settlementState &&
    settlementState.bankSettlementAmount != null &&
    settlementState.bankSettlementAmount !== undefined
  ) {
    settlementState.bankSettlementAmount += 1;
  }

  const playerState = getPlayerStateByColor(gameState, playerColor);
  if (!playerState) {
    return;
  }
  if (!playerState.victoryPointsState) {
    playerState.victoryPointsState = {} as NumericMap<number>;
  }
  const settlementCount = Object.values(tileCornerStates).filter(
    (tileCorner: TileCornerState) =>
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

  const exchangeCardsPayload = {
    givingPlayer: playerColor,
    givingCards: exchangeCards,
    receivingPlayer: 0,
    receivingCards: [],
  };

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.ExchangeCards,
      payload: exchangeCardsPayload,
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
      exchangeCardsPayloads: [exchangeCardsPayload],
    },
  );
};

const placeRoad = (edgeIndex: number) => {
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  const edgeStates = gameState.mapState
    .tileEdgeStates as StringMap<TileEdgeState>;
  const edgeState = edgeStates[String(edgeIndex)];

  edgeStates[String(edgeIndex)] = {
    ...edgeState,
    owner: playerColor,
    type: EdgePieceType.Road,
  };

  const roadState = getByPlayerColor(
    gameState.mechanicRoadState as
      | StringMap<{ bankRoadAmount?: number }>
      | undefined,
    playerColor,
  );
  if (
    roadState &&
    roadState.bankRoadAmount != null &&
    roadState.bankRoadAmount > 0
  ) {
    roadState.bankRoadAmount -= 1;
  }

  const actionStateAtRoadPlacement = gameState.currentState.actionState;
  const roadCurrentState =
    gameState.currentState as GameStateCurrentWithRuntime;
  const isRoadBuildingPlacement =
    actionStateAtRoadPlacement === PlayerActionState.Place2MoreRoadBuilding ||
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding;
  const exchangeCards = [CardEnum.Lumber, CardEnum.Brick];
  var exchangeCardsPayload;

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
    goToNextPlayer(gameData);
    const rounds = getNumRounds();
    if (rounds < 2) {
      updateCurrentState(gameData, {
        actionState: PlayerActionState.InitialPlacementPlaceSettlement,
        allocatedTime: TURN_TIMERS_MS.dicePhase,
      });
    } else {
      updateCurrentState(gameData, {
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
    roadCurrentState.roadBuildingHighlightStep = 0;
  } else if (
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding
  ) {
    updateCurrentState(gameData, {
      turnState: GamePhase.Turn,
      actionState: PlayerActionState.None,
      allocatedTime: TURN_TIMERS_MS.roadBuildingFollowUp,
    });
    delete roadCurrentState.roadBuildingHighlightStep;
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

    exchangeCardsPayload = {
      givingPlayer: playerColor,
      givingCards: exchangeCards,
      receivingPlayer: BANK_INDEX,
      receivingCards: [],
    };

    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.ExchangeCards,
        payload: exchangeCardsPayload,
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
  } else if (
    actionStateAtRoadPlacement === PlayerActionState.Place1MoreRoadBuilding
  ) {
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData, []);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);
  }

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "placeRoad",
      edgeIndex,
      exchangeCardsPayloads: [exchangeCardsPayload],
    },
  );
};

const rollDice = () => {
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  const overrideDiceState = window.__testSeed;
  window.__testSeed = null;
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
  const tileHexStates = (gameState.mapState.tileHexStates ??
    {}) as StringMap<HexTileState>;
  const tileCornerStates = (gameState.mapState.tileCornerStates ??
    {}) as StringMap<TileCornerState>;
  const _resourcesToGive: {
    owner: number;
    tileIndex: number;
    distributionType: number;
    card: number;
  }[] = [];
  const cardsByOwner: Record<number, number[]> = {};
  let blockedTileStateForLog: HexTileState | undefined;

  if (!shouldTriggerRobber) {
    Object.values(tileCornerStates).forEach((cornerState) => {
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
        if (tileState.type == null) return;
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
        const owner = cornerState.owner;
        if (owner == null) return;
        for (let i = 0; i < cardCount; i += 1) {
          _resourcesToGive.push({
            owner,
            tileIndex,
            distributionType: 1,
            card: tileState.type,
          });
          const ownerCards = cardsByOwner[owner] ?? [];
          ownerCards.push(tileState.type);
          cardsByOwner[owner] = ownerCards;
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

  Object.entries(cardsByOwner)
    .map(([owner, cards]) => ({ owner: parseInt(owner), cards }))
    .sort((a, b) => a.owner - b.owner)
    .forEach(({ cards, owner }) => {
      addPlayerResourceCards(gameState, owner, cards, 1);
    });

  if (shouldTriggerRobber) {
    sendCornerHighlights30(gameData, []);
    sendTileHighlights33(gameData);
    sendEdgeHighlights31(gameData);
    sendShipHighlights32(gameData);

    const playerCards = [
      ...(getPlayerStateByColor(gameState, playerColor)?.resourceCards?.cards ??
        []),
    ].sort((a, b) => a - b);
    const cardDiscardLimit = getCardDiscardLimit(gameData);
    const amountToDiscard =
      playerCards.length > cardDiscardLimit
        ? Math.floor(playerCards.length / 2)
        : 0;
    if (amountToDiscard > 0) {
      gameState.currentState.actionState =
        PlayerActionState.SelectCardsToDiscard;
      if (getPlayerStateByColor(gameState, playerColor)) {
        const activePlayerState = getPlayerStateByColor(gameState, playerColor);
        if (activePlayerState) {
          activePlayerState.isTakingAction = true;
        }
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

  const resourcesToGive = shouldTriggerRobber ? null : _resourcesToGive;

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "rollDice",
      dice: [dice1, dice2],
      resourcesToGive,
    },
  );
};

const passTurn = () => {
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const playerColor = gameData.data.payload.playerColor;
  goToNextPlayer(gameData);

  gameState.diceState = {
    ...gameState.diceState,
    diceThrown: false,
  };

  updateCurrentState(gameData, {
    turnState: GamePhase.Dice,
    actionState: PlayerActionState.None,
  });

  addGameLogEntry(gameState, {
    text: {
      type: GameLogMessageType.Separator,
    },
  });

  const devCardsState = getByPlayerColor(
    gameState.mechanicDevelopmentCardsState?.players as
      | StringMap<DevelopmentCardPlayerState>
      | undefined,
    playerColor,
  );
  if (devCardsState && "developmentCardsBoughtThisTurn" in devCardsState) {
    devCardsState.developmentCardsBoughtThisTurn = null;
    if ("hasUsedDevelopmentCardThisTurn" in devCardsState) {
      devCardsState.hasUsedDevelopmentCardThisTurn = null;
    }
  }

  Object.keys(gameData.data.payload.gameState.tradeState.closedOffers).forEach(
    (key) =>
      (gameData.data.payload.gameState.tradeState.closedOffers[key] = null),
  );

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

  const devCardsState = gameState.mechanicDevelopmentCardsState as
    | DevelopmentCardsMechanicState
    | undefined;
  const devPlayerState = getByPlayerColor(
    devCardsState?.players as StringMap<DevelopmentCardPlayerState> | undefined,
    playerColor,
  );
  const devCard = drawDevelopmentCard(devCardsState);
  if (devCard == null) {
    return;
  }
  if (devPlayerState?.developmentCards?.cards) {
    devPlayerState.developmentCards.cards.push(devCard);
    (devPlayerState.developmentCards.cards as number[]).sort((a, b) => a - b);
  }
  if (devPlayerState) {
    devPlayerState.developmentCardsBoughtThisTurn = [devCard];
  }

  if (devCard === CardEnum.VictoryPoint) {
    const playerState = getPlayerStateByColor(gameState, playerColor);
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
    gameState.gameLogState = {};
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
  const exchangeCardsPayloads = [
    {
      givingPlayer: playerColor,
      givingCards: exchangeCards,
      receivingPlayer: BANK_INDEX,
      receivingCards: [],
    },
    {
      givingPlayer: BANK_INDEX,
      givingCards: [devCard],
      receivingPlayer: playerColor,
      receivingCards: [],
    },
  ];
  exchangeCardsPayloads.forEach((exchangeCardsPayload) => {
    sendToMainSocket?.({
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.ExchangeCards,
        payload: exchangeCardsPayload,
      },
    });
  });

  setFirebaseData(
    { ...firebaseData, GAME: gameData },
    {
      action: "buyDevelopmentCard",
      exchangeCardsPayloads,
    },
  );
};

export const applyGameAction = (parsed: { action?: number; payload?: any }) => {
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
      sendPlayTurnSound59(firebaseData.GAME!);
      const reconnectGameState = firebaseData.GAME;
      if (reconnectGameState) {
        sendToMainSocket?.(reconnectGameState);
      }
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
      const exchangeCardsPayloads = tradePayload?.isBankTrade
        ? [
            {
              givingPlayer: playerColor,
              givingCards: offeredResources,
              receivingPlayer: BANK_INDEX,
              receivingCards: wantedResources,
            },
          ]
        : null;
      if (tradePayload?.isBankTrade) {
        const playerState = getPlayerStateByColor(gameState, playerColor);
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
          };
          (playerState.resourceCards.cards as number[]).push(
            ...wantedResources,
          );
          playerState.resourceCards.cards!.sort((a, b) => a - b);
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
      } else {
        const randomChars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const tradeId =
          window.__testSeed ??
          Array.from(
            { length: 4 },
            () => randomChars[Math.floor(Math.random() * randomChars.length)],
          ).join("");
        window.__testSeed = null;
        gameState.tradeState.activeOffers[tradeId] = {
          id: tradeId,
          creator: playerColor,
          offeredResources,
          wantedResources,
          playerResponses: Object.fromEntries(
            Object.keys(gameState.playerStates)
              .filter(
                (key) =>
                  key !==
                  gameState.currentState.currentTurnPlayerColor.toString(),
              )
              .map((key) => [key, 0]),
          ),
          counterOfferInResponseToTradeId: null,
          playersCreatingCounterOffer: Object.fromEntries(
            Object.keys(gameState.playerStates).map((key) => [key, false]),
          ),
        };
        gameState.tradeState.closedOffers[tradeId] = {
          offeredResources,
          wantedResources,
        };

        addGameLogEntry(gameState, {
          text: {
            type: GameLogMessageType.PlayerWantsToTradeWith,
            playerColor,
            wantedCardEnums: wantedResources,
            offeredCardEnums: offeredResources,
          },
          from: playerColor,
        });
      }

      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "createTrade",
          offeredResources,
          wantedResources,
          exchangeCardsPayloads,
        },
      );
      return true;
    }
    if (parsed.action === GameAction.UpdateTradeResponse) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState as JsonObject & {
        tradeState?: {
          activeOffers?: Record<
            string,
            { playerResponses?: Record<string, number> }
          >;
        };
      };
      const payload =
        parsed.payload && typeof parsed.payload === "object"
          ? (parsed.payload as { id?: string; response?: number })
          : null;
      const tradeId = payload?.id;
      if (tradeId) {
        const activeOffer = gameState.tradeState?.activeOffers?.[tradeId];
        if (activeOffer) {
          const responses = activeOffer.playerResponses ?? {};
          if (payload.response !== 0) throw new Error("not implemented");
          responses[String(gameData.data.payload.playerColor)] =
            1 - responses[String(gameData.data.payload.playerColor)];
          activeOffer.playerResponses = responses;
        }
      }
      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "updateTradeResponse",
          payload,
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

    if (parsed.action === GameAction.ExecuteTrade) {
      const gameData = firebaseData.GAME;
      const gameState = gameData.data.payload.gameState;
      gameState.currentState.allocatedTime = TURN_TIMERS_MS.executeTrade;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);

      const tradeObj =
        gameState.tradeState.activeOffers[parsed.payload.tradeId];
      Object.keys(gameState.tradeState.activeOffers).forEach((key) => {
        gameState.tradeState.activeOffers[key] = null;
      });

      addGameLogEntry(gameState, {
        text: {
          type: GameLogMessageType.PlayerTradedWithPlayer,
          acceptingPlayerColor: parsed.payload.playerToExecuteTradeWith,
          givenCardEnums: tradeObj.offeredResources,
          playerColor: tradeObj.creator,
          receivedCardEnums: tradeObj.wantedResources,
        },
        from: tradeObj.creator,
      });

      const exchangeCardsPayload = {
        givingPlayer: tradeObj.creator,
        givingCards: tradeObj.offeredResources,
        receivingPlayer: parsed.payload.playerToExecuteTradeWith,
        receivingCards: tradeObj.wantedResources,
      };
      applyResourceExchangeWithPlayers(
        gameState,
        exchangeCardsPayload.givingPlayer,
        exchangeCardsPayload.givingCards,
        exchangeCardsPayload.receivingPlayer,
        exchangeCardsPayload.receivingCards,
      );

      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExchangeCards,
          payload: exchangeCardsPayload,
        },
      });

      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          action: "ExecuteTrade",
          exchangeCardsPayloads: [exchangeCardsPayload],
        },
      );
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
      sendEdgeHighlights31(gameData, false);
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
      gameState.currentState.actionState = PlayerActionState.PlaceCity;
      sendCornerHighlights30(gameData, []);
      sendTileHighlights33(gameData);
      sendEdgeHighlights31(gameData);
      sendShipHighlights32(gameData);
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
      const devCardsState = getByPlayerColor(
        gameState.mechanicDevelopmentCardsState?.players as
          | StringMap<DevelopmentCardPlayerState>
          | undefined,
        playerColor,
      );
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

      const usedKnightCount = (
        devCardsState?.developmentCardsUsed ?? []
      ).filter((card) => card === CardEnum.Knight).length;

      addGameLogEntry(gameState, {
        text: {
          type: GameLogMessageType.PlayerPlayedDevelopmentCard,
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
        const gameStateWithLargestArmy = gameState as GameStateWithLargestArmy;
        const largestArmyState =
          (gameStateWithLargestArmy.mechanicLargestArmyState ??
            (() => {
              const nextState = {} as NumericMap<LargestArmyMechanicState>;
              gameStateWithLargestArmy.mechanicLargestArmyState =
                nextState as GameStateWithLargestArmy["mechanicLargestArmyState"];
              return nextState;
            })()) as NumericMap<LargestArmyMechanicState>;
        if (!largestArmyState[playerColor]) {
          largestArmyState[playerColor] = {} as LargestArmyMechanicState;
        }
        largestArmyState[playerColor].hasLargestArmy = true;
        const playerState = getPlayerStateByColor(gameState, playerColor);
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
      const exchangeCardsPayload = {
        givingPlayer: playerColor,
        givingCards: clickedCard != null ? [clickedCard] : [],
        receivingPlayer: BANK_INDEX,
        receivingCards: [],
      };

      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExchangeCards,
          payload: exchangeCardsPayload,
        },
      });
      if (clickedCard === CardEnum.RoadBuilding) {
        sendEdgeHighlights31(gameData, false);
      } else {
        sendCornerHighlights30(gameData, []);
        sendTileHighlights33(gameData, []);
        sendEdgeHighlights31(gameData);
        sendShipHighlights32(gameData);
        sendTileHighlights33(gameData, getRobberEligibleTiles(gameData));
      }

      setFirebaseData(
        { ...firebaseData, GAME: gameData },
        {
          ClickedDevelopmentCard: clickedCard,
          exchangeCardsPayloads: [exchangeCardsPayload],
        },
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
      const playerState = getPlayerStateByColor(gameState, currentPlayer);
      if (playerState?.resourceCards?.cards) {
        playerState.resourceCards = {
          cards: removePlayerCards(
            playerState.resourceCards.cards as number[],
            selectedCards,
          ),
        };
      }
      const bankResourceCards = gameState.bankState?.resourceCards as
        | NumericMap<number>
        | undefined;
      if (bankResourceCards) {
        selectedCards.forEach((card) => {
          bankResourceCards[card] = (bankResourceCards[card] ?? 0) + 1;
        });
      }

      const exchangeCardsPayload = {
        givingPlayer: currentPlayer,
        givingCards: selectedCards,
        receivingPlayer: BANK_INDEX,
        receivingCards: [],
      };

      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExchangeCards,
          payload: exchangeCardsPayload,
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
      if (getPlayerStateByColor(gameState, currentPlayer)) {
        const activePlayerState = getPlayerStateByColor(
          gameState,
          currentPlayer,
        );
        if (activePlayerState) {
          activePlayerState.isTakingAction = false;
        }
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
          exchangeCardsPayloads: [exchangeCardsPayload],
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
      const roadCurrentState =
        gameState.currentState as GameStateCurrentWithRuntime;

      if (
        parsed.action !== GameAction.ConfirmBuildShip &&
        (gameState.currentState.actionState ===
          PlayerActionState.Place2MoreRoadBuilding ||
          gameState.currentState.actionState ===
            PlayerActionState.Place1MoreRoadBuilding)
      ) {
        roadCurrentState.pendingRoadBuildingEdgeIndex = edgeIndex;
        return true;
      }

      const stagedRoadEdgeIndex =
        typeof roadCurrentState.pendingRoadBuildingEdgeIndex === "number"
          ? roadCurrentState.pendingRoadBuildingEdgeIndex
          : undefined;
      const edgeIndexToPlace =
        parsed.action === GameAction.ConfirmBuildShip &&
        stagedRoadEdgeIndex != null
          ? stagedRoadEdgeIndex
          : edgeIndex;
      delete roadCurrentState.pendingRoadBuildingEdgeIndex;

      placeRoad(edgeIndexToPlace);
      return true;
    }

    return false;
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

  const playerStates = (gameState?.playerStates ??
    {}) as StringMap<PlayerState>;
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

  const resourceStats: Record<number, EndResourceStats> = {};
  const activityStats: Record<number, EndActivityStats> = {};
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
    const text = (((entry as JsonObject)?.text ?? entry) as JsonObject) ?? {};
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
        ? (text.cardsToBroadcast as number[]).filter((card: number) =>
            Number.isFinite(card),
          )
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
        ? (text.givenCardEnums as number[]).filter((card: number) =>
            Number.isFinite(card),
          )
        : [];
      const receivedCards = Array.isArray(text?.receivedCardEnums)
        ? (text.receivedCardEnums as number[]).filter((card: number) =>
            Number.isFinite(card),
          )
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
        ? (text.cardEnums as number[]).filter((card: number) =>
            Number.isFinite(card),
          )
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
      const cardEnum = parseFiniteIndex(text?.cardEnum);
      if (cardEnum != null) {
        developmentCardStats.push(cardEnum);
      }
      return;
    }

    if (type === GameLogMessageType.BuiltPiece) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      if (playerColor != null) {
        const pieceEnum = parseFiniteIndex(text?.pieceEnum);
        if (pieceEnum != null) {
          addResourcesUsed(playerColor, getPieceCost(pieceEnum));
        }
      }
    }
  });

  if (gameState?.mechanicDevelopmentCardsState?.players) {
    const devCardsFromState: number[] = [];
    Object.values(gameState.mechanicDevelopmentCardsState.players).forEach(
      (player: DevelopmentCardPlayerState) => {
        const playerDevelopmentCards = player.developmentCards?.cards;
        if (Array.isArray(playerDevelopmentCards)) {
          const cards = playerDevelopmentCards;
          devCardsFromState.push(...cards);
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
    Object.values(gameState.playerStates as StringMap<PlayerState>).forEach(
      (player) => {
        const playerResourceCards = player.resourceCards?.cards;
        if (Array.isArray(playerResourceCards)) {
          const cards = playerResourceCards;
          resourceCardsStats.push(...cards);
        }
      },
    );
  }

  Object.values(resourceStats).forEach((stats) => {
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
      getByPlayerColor(playerStates, color)?.victoryPointsState ??
      ({} as NumericMap<number>);
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
        getByPlayerColor(playerStates, color)?.victoryPointsState ??
        ({} as NumericMap<number>);
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
    {} as Record<
      number,
      {
        color: number;
        rank: number;
        victoryPoints: NumericMap<number>;
        winningPlayer: boolean | undefined;
        title: null;
      }
    >,
  );

  const endTime =
    typeof (firebaseData as FirebaseWithMeta)?.__meta?.now === "number"
      ? (firebaseData as FirebaseWithMeta).__meta?.now
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

const getWinner = (): WinnerResult | undefined => {
  const players = firebaseData.GAME?.data?.payload?.gameState.playerStates as
    | StringMap<PlayerState>
    | undefined;
  if (!players) {
    return undefined;
  }
  const winner = Object.entries(players)
    .map(([colorKey, playerState]) => {
      const color = parseFiniteIndex(colorKey);
      if (color == null || !playerState) {
        return null;
      }
      return { color, playerState };
    })
    .filter((entry): entry is { color: number; playerState: PlayerState } =>
      Boolean(entry),
    )
    .find(
      ({ playerState }) =>
        Object.entries(playerState.victoryPointsState ?? {})
          .map(
            ([key, count]) =>
              Number(count) *
              {
                [VictoryPointSource.DevelopmentCardVictoryPoint]: 1,
                [VictoryPointSource.Settlement]: 1,
                [VictoryPointSource.City]: 2,
                [VictoryPointSource.LargestArmy]: 2,
                [VictoryPointSource.LongestRoad]: 2,
              }[Number(key)]!,
          )
          .reduce((a, b) => a + b, 0) >=
        getVictoryPointsToWin(firebaseData.GAME!),
    );
  return winner
    ? {
        color: winner.color,
      }
    : undefined;
};

const calculateLongestRoad = (playerColor: number) => {
  const gameData = firebaseData.GAME!;
  const gameState = gameData.data.payload.gameState;
  const edgeStates = gameState.mapState
    .tileEdgeStates as StringMap<TileEdgeState>;
  const cornerStates = gameState.mapState
    .tileCornerStates as StringMap<TileCornerState>;

  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const visitedEdges = new Set<string>();
  const visitedCorners = new Set<string>();

  const dfs = (cornerKey: string, length: number): number => {
    visitedCorners.add(cornerKey);
    let maxLength = length;

    Object.entries(edgeStates).forEach(([edgeKey, edgeState]) => {
      if (edgeState.owner !== playerColor || visitedEdges.has(edgeKey)) return;

      const endpoints = edgeEndpoints(edgeState);
      const connectedCorner = endpoints.find(
        (endpoint) =>
          serializeCornerKey(endpoint.x, endpoint.y, endpoint.z) === cornerKey,
      );

      if (!connectedCorner) return;

      visitedEdges.add(edgeKey);
      const otherCorner = endpoints.find(
        (endpoint) =>
          serializeCornerKey(endpoint.x, endpoint.y, endpoint.z) !== cornerKey,
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
    });

    visitedCorners.delete(cornerKey);
    return maxLength;
  };

  let longestRoad = 0;

  Object.values(cornerStates).forEach((cornerState) => {
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
  const playerStates = gameState.playerStates as
    | StringMap<PlayerState>
    | undefined;

  const gameStateWithLongestRoad = gameState as GameStateWithLongestRoad;
  const longestRoadState = (gameStateWithLongestRoad.mechanicLongestRoadState ??
    (() => {
      const nextState = {} as NumericMap<LongestRoadMechanicState>;
      gameStateWithLongestRoad.mechanicLongestRoadState =
        nextState as GameStateWithLongestRoad["mechanicLongestRoadState"];
      return nextState;
    })()) as NumericMap<LongestRoadMechanicState>;

  const playerColors = Object.keys(playerStates ?? {})
    .map((colorKey) => Number.parseInt(colorKey, 10))
    .filter((color) => Number.isFinite(color)) as PlayerColor[];

  playerColors.forEach((color) => {
    const previousState = longestRoadState[color] ?? {};
    longestRoadState[color] = {
      ...previousState,
      longestRoad: calculateLongestRoad(color),
    };
    if (longestRoadState[color]?.hasLongestRoad) {
      delete longestRoadState[color].hasLongestRoad;
    }
  });

  const currentHolder = playerColors.find(
    (color) =>
      getByPlayerColor(playerStates, color)?.victoryPointsState?.[
        VictoryPointSource.LongestRoad
      ] === 1,
  );

  const currentHolderLength =
    currentHolder == null
      ? 0
      : (longestRoadState[currentHolder]?.longestRoad ?? 0);
  const challengerLength = longestRoadState[playerColor]?.longestRoad ?? 0;

  if (currentHolder === playerColor) {
    if (challengerLength < LONGEST_ROAD_MIN_LENGTH) {
      delete getByPlayerColor(playerStates, playerColor)?.victoryPointsState?.[
        VictoryPointSource.LongestRoad
      ];
      delete longestRoadState[playerColor]?.hasLongestRoad;
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
    delete getByPlayerColor(playerStates, currentHolder)?.victoryPointsState?.[
      VictoryPointSource.LongestRoad
    ];
    delete longestRoadState[currentHolder]?.hasLongestRoad;
  }

  const challengerState = getByPlayerColor(playerStates, playerColor);
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

  const cornerStates = (gameState.mapState?.tileCornerStates ??
    {}) as StringMap<TileCornerState>;
  const edgeStates = (gameState.mapState?.tileEdgeStates ??
    {}) as StringMap<TileEdgeState>;

  const serializeCornerKey = (x: number, y: number, z: number) =>
    `${x}:${y}:${z}`;

  const ownedCorners = new Set<string>();
  Object.values(cornerStates).forEach((cornerState) => {
    if (cornerState?.owner === playerColor) {
      ownedCorners.add(
        serializeCornerKey(cornerState.x, cornerState.y, cornerState.z),
      );
    }
  });

  const eligibleCorners = Object.entries(cornerStates)
    .map(([key, cornerState]) => ({
      index: Number.parseInt(key, 10),
      cornerState,
    }))
    .filter(({ index, cornerState }) => {
      if (!Number.isFinite(index) || !cornerState) return false;

      // Ensure the corner is unoccupied
      if (cornerState.owner) return false;

      // Ensure no adjacent corners are owned
      const adjacentEdges = Object.values(edgeStates).filter((edgeState) =>
        edgeEndpoints(edgeState).some(
          (endpoint) =>
            serializeCornerKey(endpoint.x, endpoint.y, endpoint.z) ===
            serializeCornerKey(cornerState.x, cornerState.y, cornerState.z),
        ),
      );

      const adjacentCorners = adjacentEdges.flatMap((edgeState) =>
        edgeEndpoints(edgeState).map((endpoint) =>
          serializeCornerKey(endpoint.x, endpoint.y, endpoint.z),
        ),
      );

      if (adjacentCorners.some((cornerKey) => ownedCorners.has(cornerKey))) {
        return false;
      }

      // Ensure the corner is adjacent to an owned road
      return adjacentEdges.some((edgeState) => edgeState.owner === playerColor);
    })
    .map(({ index }) => index);

  return eligibleCorners.length > 0 ? eligibleCorners : null;
}

const getCityEligibleTiles = (): number[] => {
  const gameData = firebaseData.GAME;
  const gameState = gameData?.data?.payload?.gameState;
  const playerColor = gameData?.data?.payload?.playerColor;

  if (!gameState || playerColor == null) {
    return [];
  }

  const cornerStates = (gameState.mapState?.tileCornerStates ??
    {}) as StringMap<TileCornerState>;

  return Object.entries(cornerStates)
    .map(([key, value]) => ({
      index: Number.parseInt(key, 10),
      cornerState: value as TileCornerState,
    }))
    .filter(
      ({ index, cornerState }) =>
        Number.isFinite(index) &&
        cornerState &&
        cornerState.owner === playerColor &&
        cornerState.buildingType === CornerPieceType.Settlement,
    )
    .map(({ index }) => index);
};

export const getNumRounds = () => {
  const payload = firebaseData.GAME!.data.payload;
  return (
    payload.gameState.currentState.completedTurns / payload.playOrder.length
  );
};

export type ResourcesToGiveType = {
  owner: number;
  tileIndex: number;
  distributionType: number;
  card: number;
}[];

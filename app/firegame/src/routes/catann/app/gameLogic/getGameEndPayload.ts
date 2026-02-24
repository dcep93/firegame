import {
  DevelopmentCardPlayerState,
  getByPlayerColor,
  getVictoryPointsToWin,
  getWinner,
  JsonObject,
  NumericMap,
  parseFiniteIndex,
  PlayerState,
  StringMap,
  toNumericRecordEntries,
} from ".";
import { firebaseData } from "../FirebaseWrapper";
import {
  GameLogMessageType,
  MapPieceType,
  VictoryPointSource,
} from "./CatannFilesEnums";

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
        } else if (distributionType === 1) {
          stats.rollingIncome += count;
        } else if (distributionType === 3) {
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

    if (type === GameLogMessageType.PlayerWantsToTradeWith) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      if (playerColor != null) {
        ensureActivityStats(playerColor).proposedTrades += 1;
      }
      return;
    }

    if (type === GameLogMessageType.PlayerTradedWithPlayer) {
      const playerColor = parseFiniteIndex(text?.playerColor);
      const acceptingPlayerColor = parseFiniteIndex(text?.acceptingPlayerColor);
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
      if (playerColor != null) {
        const stats = ensureResourceStats(playerColor);
        stats.tradeIncome += receivedCards.length;
        stats.tradeLoss += givenCards.length;
        ensureActivityStats(playerColor).successfulTrades += 1;
      }
      if (acceptingPlayerColor != null) {
        const stats = ensureResourceStats(acceptingPlayerColor);
        stats.tradeIncome += givenCards.length;
        stats.tradeLoss += receivedCards.length;
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

    if (
      type === GameLogMessageType.StolenResourceCardThief ||
      type === GameLogMessageType.StolenResourceCardVictim
    ) {
      const thiefColor = parseFiniteIndex((entry as JsonObject)?.from);
      const messageColor = parseFiniteIndex(text?.playerColor);
      const cardEnums = Array.isArray(text?.cardEnums)
        ? (text.cardEnums as number[]).filter((card: number) =>
            Number.isFinite(card),
          )
        : [];
      const amount = cardEnums.length;
      if (amount <= 0 || thiefColor == null) {
        return;
      }
      let victimColor: number | null = messageColor;
      if (
        victimColor == null ||
        victimColor === thiefColor ||
        !playerColors.includes(victimColor)
      ) {
        victimColor = playerColors.find((c) => c !== thiefColor) ?? null;
      }
      ensureResourceStats(thiefColor).robbingIncome += amount;
      if (victimColor != null) {
        ensureResourceStats(victimColor).robbingLoss += amount;
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
        title: winningColor != null && color === winningColor ? 1 : null,
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
        title: number | null;
      }
    >,
  );

  const endTime =
    typeof (firebaseData as FirebaseWithMeta)?.__meta?.now === "number"
      ? (firebaseData as FirebaseWithMeta).__meta?.now
      : Date.now();
  resourceCardsStats.sort((a, b) => a - b);
  const getValidTimestamp = (value: unknown) => {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      return undefined;
    }
    return value;
  };
  const startTime =
    (typeof window !== "undefined"
      ? (getValidTimestamp(window.__testOverrides?.startTime) ??
        getValidTimestamp(window.parent?.__testOverrides?.startTime) ??
        getValidTimestamp(
          window.parent?.__testOverrides?.databaseGame?.data?.payload?.gameState
            ?.currentState?.startTime,
        ))
      : undefined) ??
    getValidTimestamp(gameState?.currentState?.startTime) ??
    endTime;
  const meColor = parseFiniteIndex(gameData?.data?.payload?.playerColor);

  return {
    endGameState: {
      diceStats,
      resourceCardsStats,
      developmentCardStats,
      gameDurationInMS: Math.max(0, endTime - startTime),
      totalTurnCount: (gameState?.currentState?.completedTurns ?? 0) + 1,
      players,
      resourceStats,
      activityStats,
    },
    isReplayAvailable: logEntries.length > 0,
    rankedUserStates: playerColors
      .filter((color) => (meColor == null ? true : color !== meColor))
      .map((color) => ({
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
export default getGameEndPayload;

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

type FirebaseWithMeta = typeof firebaseData & { __meta?: { now?: number } };

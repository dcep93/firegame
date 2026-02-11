import { NUM_DEV_CARDS, sendCornerHighlights30 } from ".";
import store from "../../../../shared/store";
import { firebaseData } from "../FirebaseWrapper";
import { FUTURE, sendToMainSocket } from "../handleMessage";
import {
  CardEnum,
  DiceDistributionType,
  ExpansionType,
  GameLogMessageType,
  GameModeId,
  GamePhase,
  GameStateUpdateType,
  GameType,
  MapId,
  PlatformType,
  PlayerActionState,
  PlayerColor,
  PortType,
  SeafarersScenarioId,
  State,
  StoreAvatarItemType,
  StoreColorItemType,
  StoreItemCategory,
  StoreMapItemType,
  TileType,
  TurnTimerType,
  UserIcon,
  UserRole,
} from "./CatannFilesEnums";
import { tileCornerStates, tileEdgeStates } from "./utils";

declare global {
  interface Window {
    __testOverrides:
      | {
          databaseGame: any;
          session: any;
          startTime: number;
          mapState: any;
        }
      | undefined;
    __testSeed: any;
  }
}

export const colonistVersion = 2900;

export const newUserState = () => {
  return {
    csrfToken: "csrfToken",
    userState: {
      accessLevel: UserRole.User,
      colonistCoins: 0,
      colonistVersion,
      giftedMemberships: [],
      icon: UserIcon.Guest,
      id: store.me.userId,
      interactedWithSite: true,
      isLoggedIn: true,
      hasJoinedColonistDiscordServer: false,
      karma: 0,
      karmaCompletedGameCount: 0,
      membershipPaymentMethod: null,
      membershipPending: false,
      isMuted: false,
      ownedItems: [
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.Seafarers4P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.CitiesAndKnights4P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.TradersAndBarbarians,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.ExplorersAndPirates,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.Classic56P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.Classic78P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.Seafarers56P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.CitiesAndKnights56P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.CitiesAndKnightsSeafarers4P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.CitiesAndKnightsSeafarers56P,
        },
        {
          category: StoreItemCategory.Expansion,
          type: ExpansionType.ColonistRush4P,
        },
        { category: StoreItemCategory.Map, type: StoreMapItemType.Earth },
        { category: StoreItemCategory.Map, type: StoreMapItemType.USA },
        { category: StoreItemCategory.Map, type: StoreMapItemType.UK },
        { category: StoreItemCategory.Map, type: StoreMapItemType.Diamond },
        { category: StoreItemCategory.Map, type: StoreMapItemType.Gear },
        { category: StoreItemCategory.Map, type: StoreMapItemType.Lakes },
        { category: StoreItemCategory.Map, type: StoreMapItemType.Pond },
        { category: StoreItemCategory.Map, type: StoreMapItemType.Twirl },
        {
          category: StoreItemCategory.Map,
          type: StoreMapItemType.Classic4PRandom,
        },
        {
          category: StoreItemCategory.Map,
          type: StoreMapItemType.ShuffleBoard,
        },
        { category: StoreItemCategory.Map, type: StoreMapItemType.BlackForest },
        { category: StoreItemCategory.Map, type: StoreMapItemType.Volcano },
        { category: StoreItemCategory.Map, type: StoreMapItemType.GoldRush },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.FounderHat,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.ColonistHat,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.SettlerHat,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.ChristmasHat,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Player,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.PirateShip,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.MedalGold,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.MedalSilver,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.MedalBronze,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Elephant,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Avocado,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Cactus,
        },
        { category: StoreItemCategory.Avatar, type: StoreAvatarItemType.Crown },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Swords,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Helmet,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Snorkel,
        },
        { category: StoreItemCategory.Avatar, type: StoreAvatarItemType.Scarf },
        { category: StoreItemCategory.Avatar, type: StoreAvatarItemType.Tie },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Worker,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Sombrero,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Farmer,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.RobberSanta,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.RobberLunar,
        },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.RobberCupid,
        },
        { category: StoreItemCategory.Avatar, type: StoreAvatarItemType.Mummy },
        {
          category: StoreItemCategory.Avatar,
          type: StoreAvatarItemType.Gifter,
        },
        { category: StoreItemCategory.Color, type: StoreColorItemType.Gold },
        { category: StoreItemCategory.Color, type: StoreColorItemType.Silver },
        { category: StoreItemCategory.Color, type: StoreColorItemType.Bronze },
        { category: StoreItemCategory.Color, type: StoreColorItemType.Black },
        { category: StoreItemCategory.Color, type: StoreColorItemType.Purple },
        {
          category: StoreItemCategory.Color,
          type: StoreColorItemType.MysticBlue,
        },
        { category: StoreItemCategory.Color, type: StoreColorItemType.White },
        { category: StoreItemCategory.Color, type: StoreColorItemType.Pink },
      ],
      totalCompletedGameCount: 1,
      ckTotalGameCount: 0,
      ckNextRerollAt: FUTURE,
      username: store.me.userId,
      language: null,
      usernameChangeAttemptsLeft: 1,
      forceSubscription: true,
      expiresAt: FUTURE,
    },
  };
};

export const getRoomId = () =>
  window.location.hash.slice(1) || `roomIdx${store.me.roomId}`;

export const newRoom = () => {
  return {
    id: State.RoomEvent.toString(),
    data: {
      roomId: getRoomId(),
      type: "StateUpdated",
      updateSequence: Date.now(),
      private: true,
      playOrderSelectionActive: false,
      minimumKarma: 0,
      gameMode: "classic4P",
      map: "classic4P",
      diceType: "balanced",
      victoryPointsToWin: 10,
      victoryPointsRecommendedLimit: 22,
      victoryPointsMaxAllowed: 20,
      cardDiscardLimit: 7,
      maxPlayers: 4,
      gameSpeed: "base120s",
      botSpeed: "normal",
      hiddenBankCards: false,
      friendlyRobber: true,
      isTournament: false,
      isTestFreeExpansionsAndMaps: false,
      kickedUserIds: [],
      creationPhase: "settings",
      sessions: [] as ReturnType<typeof newRoomMe>[],
    },
  };
};

export const newRoomMe = (sessions: { selectedColor: string }[]) => {
  const availableColors = colorHelper.map(({ str }) => str);
  const takenColors = sessions.map(({ selectedColor }) => selectedColor);
  return {
    roomSessionId: store.me.roomId.toString(),
    userSessionId: store.me.userId,
    userId: store.me.userId,
    isBot: false,
    isReadyToPlay: true,
    selectedColor: availableColors.find((c) => !takenColors.includes(c))!,
    username: store.me.userId,
    isMember: false,
    icon: UserIcon.Guest,
    profilePictureUrl: null,
    karmaCompletedGames: 0,
    karmaTotalGames: 0,
    availableColors,
    botDifficulty: null,
  };
};

const colorHelper = Object.values(PlayerColor)
  .filter((v) => isNaN(v as number))
  .filter((v) => v !== PlayerColor[PlayerColor.None])
  .map((v) => v as string)
  .map((v) => ({
    int: PlayerColor[v as keyof typeof PlayerColor],
    str: v[0].toLowerCase().concat(v.slice(1)),
  }));

export const newGame = () => {
  const room: ReturnType<typeof newRoom> = firebaseData.ROOM!;
  const sessions = room.data.sessions;
  const mapState = window.__testOverrides?.mapState ?? newMapState();
  const colorForSession = (selectedColor: string) =>
    colorHelper.find(({ str }) => str === selectedColor)!.int;
  const sessionColorEntries = sessions.map((session) => ({
    session,
    color: colorForSession(session.selectedColor),
  }));
  const buildByColor = <T>(
    build: (color: PlayerColor, session: (typeof sessions)[number]) => T,
  ) =>
    sessionColorEntries.reduce(
      (acc, { color, session }) => {
        acc[color] = build(color, session);
        return acc;
      },
      {} as Record<PlayerColor, T>,
    );
  const playOrder = sessionColorEntries
    .map(({ color }) => ({ v: Math.random(), color }))
    .sort((a, b) => a.v - b.v)
    .map(({ color }) => color);
  return {
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.BuildGame,
      payload: {
        playerColor: PlayerColor.None,
        playOrder,
        gameState: {
          diceState: {
            diceThrown: false,
            dice1: 1,
            dice2: 1,
          },
          bankState: {
            hideBankCards: false,
            resourceCards: {
              [CardEnum.Lumber]: 19,
              [CardEnum.Brick]: 19,
              [CardEnum.Wool]: 19,
              [CardEnum.Grain]: 19,
              [CardEnum.Ore]: 19,
            },
          },
          mapState,
          currentState: {
            completedTurns: 0,
            turnState: GamePhase.InitialPlacement,
            actionState: PlayerActionState.InitialPlacementPlaceSettlement,
            currentTurnPlayerColor: playOrder[0],
            startTime: window.__testOverrides?.startTime ?? Date.now(),
            allocatedTime: 120,
          },
          tradeState: {
            activeOffers: {},
            closedOffers: {},
            embargoState: buildByColor(() => ({
              activeEmbargosAgainst: [],
            })),
          },
          playerStates: buildByColor((color) => ({
            color,
            victoryPointsState: {},
            bankTradeRatiosState: {
              [CardEnum.Lumber]: 4,
              [CardEnum.Brick]: 4,
              [CardEnum.Wool]: 4,
              [CardEnum.Grain]: 4,
              [CardEnum.Ore]: 4,
            },
            resourceCards: {
              cards: [],
            },
            cardDiscardLimit: 7,
            isConnected: true,
            isTakingAction: false,
          })),
          gameLogState: {
            "0": {
              text: {
                type: GameLogMessageType.WelcomeMessage,
                isDiscord: false,
              },
            },
            "1": {
              text: {
                type: GameLogMessageType.Separator,
              },
            },
          },
          gameChatState: {},
          mechanicSettlementState: buildByColor(() => ({
            bankSettlementAmount: 5,
          })),
          mechanicCityState: buildByColor(() => ({
            bankCityAmount: 4,
          })),
          mechanicRoadState: buildByColor(() => ({
            bankRoadAmount: 15,
          })),
          mechanicDevelopmentCardsState: {
            bankDevelopmentCards: {
              cards: Array.from(
                { length: NUM_DEV_CARDS },
                () => CardEnum.DevelopmentBack,
              ),
            },
            players: buildByColor(() => ({
              developmentCards: {
                cards: [],
              },
              developmentCardsUsed: [],
            })),
          },
          mechanicLongestRoadState: buildByColor(() => ({
            longestRoad: 0,
          })),
          mechanicLargestArmyState: buildByColor(() => ({})),
          mechanicRobberState: {
            locationTileIndex: Object.entries(mapState.tileHexStates)
              .map(([indexStr, data]) => ({
                index: parseInt(indexStr),
                data: data as any,
              }))
              .find(({ data }) => data.type === TileType.Desert)!.index,
            isActive: true,
          },
        },
        playerUserStates: sessions.map((s) => ({
          userId: window.__testOverrides?.session.userId ?? s.userId,
          username: window.__testOverrides?.session.username ?? s.username,
          databaseIcon: s.icon,
          selectedColor: colorHelper.find(({ str }) => str === s.selectedColor)!
            .int,
          isBot: false,
          deviceType: PlatformType.Web,
          countryCode: "US",
          regionUpdated: null,
          membership: null,
          profilePictureUrl: null,
        })),
        gameDetails: {
          isRanked: false,
          isDiscord: false,
        },
        gameSettings: {
          id:
            window.__testOverrides?.databaseGame.gameSettingId ??
            room.data.roomId,
          channelId: null,
          gameType: GameType.CreatedRoomGame,
          privateGame: true,
          playOrderSelectionActive: false,
          minimumKarma: 0,
          eloType: 0,
          modeSetting: GameModeId.Classic4P,
          extensionSetting: 0, // ExpansionType.None,
          scenarioSetting: SeafarersScenarioId.None,
          mapSetting: MapId.Classic4P,
          diceSetting: DiceDistributionType.Balanced,
          victoryPointsToWin: 10,
          karmaActive: false,
          cardDiscardLimit: 7,
          maxPlayers: 4,
          gameSpeed: TurnTimerType.Base60s,
          botSpeed: 0,
          hideBankCards: false,
          friendlyRobber: true,
        },
        timeLeftInState: 180,
      },
    },
  };
};

const newMapState = () => {
  return {
    tileHexStates: {
      "0": {
        x: 0,
        y: -2,
        type: TileType.Grain,
        diceNumber: 8,
      },
      "1": {
        x: -1,
        y: -1,
        type: TileType.Ore,
        diceNumber: 10,
      },
      "2": {
        x: -2,
        y: 0,
        type: TileType.Desert,
        diceNumber: 0,
      },
      "3": {
        x: -2,
        y: 1,
        type: TileType.Ore,
        diceNumber: 9,
      },
      "4": {
        x: -2,
        y: 2,
        type: TileType.Lumber,
        diceNumber: 12,
      },
      "5": {
        x: -1,
        y: 2,
        type: TileType.Lumber,
        diceNumber: 11,
      },
      "6": {
        x: 0,
        y: 2,
        type: TileType.Wool,
        diceNumber: 4,
      },
      "7": {
        x: 1,
        y: 1,
        type: TileType.Wool,
        diceNumber: 8,
      },
      "8": {
        x: 2,
        y: 0,
        type: TileType.Grain,
        diceNumber: 5,
      },
      "9": {
        x: 2,
        y: -1,
        type: TileType.Ore,
        diceNumber: 2,
      },
      "10": {
        x: 2,
        y: -2,
        type: TileType.Lumber,
        diceNumber: 6,
      },
      "11": {
        x: 1,
        y: -2,
        type: TileType.Wool,
        diceNumber: 3,
      },
      "12": {
        x: 0,
        y: -1,
        type: TileType.Brick,
        diceNumber: 4,
      },
      "13": {
        x: -1,
        y: 0,
        type: TileType.Wool,
        diceNumber: 5,
      },
      "14": {
        x: -1,
        y: 1,
        type: TileType.Brick,
        diceNumber: 6,
      },
      "15": {
        x: 0,
        y: 1,
        type: TileType.Grain,
        diceNumber: 3,
      },
      "16": {
        x: 1,
        y: 0,
        type: TileType.Lumber,
        diceNumber: 10,
      },
      "17": {
        x: 1,
        y: -1,
        type: TileType.Grain,
        diceNumber: 9,
      },
      "18": {
        x: 0,
        y: 0,
        type: TileType.Brick,
        diceNumber: 11,
      },
    },
    portEdgeStates: {
      "0": {
        x: 0,
        y: -2,
        z: 0,
        type: PortType.PortLumber,
      },
      "1": {
        x: -2,
        y: 2,
        z: 2,
        type: PortType.Port,
      },
      "2": {
        x: -1,
        y: 3,
        z: 0,
        type: PortType.PortGrain,
      },
      "3": {
        x: 3,
        y: 0,
        z: 1,
        type: PortType.PortWool,
      },
      "4": {
        x: -1,
        y: -1,
        z: 1,
        type: PortType.Port,
      },
      "5": {
        x: -2,
        y: 1,
        z: 1,
        type: PortType.Port,
      },
      "6": {
        x: 1,
        y: 2,
        z: 0,
        type: PortType.PortBrick,
      },
      "7": {
        x: 2,
        y: -3,
        z: 2,
        type: PortType.Port,
      },
      "8": {
        x: 3,
        y: -2,
        z: 2,
        type: PortType.PortOre,
      },
    },
    tileCornerStates,
    tileEdgeStates,
  };
};

export const startGame = () => {
  const newFirstGameState = () => {
    const room = firebaseData.ROOM!;
    return {
      id: State.GameStateUpdate.toString(),
      data: {
        type: GameStateUpdateType.FirstGameState,
        payload: {
          serverId: room.data.roomId,
          databaseGameId: room.data.roomId,
          gameSettingId: room.data.roomId,
          shouldResetGameClient: false,
          isReconnectingSession: false,
          ...window.__testOverrides?.databaseGame,
        },
      },
    };
  };

  sendToMainSocket?.(newFirstGameState());
  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.PlayTurnSound,
      payload: [],
    },
  });
  const selectedColor = firebaseData.ROOM!.data.sessions.find(
    (s) => s,
  )!.selectedColor;
  firebaseData.GAME!.data.payload.playerColor = colorHelper.find(
    ({ str }) => str === selectedColor,
  )!.int;
  sendToMainSocket?.(firebaseData.GAME);

  sendToMainSocket?.({
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.KarmaState,
      payload: false,
    },
  });
  sendCornerHighlights30(firebaseData.GAME);
};

export const spoofHostRoom = () => {
  return (
    firebaseData.GAME ?? {
      ...firebaseData.ROOM,
      data: {
        ...firebaseData.ROOM!.data,
        sessions: (firebaseData.ROOM!.data.sessions.slice() as any[]).sort(
          (a, b) => (a.userId === store.me.userId ? -1 : 1),
        ),
      },
    }
  );
};

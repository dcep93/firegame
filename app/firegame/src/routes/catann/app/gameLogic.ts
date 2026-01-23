import store from "../../../shared/store";
import { State } from "./catann_files_enums";
import { firebaseData } from "./FirebaseWrapper";
import { FUTURE } from "./handleMessage";

export const newUserState = () => {
  console.log("newUserState");
  return {
    userState: {
      userSessionId: store.me.userId,
      accessLevel: 1,
      colonistCoins: 108_000,
      colonistVersion: 1080,
      giftedMemberships: [],
      icon: 11,
      id: store.me.userId,
      interactedWithSite: true,
      isLoggedIn: true,
      hasJoinedColonistDiscordServer: false,
      karma: 20,
      karmaCompletedGameCount: 20,
      membershipPaymentMethod: "Stripe",
      membershipPending: false,
      membership: 5,
      membershipEndDate: FUTURE,
      isMuted: false,
      ownedItems: [
        // Expansions (category 1)
        { category: 1, type: 0 }, // Seafarers4P
        { category: 1, type: 1 }, // CitiesAndKnights4P
        { category: 1, type: 2 }, // TradersAndBarbarians
        { category: 1, type: 3 }, // ExplorersAndPirates
        { category: 1, type: 4 }, // Classic56P
        { category: 1, type: 5 }, // Classic78P
        { category: 1, type: 6 }, // Seafarers56P
        { category: 1, type: 7 }, // CitiesAndKnights56P
        { category: 1, type: 8 }, // CitiesAndKnightsSeafarers4P
        { category: 1, type: 9 }, // CitiesAndKnightsSeafarers56P
        // Maps (category 2)
        { category: 2, type: 0 }, // Earth
        { category: 2, type: 1 }, // USA
        { category: 2, type: 2 }, // UK
        { category: 2, type: 3 }, // Diamond
        { category: 2, type: 4 }, // Gear
        { category: 2, type: 5 }, // Lakes
        { category: 2, type: 6 }, // Pond
        { category: 2, type: 7 }, // Twirl
        { category: 2, type: 8 }, // Classic4PRandom
        { category: 2, type: 9 }, // ShuffleBoard
        { category: 2, type: 10 }, // BlackForest
        { category: 2, type: 11 }, // Volcano
        { category: 2, type: 12 }, // GoldRush
        // Avatars (category 3)
        { category: 3, type: 0 }, // FounderHat
        { category: 3, type: 1 }, // ColonistHat
        { category: 3, type: 2 }, // SettlerHat
        { category: 3, type: 3 }, // ChristmasHat
        { category: 3, type: 4 }, // Player
        { category: 3, type: 5 }, // PirateShip
        { category: 3, type: 6 }, // MedalGold
        { category: 3, type: 7 }, // MedalSilver
        { category: 3, type: 8 }, // MedalBronze
        { category: 3, type: 9 }, // Elephant
        { category: 3, type: 10 }, // Avocado
        { category: 3, type: 11 }, // Cactus
        { category: 3, type: 12 }, // Crown
        { category: 3, type: 13 }, // Swords
        { category: 3, type: 14 }, // Helmet
        { category: 3, type: 15 }, // Snorkel
        { category: 3, type: 16 }, // Scarf
        { category: 3, type: 17 }, // Tie
        { category: 3, type: 18 }, // Worker
        { category: 3, type: 19 }, // Sombrero
        { category: 3, type: 20 }, // Farmer
        { category: 3, type: 21 }, // RobberSanta
        { category: 3, type: 22 }, // RobberLunar
        { category: 3, type: 23 }, // RobberCupid
        { category: 3, type: 24 }, // Mummy
        { category: 3, type: 25 }, // Gifter
      ],
      //   totalCompletedGameCount: 441,
      //   ckTotalGameCount: 0,
      //   ckNextRerollAt: "2026-01-17T19:30:46.992Z",
      username: store.me.userId,
      language: null,
      //   usernameChangeAttemptsLeft: 0,
      forceSubscription: true,
      //   vliHash:
      //     "be7ff6257c114e96bf8bd088e74f557e7d0763d174985bb66a9f00b0df4e0661",
      expiresAt: FUTURE,
    },
    csrfToken:
      "e3eb1249fa0460b5c60c8c51c405365f88d9b20a0c0e9b6b1684a2b048b4aad0ab6e1f8424b0185bb61b1f6373f9324a94644e964ce348927fc8347eedd7d16b",
    abTests: {
      //   CHAT_TOXICITY_SHOW_MONITORED_WARNING:
      //     "SHOW_CHAT_IS_MONITORED_WARNING",
      //   CK_MONETIZATION_DICE_ROLL: "FREE_PLAYS_THEN_DICE_ROLL",
      //   GIFTING_CHANGE_BEST_VALUE_HINT: "SHOW_MOST_POPULAR",
      //   MOBILE_MY_TURN_NOTIFICATION: "DEFAULT",
      //   REACTIVATE_DISCORD_INACTIVE_USERS:
      //     "GROUP_A_YOU_HAVE_NOT_PLAYED_FOR_A_WHILE",
    },
  };
};

export const newRoom = () => {
  console.log("newRoom");
  return {
    id: State.RoomEvent.toString(),
    data: {
      roomId: `roomIdx${store.me.roomId.toString()}`,
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
      sessions: [],
    },
  };
};

export const newRoomMe = () => {
  console.log("newRoomMe");
  return {
    roomSessionId: "1141816",
    userSessionId: store.me.userId,
    userId: store.me.userId,
    isBot: false,
    isReadyToPlay: true,
    selectedColor: "red",
    username: store.me.userId,
    isMember: false,
    icon: 12,
    profilePictureUrl: null,
    karmaCompletedGames: 0,
    karmaTotalGames: 0,
    availableColors: ["red", "blue", "orange", "green"],
    botDifficulty: null,
  };
};

export const newGame = () => {
  console.log("newGame");
  const room = firebaseData.ROOM;
  const sessions = room.data.sessions as any[];
  const mapState = newMapState();
  return {
    id: State.GameStateUpdate.toString(),
    data: {
      type: 4,
      sequence: 2,
      payload: {
        playerColor: 1,
        playOrder: [1],
        gameState: {
          diceState: {
            diceThrown: false,
            dice1: 1,
            dice2: 1,
          },
          bankState: {
            hideBankCards: false,
            resourceCards: {
              "1": 19,
              "2": 19,
              "3": 19,
              "4": 19,
              "5": 19,
            },
          },
          mapState,
          currentState: {
            completedTurns: 0,
            turnState: 0,
            actionState: 1,
            currentTurnPlayerColor: 1,
            startTime: Date.now(),
            allocatedTime: 180,
          },
          tradeState: {
            activeOffers: {},
            closedOffers: {},
            embargoState: {
              "1": {
                activeEmbargosAgainst: [],
              },
            },
          },
          playerStates: {
            "1": {
              color: 1,
              victoryPointsState: {},
              bankTradeRatiosState: {
                "1": 4,
                "2": 4,
                "3": 4,
                "4": 4,
                "5": 4,
              },
              resourceCards: {
                cards: [],
              },
              cardDiscardLimit: 7,
              isConnected: true,
              isTakingAction: false,
            },
          },
          gameLogState: {
            "0": {
              text: {
                type: 2,
                isDiscord: false,
              },
            },
            "1": {
              text: {
                type: 44,
              },
            },
          },
          gameChatState: {},
          mechanicSettlementState: {
            "1": {
              bankSettlementAmount: 5,
            },
          },
          mechanicCityState: {
            "1": {
              bankCityAmount: 4,
            },
          },
          mechanicRoadState: {
            "1": {
              bankRoadAmount: 15,
            },
          },
          mechanicDevelopmentCardsState: {
            bankDevelopmentCards: {
              cards: [
                10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
                10, 10, 10, 10, 10, 10, 10, 10, 10,
              ],
            },
            players: {
              "1": {
                developmentCards: {
                  cards: [],
                },
                developmentCardsUsed: [],
              },
            },
          },
          mechanicLongestRoadState: {
            "1": {
              longestRoad: 0,
            },
          },
          mechanicLargestArmyState: {
            "1": {},
          },
          mechanicRobberState: {
            locationTileIndex: 2,
            isActive: true,
          },
        },
        playerUserStates: sessions.map((s, i) => ({
          userId: s.userId,
          username: s.username,
          databaseIcon: s.icon,
          selectedColor: 1,
          isBot: false,
          deviceType: 1,
          countryCode: "US",
          regionUpdated: null,
          membership: null,
          profilePictureUrl: null,
        })),
        gameDetails: {
          isRanked: false,
          isDiscord: false,
        },
        isReplay: false,
        isAfterLiveGame: false,
        gameSettings: {
          id: room.data.roomId,
          channelId: null,
          gameType: 3,
          privateGame: false,
          playOrderSelectionActive: false,
          minimumKarma: 0,
          eloType: 0,
          modeSetting: 0,
          extensionSetting: 0,
          scenarioSetting: 0,
          mapSetting: 0,
          diceSetting: 1,
          victoryPointsToWin: 10,
          karmaActive: false,
          cardDiscardLimit: 7,
          maxPlayers: 4,
          gameSpeed: 2,
          botSpeed: 1,
          hideBankCards: false,
          friendlyRobber: false,
        },
        timeLeftInState: 180,
      },
    },
  };
};

export const newFirstGameState = () => {
  const room = firebaseData.ROOM;
  return {
    id: State.GameStateUpdate.toString(),
    data: {
      type: 1,
      sequence: 1,
      payload: {
        serverId: "08CC38",
        databaseGameId: room.data.roomId,
        gameSettingId: room.data.roomId,
        shouldResetGameClient: false,
        isReconnectingSession: false,
      },
    },
  };
};

export const newInitialCornerHighlights = (gameData: {
  data: { payload: { gameState: { mapState: { tileCornerStates: {} } } } };
}) => {
  const cornerIndices = Object.keys(
    gameData.data.payload.gameState.mapState.tileCornerStates,
  )
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value));

  return {
    id: State.GameStateUpdate.toString(),
    data: {
      type: 30,
      sequence: 4,
      payload: cornerIndices,
    },
  };
};

const newMapState = () => {
  console.log("newMapState");
  return {
    tileHexStates: {
      "0": {
        x: 0,
        y: -2,
        type: 4,
        diceNumber: 8,
      },
      "1": {
        x: -1,
        y: -1,
        type: 5,
        diceNumber: 10,
      },
      "2": {
        x: -2,
        y: 0,
        type: 0,
        diceNumber: 0,
      },
      "3": {
        x: -2,
        y: 1,
        type: 5,
        diceNumber: 9,
      },
      "4": {
        x: -2,
        y: 2,
        type: 1,
        diceNumber: 12,
      },
      "5": {
        x: -1,
        y: 2,
        type: 1,
        diceNumber: 11,
      },
      "6": {
        x: 0,
        y: 2,
        type: 3,
        diceNumber: 4,
      },
      "7": {
        x: 1,
        y: 1,
        type: 3,
        diceNumber: 8,
      },
      "8": {
        x: 2,
        y: 0,
        type: 4,
        diceNumber: 5,
      },
      "9": {
        x: 2,
        y: -1,
        type: 5,
        diceNumber: 2,
      },
      "10": {
        x: 2,
        y: -2,
        type: 1,
        diceNumber: 6,
      },
      "11": {
        x: 1,
        y: -2,
        type: 3,
        diceNumber: 3,
      },
      "12": {
        x: 0,
        y: -1,
        type: 2,
        diceNumber: 4,
      },
      "13": {
        x: -1,
        y: 0,
        type: 3,
        diceNumber: 5,
      },
      "14": {
        x: -1,
        y: 1,
        type: 2,
        diceNumber: 6,
      },
      "15": {
        x: 0,
        y: 1,
        type: 4,
        diceNumber: 3,
      },
      "16": {
        x: 1,
        y: 0,
        type: 1,
        diceNumber: 10,
      },
      "17": {
        x: 1,
        y: -1,
        type: 4,
        diceNumber: 9,
      },
      "18": {
        x: 0,
        y: 0,
        type: 2,
        diceNumber: 11,
      },
    },
    tileCornerStates: {
      "0": {
        x: 0,
        y: -2,
        z: 0,
      },
      "1": {
        x: 1,
        y: -3,
        z: 1,
      },
      "2": {
        x: 0,
        y: -1,
        z: 0,
      },
      "3": {
        x: 0,
        y: -2,
        z: 1,
      },
      "4": {
        x: -1,
        y: -1,
        z: 0,
      },
      "5": {
        x: 0,
        y: -3,
        z: 1,
      },
      "6": {
        x: -1,
        y: 0,
        z: 0,
      },
      "7": {
        x: -1,
        y: -1,
        z: 1,
      },
      "8": {
        x: -2,
        y: 0,
        z: 0,
      },
      "9": {
        x: -1,
        y: -2,
        z: 1,
      },
      "10": {
        x: -2,
        y: 1,
        z: 0,
      },
      "11": {
        x: -2,
        y: 0,
        z: 1,
      },
      "12": {
        x: -3,
        y: 1,
        z: 0,
      },
      "13": {
        x: -2,
        y: -1,
        z: 1,
      },
      "14": {
        x: -1,
        y: 0,
        z: 1,
      },
      "15": {
        x: -2,
        y: 2,
        z: 0,
      },
      "16": {
        x: -2,
        y: 1,
        z: 1,
      },
      "17": {
        x: -3,
        y: 2,
        z: 0,
      },
      "18": {
        x: -1,
        y: 1,
        z: 1,
      },
      "19": {
        x: -2,
        y: 3,
        z: 0,
      },
      "20": {
        x: -2,
        y: 2,
        z: 1,
      },
      "21": {
        x: -3,
        y: 3,
        z: 0,
      },
      "22": {
        x: -1,
        y: 2,
        z: 0,
      },
      "23": {
        x: 0,
        y: 1,
        z: 1,
      },
      "24": {
        x: -1,
        y: 3,
        z: 0,
      },
      "25": {
        x: -1,
        y: 2,
        z: 1,
      },
      "26": {
        x: 0,
        y: 2,
        z: 0,
      },
      "27": {
        x: 1,
        y: 1,
        z: 1,
      },
      "28": {
        x: 0,
        y: 3,
        z: 0,
      },
      "29": {
        x: 0,
        y: 2,
        z: 1,
      },
      "30": {
        x: 1,
        y: 1,
        z: 0,
      },
      "31": {
        x: 2,
        y: 0,
        z: 1,
      },
      "32": {
        x: 1,
        y: 2,
        z: 0,
      },
      "33": {
        x: 1,
        y: 0,
        z: 1,
      },
      "34": {
        x: 2,
        y: 0,
        z: 0,
      },
      "35": {
        x: 3,
        y: -1,
        z: 1,
      },
      "36": {
        x: 2,
        y: 1,
        z: 0,
      },
      "37": {
        x: 2,
        y: -1,
        z: 1,
      },
      "38": {
        x: 2,
        y: -1,
        z: 0,
      },
      "39": {
        x: 3,
        y: -2,
        z: 1,
      },
      "40": {
        x: 1,
        y: 0,
        z: 0,
      },
      "41": {
        x: 2,
        y: -2,
        z: 1,
      },
      "42": {
        x: 2,
        y: -2,
        z: 0,
      },
      "43": {
        x: 3,
        y: -3,
        z: 1,
      },
      "44": {
        x: 1,
        y: -1,
        z: 0,
      },
      "45": {
        x: 2,
        y: -3,
        z: 1,
      },
      "46": {
        x: 1,
        y: -2,
        z: 0,
      },
      "47": {
        x: 1,
        y: -2,
        z: 1,
      },
      "48": {
        x: 0,
        y: 0,
        z: 0,
      },
      "49": {
        x: 0,
        y: -1,
        z: 1,
      },
      "50": {
        x: -1,
        y: 1,
        z: 0,
      },
      "51": {
        x: 0,
        y: 0,
        z: 1,
      },
      "52": {
        x: 0,
        y: 1,
        z: 0,
      },
      "53": {
        x: 1,
        y: -1,
        z: 1,
      },
    },
    tileEdgeStates: {
      "0": {
        x: 1,
        y: -3,
        z: 2,
      },
      "1": {
        x: 1,
        y: -2,
        z: 1,
      },
      "2": {
        x: 0,
        y: -1,
        z: 0,
      },
      "3": {
        x: 0,
        y: -2,
        z: 2,
      },
      "4": {
        x: 0,
        y: -2,
        z: 1,
      },
      "5": {
        x: 0,
        y: -2,
        z: 0,
      },
      "6": {
        x: 0,
        y: -1,
        z: 1,
      },
      "7": {
        x: -1,
        y: 0,
        z: 0,
      },
      "8": {
        x: -1,
        y: -1,
        z: 2,
      },
      "9": {
        x: -1,
        y: -1,
        z: 1,
      },
      "10": {
        x: -1,
        y: -1,
        z: 0,
      },
      "11": {
        x: -1,
        y: 0,
        z: 1,
      },
      "12": {
        x: -2,
        y: 1,
        z: 0,
      },
      "13": {
        x: -2,
        y: 0,
        z: 2,
      },
      "14": {
        x: -2,
        y: 0,
        z: 1,
      },
      "15": {
        x: -2,
        y: 0,
        z: 0,
      },
      "16": {
        x: -1,
        y: 0,
        z: 2,
      },
      "17": {
        x: -1,
        y: 1,
        z: 1,
      },
      "18": {
        x: -2,
        y: 2,
        z: 0,
      },
      "19": {
        x: -2,
        y: 1,
        z: 2,
      },
      "20": {
        x: -2,
        y: 1,
        z: 1,
      },
      "21": {
        x: -1,
        y: 1,
        z: 2,
      },
      "22": {
        x: -1,
        y: 2,
        z: 1,
      },
      "23": {
        x: -2,
        y: 3,
        z: 0,
      },
      "24": {
        x: -2,
        y: 2,
        z: 2,
      },
      "25": {
        x: -2,
        y: 2,
        z: 1,
      },
      "26": {
        x: 0,
        y: 1,
        z: 2,
      },
      "27": {
        x: 0,
        y: 2,
        z: 1,
      },
      "28": {
        x: -1,
        y: 3,
        z: 0,
      },
      "29": {
        x: -1,
        y: 2,
        z: 2,
      },
      "30": {
        x: -1,
        y: 2,
        z: 0,
      },
      "31": {
        x: 1,
        y: 1,
        z: 2,
      },
      "32": {
        x: 1,
        y: 2,
        z: 1,
      },
      "33": {
        x: 0,
        y: 3,
        z: 0,
      },
      "34": {
        x: 0,
        y: 2,
        z: 2,
      },
      "35": {
        x: 0,
        y: 2,
        z: 0,
      },
      "36": {
        x: 2,
        y: 0,
        z: 2,
      },
      "37": {
        x: 2,
        y: 1,
        z: 1,
      },
      "38": {
        x: 1,
        y: 2,
        z: 0,
      },
      "39": {
        x: 1,
        y: 1,
        z: 1,
      },
      "40": {
        x: 1,
        y: 1,
        z: 0,
      },
      "41": {
        x: 3,
        y: -1,
        z: 2,
      },
      "42": {
        x: 3,
        y: 0,
        z: 1,
      },
      "43": {
        x: 2,
        y: 1,
        z: 0,
      },
      "44": {
        x: 2,
        y: 0,
        z: 1,
      },
      "45": {
        x: 2,
        y: 0,
        z: 0,
      },
      "46": {
        x: 3,
        y: -2,
        z: 2,
      },
      "47": {
        x: 3,
        y: -1,
        z: 1,
      },
      "48": {
        x: 2,
        y: -1,
        z: 2,
      },
      "49": {
        x: 2,
        y: -1,
        z: 1,
      },
      "50": {
        x: 2,
        y: -1,
        z: 0,
      },
      "51": {
        x: 3,
        y: -3,
        z: 2,
      },
      "52": {
        x: 3,
        y: -2,
        z: 1,
      },
      "53": {
        x: 2,
        y: -2,
        z: 2,
      },
      "54": {
        x: 2,
        y: -2,
        z: 1,
      },
      "55": {
        x: 2,
        y: -2,
        z: 0,
      },
      "56": {
        x: 2,
        y: -3,
        z: 2,
      },
      "57": {
        x: 1,
        y: -1,
        z: 0,
      },
      "58": {
        x: 1,
        y: -2,
        z: 2,
      },
      "59": {
        x: 1,
        y: -2,
        z: 0,
      },
      "60": {
        x: 1,
        y: -1,
        z: 1,
      },
      "61": {
        x: 0,
        y: 0,
        z: 0,
      },
      "62": {
        x: 0,
        y: -1,
        z: 2,
      },
      "63": {
        x: 0,
        y: 0,
        z: 1,
      },
      "64": {
        x: -1,
        y: 1,
        z: 0,
      },
      "65": {
        x: 0,
        y: 0,
        z: 2,
      },
      "66": {
        x: 0,
        y: 1,
        z: 1,
      },
      "67": {
        x: 1,
        y: 0,
        z: 2,
      },
      "68": {
        x: 0,
        y: 1,
        z: 0,
      },
      "69": {
        x: 1,
        y: 0,
        z: 1,
      },
      "70": {
        x: 1,
        y: 0,
        z: 0,
      },
      "71": {
        x: 1,
        y: -1,
        z: 2,
      },
    },
    portEdgeStates: {
      "0": {
        x: 0,
        y: -2,
        z: 0,
        type: 2,
      },
      "1": {
        x: -2,
        y: 2,
        z: 2,
        type: 1,
      },
      "2": {
        x: -1,
        y: 3,
        z: 0,
        type: 5,
      },
      "3": {
        x: 3,
        y: 0,
        z: 1,
        type: 4,
      },
      "4": {
        x: -1,
        y: -1,
        z: 1,
        type: 1,
      },
      "5": {
        x: -2,
        y: 1,
        z: 1,
        type: 1,
      },
      "6": {
        x: 1,
        y: 2,
        z: 0,
        type: 3,
      },
      "7": {
        x: 2,
        y: -3,
        z: 2,
        type: 1,
      },
      "8": {
        x: 3,
        y: -2,
        z: 2,
        type: 6,
      },
    },
  };
};

export const gameStarter = () => {
  console.log("gameStarter");
  return {
    id: "130",
    data: {
      type: 91,
      payload: {
        diff: {
          playerStates: {
            "1": {
              isConnected: true,
            },
          },
          gameLogState: {
            "3": {
              text: {
                type: 0,
                playerColor: 1,
              },
              from: 1,
            },
          },
        },
        timeLeftInState: 167.958,
      },
      sequence: 3,
    },
  };
};

export const spoofHostRoom = () => {
  return (
    firebaseData.GAME ?? {
      ...firebaseData.ROOM,
      data: {
        ...firebaseData.ROOM.data,
        sessions: (firebaseData.ROOM.data.sessions.slice() as any[]).sort(
          (a, b) => (a.userId === store.me.userId ? -1 : 1),
        ),
      },
    }
  );
};

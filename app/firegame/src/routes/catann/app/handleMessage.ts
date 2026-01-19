import store from "../../../shared/store";
import {
  GeneralAction,
  LobbyAction,
  LobbyState,
  ServerActionType,
  ShuffleQueueAction,
  SocketRouteType,
  State,
} from "./catann_files_enums";
import { parseClientData } from "./parseMessagepack";

export const ROOM = {
  id: "137",
  data: {
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
    sessions: [
      {
        roomSessionId: "1141816",
        userSessionId: "asdf",
        userId: "101878616",
        isBot: false,
        isReadyToPlay: true,
        selectedColor: "red",
        username: "username#45",
        isMember: false,
        icon: 12,
        profilePictureUrl: null,
        karmaCompletedGames: 0,
        karmaTotalGames: 0,
        availableColors: ["red", "blue", "orange", "green"],
        botDifficulty: null,
      },
      {
        roomSessionId: "1141817",
        userSessionId: "08621E.5580920",
        userId: "201878617",
        isBot: false,
        isReadyToPlay: true,
        selectedColor: "blue",
        username: "player2#2002",
        isMember: false,
        icon: 8,
        profilePictureUrl: null,
        karmaCompletedGames: 0,
        karmaTotalGames: 0,
        availableColors: ["red", "blue", "orange", "green"],
        botDifficulty: null,
      },
      {
        roomSessionId: "1141818",
        userSessionId: "08621E.5580921",
        userId: "301878618",
        isBot: false,
        isReadyToPlay: true,
        selectedColor: "orange",
        username: "player3#3003",
        isMember: false,
        icon: 5,
        profilePictureUrl: null,
        karmaCompletedGames: 0,
        karmaTotalGames: 0,
        availableColors: ["red", "blue", "orange", "green"],
        botDifficulty: null,
      },
    ],
  },
} as any;

export const FUTURE = (() => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  return future.toISOString();
})();

export var sendToMainSocket: ((serverData: any) => void) | undefined;

export default function handleMessage(
  clientData: any,
  sendResponse: (serverData: any) => void,
) {
  if (clientData.InterceptedWebSocket) {
    if (
      clientData.InterceptedWebSocket?.[0].startsWith(
        "wss://socket.svr.colonist.io/",
      )
    ) {
      ROOM.data.roomId = `room${store.me.roomId.toString()}`;
      console.log({ clientData, sendToMainSocket });
      if (sendToMainSocket !== undefined) window.location.reload();
      sendToMainSocket = sendResponse;
      sendResponse({ type: "Connected", userSessionId: "asdf" });
      sendResponse({ type: "SessionEstablished" });
      sendResponse({
        id: `${State.LobbyStateUpdate}`,
        data: {
          type: LobbyState.SessionState,
          payload: { id: store.me.userId },
        },
      });
    }
    return;
  }
  const parsed = parseClientData(clientData);
  if (parsed._header[0] === SocketRouteType.RouteToServerType) {
    if (parsed._header[1] === ServerActionType.GeneralAction) {
      if (
        [
          GeneralAction.ChangeOnlineStatus,
          GeneralAction.GetAllFriendsOnlineStatus,
          GeneralAction.RegisterToFriendService,
          GeneralAction.RegisterToNotificationService,
          GeneralAction.GetAllRoomInvitesReceived,
          GeneralAction.GetNotifications,
        ].includes(parsed.action)
      ) {
        return;
      }
    }
    if (parsed._header[1] === ServerActionType.LobbyAction) {
      if ([LobbyAction.SetAdBlockStatus].includes(parsed.action)) {
        return;
      }
      if (parsed.action === LobbyAction.AccessGameLink) {
        return sendResponse(ROOM);
      }
    }
    if (parsed._header[1] === ServerActionType.ShuffleAction) {
      if ([ShuffleQueueAction.GetShuffleQueueData].includes(parsed.action)) {
        return;
      }
    }
    console.log(parsed);
    if (parsed._header[1] === ServerActionType.RoomCommand) {
      if (parsed.type === "startGame") {
        return sendResponse({
          id: "130",
          data: {
            type: 4,
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
                mapState: {
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
                },
                currentState: {
                  completedTurns: 0,
                  turnState: 0,
                  actionState: 1,
                  currentTurnPlayerColor: 1,
                  startTime: 1768801682381,
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
                      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
                      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
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
              playerUserStates: [
                {
                  userId: "101878616",
                  username: "Scheck#2093",
                  databaseIcon: 12,
                  selectedColor: 1,
                  isBot: false,
                  deviceType: 1,
                  countryCode: "US",
                  regionUpdated: null,
                  membership: null,
                  profilePictureUrl: null,
                },
              ],
              gameDetails: {
                isRanked: false,
                isDiscord: false,
              },
              gameSettings: {
                id: "deal7974",
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
            sequence: 4,
          },
        });
      }
      if (parsed.type.startsWith("set")) {
        const capitalKey = parsed.type.replace(/^set/, "");
        const key = `${capitalKey.charAt(0).toLowerCase()}${capitalKey.slice(1)}`;
        ROOM[key] = parsed[key];
        return sendResponse(ROOM);
      }
      if (parsed.type === "selectColor") {
        ROOM.data.sessions.find(
          (s: { roomSessionId: string }) =>
            s.roomSessionId === parsed.roomSessionId,
        ).selectedColor = parsed.color;
        return sendResponse(ROOM);
      }
    }
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(parsed)}`;
  // console.error(e);
  throw new Error(e);
}

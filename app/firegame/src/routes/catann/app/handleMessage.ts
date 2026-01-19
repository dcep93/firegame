import {
  GeneralAction,
  LobbyAction,
  ServerActionType,
  ShuffleQueueAction,
  SocketRouteType,
} from "./catann_files_enums";
import { parseClientData } from "./parseMessagepack";

const userSessionId = "08621E.5580914";

export const FUTURE = (() => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  return future.toISOString();
})();

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
      sendResponse({ type: "Connected", userSessionId });
      sendResponse({ type: "SessionEstablished" });
      sendResponse({
        id: "133",
        data: {
          type: ServerActionType.LobbyAction,
          payload: {
            id: userSessionId,
          },
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
        return sendResponse({
          id: "137",
          data: {
            type: "StateUpdated",
            roomId: "room420",
            updateSequence: 1768799061895,
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
                userSessionId,
                userId: "101878616",
                isBot: false,
                isReadyToPlay: true,
                selectedColor: "red",
                username: "Scheck#2093",
                isMember: false,
                icon: 12,
                profilePictureUrl: null,
                karmaCompletedGames: 0,
                karmaTotalGames: 0,
                availableColors: ["red", "blue", "orange", "green"],
                botDifficulty: null,
              },
            ],
          },
        });
      }
    }
    if (parsed._header[1] === ServerActionType.ShuffleAction) {
      if ([ShuffleQueueAction.GetShuffleQueueData].includes(parsed.action)) {
        return;
      }
    }
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(parsed)}`;
  // console.error(e);
  throw new Error(e);
}

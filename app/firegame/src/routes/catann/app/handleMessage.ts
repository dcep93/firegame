import {
  GeneralAction,
  ServerActionType,
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
      const action = GeneralAction[parsed.action];
      if (action == GeneralAction.RegisterToFriendService) {
        return;
      }
    }
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(parsed)}`;
  // console.error(e);
  throw new Error(e);
}

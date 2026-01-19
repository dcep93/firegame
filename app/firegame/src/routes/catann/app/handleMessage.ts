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
          type: 2,
          payload: {
            id: userSessionId,
          },
        },
      });
    }
    return;
  }
  const parsed = parseClientData(clientData);
  if (parsed.channel === "lobby") {
    if (parsed.action === 9) {
      // return sendResponse({
      //   id: "139",
      //   data: {
      //     type: 1,
      //     payload: {
      //       playerCount: 5,
      //       modeId: 2,
      //       mapId: 33,
      //       endDate: FUTURE,
      //     },
      //   },
      // });
    }
    if (parsed.action === 1) {
      // return sendResponse({
      //   id: "139",
      //   data: {
      //     type: 1,
      //     payload: {
      //       playerCount: 5,
      //       modeId: 2,
      //       mapId: 33,
      //       endDate: FUTURE,
      //     },
      //   },
      // });
    }
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(parsed)}`;
  // console.error(e);
  throw new Error(e);
}

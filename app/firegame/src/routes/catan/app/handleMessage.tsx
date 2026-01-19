const userSessionId = "08621E.5580914";

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
    }
    console.log(clientData);
    return;
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(clientData)}`;
  console.error(e);
  throw new Error(e);
}

// clientData: {0: 2, 1: 7, 2: 5, 3: 108, 4: 111, 5: 98, 6: 98, 7: 121, 8: 130, 9: 166, 10: 97, 11: 99, 12: 116, 13: 105, 14: 111, 15: 110, 16: 1, 17: 167, 18: 112, 19: 97, 20: 121, 21: 108, 22: 111, 23: 97, 24: 100, 25: 128}
// parsed: { channel: "lobby", _header: [2, 7], action: 1, payload: {} }
function parseMessage(clientData: Record<string, number>) {}

import parseClientData from "./parseClientData";

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
  const parsed = parseClientData(clientData);
  if (parsed.channel === "lobby") {
    return;
  }
  // codex: dont remove this, its for debugging
  const e = `not implemented: ${JSON.stringify(parsed)}`;
  // console.error(e);
  throw new Error(e);
}

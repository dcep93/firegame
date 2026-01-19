const userSessionId = "08621E.5580914";

export default function handleMessage(
  clientData: any,
  sendResponse: (serverData: any) => void,
) {
  if (
    clientData.InterceptedWebSocket?.[0].startsWith(
      "wss://socket.svr.colonist.io/",
    )
  ) {
    sendResponse({ type: "Connected", userSessionId });
    sendResponse({ type: "SessionEstablished" });
    return;
  }
}

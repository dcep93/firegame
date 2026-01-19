export default function InterceptedWebSocket() {
  const sendResponse = (targetWindow, payload) => {
    if (!targetWindow) {
      return;
    }
    console.log("sent", payload);
    targetWindow.postMessage(payload, "*");
  };

  const handleMessage = (event) => {
    const { id, data } = event.data || {};
    if (!id) {
      return;
    }
    sendResponse(event.source, { id, data: { data, msg: "received" } });
    setTimeout(() => {
      sendResponse(event.source, { id, data: { data, msg: "delayed" } });
    }, 1000);
  };

  window.addEventListener("message", handleMessage);
}

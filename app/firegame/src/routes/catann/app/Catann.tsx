import React from "react";
import handleMessage from "./handleMessage";
import IframeScriptString from "./IframeScriptString";

window.addEventListener("message", (event) => {
  const { id, clientData } = event.data || {};
  if (!clientData) return;
  handleMessage(clientData, (serverData) =>
    event.source!.postMessage({ id, serverData }, { targetOrigin: "*" }),
  );
});

class Catann extends React.Component {
  render() {
    return (
      <div
        style={{
          width: "100vW",
          height: "100vH",
          overflow: "hidden",
          overscrollBehavior: "none",
        }}
      >
        <iframe
          title={"iframe"}
          srcDoc={`<!doctype html><html><head><base href="/"></head><body><script>history.replaceState(null,"","/");</script><script>${IframeScriptString}; alert(window.location.pathname);</script></body></html>`}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </div>
    );
  }
}

export default Catann;

import React from "react";
import handleMessage from "./handleMessage";

window.addEventListener("message", (event) => {
  const { id, clientData } = event.data || {};
  if (!clientData) return;
  handleMessage(clientData, (serverData) =>
    event.source!.postMessage({ id, serverData }, { targetOrigin: "*" }),
  );
});

class Catan extends React.Component {
  render() {
    const src = `${window.location.origin}/public_catann?${Date.now()}`;
    return (
      <div
        style={{
          width: "100vW",
          height: "100vH",
          border: 0,
          overflow: "hidden",
          margin: 0,
        }}
      >
        <iframe
          title={src}
          src={src}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            overflow: "hidden",
            margin: 0,
          }}
        />
      </div>
    );
  }
}

export default Catan;

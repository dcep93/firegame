import React from "react";
import store from "../../../shared/store";
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
    const roomId = store.me?.roomId;
    if (roomId === undefined) return null;
    const src = `${window.location.origin}/public_catann/#coin9247`;
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
          title={src}
          src={src}
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

export default Catan;

import React from "react";
import getServerResponse from "./getServerResponse";

window.addEventListener("message", (event) => {
  const { id, clientData } = event.data || {};
  const serverData = getServerResponse(clientData);
  event.source!.postMessage({ id, serverData }, { targetOrigin: "*" });
});

class Catan extends React.Component {
  render() {
    const src = `${window.location.origin}/public_catann?${Date.now()}`;
    return (
      <div>
        <iframe
          title={src}
          src={src}
          style={{ width: "100vW", height: "100vH", border: 0 }}
        />
      </div>
    );
  }
}

export default Catan;

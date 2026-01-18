import React from "react";
import InterceptedWebSocket from "./InterceptedWebSocket";

InterceptedWebSocket();

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

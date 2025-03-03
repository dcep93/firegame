import React from "react";
import Board from "./Board";
import Players from "./Players";

class Main extends React.Component {
  render() {
    return (
      <div
        style={{
          width: "100vW",
          height: "100%",
          overflowX: "scroll",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {/* <MapBuilder name="germany" /> */}
        <div style={{ width: "15em", overflow: "scroll" }}>
          <Players />
        </div>
        <div
          style={{
            flexGrow: 1,
            minWidth: "50em",
            position: "relative",
          }}
        >
          <Board />
        </div>
      </div>
    );
  }
}

export default Main;

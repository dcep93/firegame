import React from "react";
import { maps } from "../utils/bank";
import { store } from "../utils/utils";
import Bank from "./Bank";
import Board from "./Board";
import Players from "./Players";
import ResourceBank from "./ResourceBank";

class Main extends React.Component {
  render() {
    return (
      <div
        style={{
          width: "100vW",
          height: "100vH",
          overflowX: "scroll",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {/* <MapBuilder name="germany" /> */}
        <div
          style={{
            width: "16em",
            overflow: "scroll",
            maxHeight: "100%",
          }}
        >
          <Bank />
          <Players />
          <ResourceBank />
        </div>
        <div
          style={{
            flexGrow: 1,
            minWidth: "50em",
            position: "relative",
          }}
        >
          <Board map={maps.find((m) => m.name === store.gameW.game.mapName)!} />
        </div>
      </div>
    );
  }
}

export default Main;

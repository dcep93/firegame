import React from "react";
import { store } from "../utils/utils";
import Actions from "./Actions";
import CardActions from "./CardActions";
import Player from "./Player";
import Store from "./Store";

class Main extends React.Component {
  render() {
    return (
      <div style={{ width: "100%" }}>
        <div>
          {store.gameW.game.players.map((p, i) => (
            <Player key={i} p={p} />
          ))}
        </div>
        <CardActions />
        <Store />
        <Actions />
      </div>
    );
  }
}

export default Main;

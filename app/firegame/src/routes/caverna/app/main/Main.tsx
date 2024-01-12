import React from "react";
import { store } from "../utils/utils";
import ActionsBoard from "./ActionsBoard";
import CardActions from "./CardActions";
import Player from "./Player";
import StoreBoard from "./StoreBoard";

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
        <StoreBoard />
        <ActionsBoard />
      </div>
    );
  }
}

export default Main;

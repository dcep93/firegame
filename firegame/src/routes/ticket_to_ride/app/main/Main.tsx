import React from "react";
import { store } from "../utils/utils";
import Board from "./Board";
import Player from "./Player";

function Main() {
  return (
    <div>
      <Board />
      {store.gameW.game.players.map((p, i) => (
        <Player key={i} player={p} />
      ))}
    </div>
  );
}

export default Main;

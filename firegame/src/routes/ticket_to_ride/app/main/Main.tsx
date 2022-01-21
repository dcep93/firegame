import React from "react";
import utils, { store } from "../utils/utils";
import Bank from "./Bank";
import Board from "./Board";
import Me from "./Me";
import Player from "./Player";

function Main() {
  return (
    <div>
      {store.gameW.game.players.map((p, i) => (
        <Player key={i} player={p} />
      ))}
      <Bank />
      <Board />
      {utils.getMe() && <Me />}
    </div>
  );
}

export default Main;

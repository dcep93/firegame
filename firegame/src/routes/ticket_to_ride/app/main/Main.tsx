import React from "react";
import utils, { store } from "../utils/utils";
import Bank from "./Bank";
import Board from "./Board";
import Me from "./Me";
import Player from "./Player";

function Main() {
  return (
    <div>
      <Board />
      <Bank />
      {utils.getMe() && <Me />}
      {store.gameW.game.players.map((p, i) => (
        <Player key={i} player={p} />
      ))}
    </div>
  );
}

export default Main;

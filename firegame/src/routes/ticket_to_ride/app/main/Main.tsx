import React, { useState } from "react";
import utils, { store } from "../utils/utils";
import Bank from "./Bank";
import Board from "./Board";
import Me from "./Me";
import Player from "./Player";

function Main() {
  const [selected, update] = useState({} as { [n: number]: boolean });
  return (
    <div>
      {store.gameW.game.players.map((p, i) => (
        <Player key={i} player={p} />
      ))}
      <Bank update={update} />
      <Board selected={selected} />
      {utils.getMe() && <Me selected={selected} update={update} />}
    </div>
  );
}

export default Main;

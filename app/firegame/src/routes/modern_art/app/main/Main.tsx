import React from "react";
import utils, { store } from "../utils/utils";
import AuctionC from "./AuctionC";
import Me from "./Me";
import Player from "./Player";
import Values from "./Values";

class Main extends React.Component {
  render() {
    return (
      <div>
        {utils.getMe() && <Me />}
        {store.gameW.game.auction && <AuctionC />}
        <Values />
        <div>
          {store.gameW.game.players.map((p, i) => (
            <Player p={p} key={i} />
          ))}
        </div>
      </div>
    );
  }
}

export default Main;

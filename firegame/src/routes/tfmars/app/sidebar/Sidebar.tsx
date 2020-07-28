import React from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "TF Mars";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);

  renderStartNewGame() {
    return (
      <div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
      </div>
    );
  }

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

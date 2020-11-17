import React, { RefObject } from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  expansionRef: RefObject<HTMLInputElement> = React.createRef();
  name = "Wingspan";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);

  renderStartNewGame() {
    return (
      <div>
        <div>
          <label>
            European Expansion:{" "}
            <input type={"checkbox"} ref={this.expansionRef} />
          </label>
        </div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
      </div>
    );
  }

  getParams(): Params {
    return {
      europeanExpansion: this.expansionRef.current!.checked,
      lobby: store.lobby,
    };
  }

  maybeSyncParams() {
    super.maybeSyncParams();
    if (store.gameW.info.isNewGame) {
      this.expansionRef.current!.checked =
        store.gameW.game.params.europeanExpansion;
    }
  }
}

export default Sidebar;

import React, { RefObject } from "react";

import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame from "../utils/NewGame";
import { Params } from "../utils/types";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  expansionRef: RefObject<HTMLInputElement> = React.createRef();
  randomStartingRef: RefObject<HTMLInputElement> = React.createRef();
  name = "7 Wonders Duel";
  NewGame = NewGame;
  utils = utils;

  renderStartNewGame() {
    return (
      <div>
        <div>
          <div>
            <label>
              God Expansion: <input type={"checkbox"} ref={this.expansionRef} />
            </label>
          </div>
          <div>
            <label>
              Random Starting:{" "}
              <input type={"checkbox"} ref={this.randomStartingRef} />
            </label>
          </div>
        </div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
      </div>
    );
  }

  getParams() {
    return {
      randomStarting: this.randomStartingRef.current!.checked,
      godExpansion: this.expansionRef.current!.checked,
      lobby: store.lobby,
    };
  }

  maybeSyncParams() {
    super.maybeSyncParams();
    if (store.gameW.info.isNewGame) {
      this.randomStartingRef.current!.checked =
        store.gameW.game.params.randomStarting;
      this.expansionRef.current!.checked = store.gameW.game.params.godExpansion;
    }
  }
}

export default Sidebar;

import React, { RefObject } from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import Preview from "./Preview";

class Sidebar extends SharedSidebar<Params> {
  expansionRef: RefObject<HTMLInputElement> = React.createRef();
  name = "Wingspan";
  NewGame = NewGame;
  utils = utils;

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

  renderInfo(): JSX.Element | null {
    return <Preview />;
  }
}

export default Sidebar;

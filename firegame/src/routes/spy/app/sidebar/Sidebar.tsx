import React, { RefObject } from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import css from "../index.module.css";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Spy";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);
  numTeamsRef: RefObject<HTMLInputElement> = React.createRef();
  numWordsRef: RefObject<HTMLInputElement> = React.createRef();

  isResizeable = false;

  getParams(): Params {
    return {
      lobby: store.lobby,
      numTeams: parseInt(this.numTeamsRef.current!.value),
      numWords: parseInt(this.numWordsRef.current!.value),
    };
  }

  renderStartNewGame() {
    return (
      <div className={css.settings_form}>
        <div>
          <span>Num Teams: </span>
          <input
            className={css.sidebar_num}
            type={"text"}
            defaultValue={"2"}
            ref={this.numTeamsRef}
          />
        </div>
        <div>
          <span>Num Words: </span>
          <input
            className={css.sidebar_num}
            type={"number"}
            defaultValue={"18"}
            ref={this.numWordsRef}
          />
        </div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
      </div>
    );
  }
}

export default Sidebar;

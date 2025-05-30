import React, { RefObject } from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import css from "../index.module.css";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Spy";
  NewGame = NewGame;
  utils = utils;
  rules = "";
  numTeamsRef: RefObject<HTMLInputElement> = React.createRef();
  numWordsRef: RefObject<HTMLInputElement> = React.createRef();

  getParams(): Params {
    return {
      lobby: store.lobby,
      numTeams: parseInt(this.numTeamsRef.current!.value),
      numWords: parseInt(this.numWordsRef.current!.value),
    };
  }

  renderNewGameExtras() {
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
      </div>
    );
  }
}

export default Sidebar;

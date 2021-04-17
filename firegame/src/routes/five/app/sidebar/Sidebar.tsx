import React from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Five";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);

  getParams(): Params {
    return { lobby: store.lobby };
  }

  renderStartNewGame() {
    return (
      <div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
        <h4>
          <a href="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/174090367_469169254416296_5532163693060542504_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=ae9488&_nc_ohc=3HK_eL3CAzcAX9AKNPD&_nc_ht=scontent-sjc3-1.xx&oh=b9e190e3271a866d770e96f90ba83c35&oe=60A0CA07">
            Rules
          </a>
        </h4>
      </div>
    );
  }
}

export default Sidebar;

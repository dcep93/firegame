import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Take Back Toe";
  NewGame = NewGame;
  utils = utils;
  rules = "";

  getParams(): Params {
    return { lobby: store.lobby };
  }

  renderStartNewGame() {
    return (
      <div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
        <h4>
          <a href="https://cheapass.com//wp-content/uploads/2016/06/TakeBackToe.pdf">
            Rules
          </a>
        </h4>
      </div>
    );
  }
}

export default Sidebar;

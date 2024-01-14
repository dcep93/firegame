import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Azul";
  NewGame = NewGame;
  utils = utils;

  renderStartNewGame() {
    return (
      <div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
        <h4>
          <a href="https://www.ultraboardgames.com/azul/game-rules.php">
            Rules
          </a>
        </h4>
      </div>
    );
  }

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

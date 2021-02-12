import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Template";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

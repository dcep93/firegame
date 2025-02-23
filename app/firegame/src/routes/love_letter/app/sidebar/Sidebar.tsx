import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Love Letter";
  NewGame = NewGame;
  utils = utils;
  rules = "";

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

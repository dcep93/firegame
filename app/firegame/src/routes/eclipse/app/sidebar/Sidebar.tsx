import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Eclipse";
  NewGame = NewGame;
  utils = utils;

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

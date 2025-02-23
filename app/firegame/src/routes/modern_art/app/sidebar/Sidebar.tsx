import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Modern Art";
  rules = "https://www.acdd.com/media/files/CMNMDA001_Rules.pdf";
  NewGame = NewGame;
  utils = utils;

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

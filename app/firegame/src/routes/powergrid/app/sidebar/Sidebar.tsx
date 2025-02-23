import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Power Grid";
  NewGame = NewGame;
  utils = utils;
  rules =
    "https://www.riograndegames.com/wp-content/uploads/2018/12/Power-Grid-Recharged-Rules.pdf";

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

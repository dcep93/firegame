import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import { LobbyType } from "../../../../shared/store";
import utils, { store } from "../utils/utils";

export type Params = {
  lobby: LobbyType;
};

class Sidebar extends SharedSidebar<Params> {
  name = "Power Grid";
  NewGame = () => utils.newGame();
  utils = utils;
  rules =
    "https://www.riograndegames.com/wp-content/uploads/2018/12/Power-Grid-Recharged-Rules.pdf";

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

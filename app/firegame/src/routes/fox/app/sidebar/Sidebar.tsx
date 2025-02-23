import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import { store, shared as utils } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Fox in the Forest";
  NewGame = NewGame;
  utils = utils;
  rules = "";

  getParams(): Params {
    return {
      lobby: store.lobby,
    };
  }
}

export default Sidebar;

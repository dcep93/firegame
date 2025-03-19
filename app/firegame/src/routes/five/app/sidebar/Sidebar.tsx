import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Five";
  NewGame = NewGame;
  utils = utils;
  rules =
    "https://raw.githubusercontent.com/dcep93/firegame/master/app/firegame/src/routes/five/app/sidebar/rules.jpeg";
}

export default Sidebar;

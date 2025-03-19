import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame from "../utils/NewGame";
import utils from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Five";
  NewGame = NewGame;
  utils = utils;
  rules =
    "https://raw.githubusercontent.com/dcep93/firegame/master/app/firegame/src/routes/five/app/sidebar/rules.jpeg";
}

export default Sidebar;

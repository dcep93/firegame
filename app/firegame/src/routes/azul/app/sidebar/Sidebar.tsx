import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Azul";
  NewGame = NewGame;
  utils = utils;
  rules = "https://www.ultraboardgames.com/azul/game-rules.php";
}

export default Sidebar;

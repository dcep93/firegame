import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame from "../utils/NewGame";
import utils from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Azul";
  NewGame = NewGame;
  utils = utils;
  rules = "https://www.ultraboardgames.com/azul/game-rules.php";
}

export default Sidebar;

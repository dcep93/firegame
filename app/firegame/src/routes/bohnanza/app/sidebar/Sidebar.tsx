import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Bohnanza";
  rules = "https://www.fgbradleys.com/rules/rules2/Bohnanza-rules.pdf";
  NewGame = NewGame;
  utils = utils;

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

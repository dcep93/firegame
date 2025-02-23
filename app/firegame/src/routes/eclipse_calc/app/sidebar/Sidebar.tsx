import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "EclipseCalc";
  NewGame = NewGame;
  utils = utils;
  rules = "https://cdn.1j1ju.com/medias/48/0e/83-eclipse-rulebook.pdf";

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

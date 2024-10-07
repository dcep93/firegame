import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "CavernaScorer";
  NewGame = NewGame;
  utils = utils;
  rules = "https://cdn.1j1ju.com/medias/e1/f2/6b-caverna-rulebook.pdf";

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

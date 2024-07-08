import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Eclipse";
  NewGame = NewGame;
  utils = utils;
  rules =
    "https://cdn.1j1ju.com/medias/bb/af/07-eclipse-second-dawn-for-the-galaxy-rulebook.pdf";

  getParams(): Params {
    return { lobby: store.lobby, randomStarting: true };
  }
}

export default Sidebar;

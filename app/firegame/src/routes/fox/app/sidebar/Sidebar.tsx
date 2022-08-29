import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import { shared as utils, store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Fox in the Forest";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);

  getParams(): Params {
    return {
      lobby: store.lobby,
    };
  }
}

export default Sidebar;

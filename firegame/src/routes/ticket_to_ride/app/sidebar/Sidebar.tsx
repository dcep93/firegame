import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Ticket To Ride";
  rules =
    "https://ncdn0.daysofwonder.com/tickettoride/de/img/tt_rules_2015_en.pdf";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);

  getParams(): Params {
    return { lobby: store.lobby };
  }
}

export default Sidebar;

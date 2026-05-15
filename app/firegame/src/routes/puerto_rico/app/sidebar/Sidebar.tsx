import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import { theme } from "../theme/base";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = theme.gameName;
  NewGame = NewGame;
  utils = utils;
  rules = theme.rulesUrl;

  getParams(): Params {
    return { lobby: store.lobby };
  }

  renderInfo(): JSX.Element | null {
    const game = store.gameW.game;
    if (!game) return null;
    return (
      <div>
        <div>Round {game.round}</div>
        <div>Governor: {game.players[game.governor]?.userName}</div>
        <div>VP bank: {game.bank.victoryPoints}</div>
        <div>Colonists: {game.bank.colonistSupply}</div>
        {game.endTriggered && <div>Final round: {game.endTriggered}</div>}
      </div>
    );
  }
}

export default Sidebar;

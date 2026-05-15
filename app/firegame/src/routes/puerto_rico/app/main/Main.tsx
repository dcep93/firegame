import css from "../index.module.css";
import { theme } from "../theme/base";
import { store } from "../utils/utils";
import ActionPanel from "./ActionPanel";
import BankView from "./BankView";
import BuildingMarket from "./BuildingMarket";
import PlayerBoard from "./PlayerBoard";
import RoleRow from "./RoleRow";
import ScoreBoard from "./ScoreBoard";

function Main() {
  const game = store.gameW.game;
  return (
    <div className={css.root}>
      <div className={`${css.section} ${css.between}`}>
        <div>
          <h2 className={css.heading}>{theme.gameName}</h2>
          <div>
            {theme.phase[game.phase]} - current player:{" "}
            {game.players[game.currentPlayer]?.userName}
          </div>
        </div>
        <div>
          Round {game.round} | Governor {game.players[game.governor]?.userName}
        </div>
      </div>
      {game.phase === "game_over" ? <ScoreBoard /> : <ActionPanel />}
      <RoleRow />
      <BankView />
      <BuildingMarket />
      <div className={css.row}>
        {game.players.map((player) => (
          <PlayerBoard key={player.userId} player={player} />
        ))}
      </div>
    </div>
  );
}

export default Main;

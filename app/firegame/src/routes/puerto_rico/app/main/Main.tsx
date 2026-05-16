import css from "../index.module.css";
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
      {game.phase === "game_over" ? <ScoreBoard /> : <ActionPanel />}
      <RoleRow />
      <BankView />
      <BuildingMarket />
      <div className={css.playerList}>
        {game.players.map((player) => (
          <PlayerBoard key={player.userId} player={player} />
        ))}
      </div>
    </div>
  );
}

export default Main;

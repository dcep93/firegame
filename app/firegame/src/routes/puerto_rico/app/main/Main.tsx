import css from "../index.module.css";
import { store } from "../utils/utils";
import BankView from "./BankView";
import BuildingMarket from "./BuildingMarket";
import PlayerBoard from "./PlayerBoard";
import RoleRow from "./RoleRow";
import ScoreBoard from "./ScoreBoard";

function Main() {
  const game = store.gameW.game;
  const myIndex = game.players.findIndex((player) => player.userId === store.me.userId);
  const players =
    myIndex >= 0
      ? [...game.players.slice(myIndex), ...game.players.slice(0, myIndex)]
      : game.players;
  return (
    <div className={css.root}>
      {game.phase === "game_over" && <ScoreBoard />}
      <RoleRow />
      <BankView />
      <BuildingMarket />
      <div className={css.playerList}>
        {players.map((player) => (
          <PlayerBoard key={player.userId} player={player} />
        ))}
      </div>
    </div>
  );
}

export default Main;

import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/gameTypes";
import { store } from "../utils/utils";

export default function DashboardView() {
  const game = store.gameW.game;
  return (
    <div className={styles.bubble}>
      <div title={JSON.stringify(game.action)}>
        action: {Action[game.action.action]}
      </div>
      <div>year: {game.year} / 8</div>
      <div>starting player: {game.players[game.startingPlayer].userName}</div>
    </div>
  );
}

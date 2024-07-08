import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/gameTypes";
import utils, { store } from "../utils/utils";

export default function ActionView() {
  const game = store.gameW.game;
  return (
    <div>
      <div className={styles.bubble}>
        <div>year: {game.year} / 8</div>
        <div>current: {game.players[game.currentPlayer].userName}</div>
        {game.startingPlayer === -1 ? null : (
          <div>
            starting player: {game.players[game.startingPlayer].userName}
          </div>
        )}
      </div>
      <div>
        {utils
          .enumArray(Action)
          .filter((a) => a !== Action.selectFaction && a !== Action.turn)
          .map((action) => (
            <div
              key={action}
              className={styles.bubble}
              style={{
                cursor: utils.isMyTurn() ? "pointer" : undefined,
                backgroundColor:
                  store.gameW.game.action.action === action
                    ? "lightgrey"
                    : undefined,
              }}
              onClick={() => {
                if (!utils.isMyTurn()) return;
                game.action = { action };
                store.update(`action: ${Action[action]}`);
              }}
            >
              {Action[action]}
            </div>
          ))}
      </div>
    </div>
  );
}

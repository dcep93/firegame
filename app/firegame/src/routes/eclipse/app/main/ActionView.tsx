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
          .filter(
            (a) =>
              !utils.getCurrent().d!.reaction ||
              [
                Action._pass,
                Action.build,
                Action.move,
                Action.upgrade,
              ].includes(a)
          )
          .map((action) => (
            <div
              key={action}
              className={styles.bubble}
              style={{
                cursor: utils.isMyTurn() ? "pointer" : undefined,
                backgroundColor:
                  store.gameW.game.action.action === action
                    ? "grey"
                    : undefined,
              }}
              onClick={() => {
                if (!utils.isMyTurn()) return;
                if (store.gameW.game.action.action !== Action.turn) return;
                if (action === Action._pass) return utils.pass();
                utils.getMe().d!.passed = false;
                utils.getMe().d!.remainingDiscs--;
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

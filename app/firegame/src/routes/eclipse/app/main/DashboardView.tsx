import { ReactElement } from "react";
import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/gameTypes";
import utils, { store } from "../utils/utils";

export default function DashboardView(): ReactElement {
  const game = store.gameW.game;
  switch (game.action.action) {
    case Action.selectFaction:
      return <></>;
    case Action.turn:
      return (
        <div>
          {utils
            .enumArray(Action)
            .filter((a) => a !== Action.selectFaction && a !== Action.turn)
            .map((action) => (
              <div
                key={action}
                className={styles.bubble}
                style={{ cursor: utils.isMyTurn() ? "pointer" : undefined }}
                onClick={() => {
                  if (!utils.isMyTurn()) return;
                  game.action = { action };
                  store.update(`action: ${Action[action]}`);
                }}
              >
                {Action[action]}
              </div>
            ))}

          <div
            className={styles.bubble}
            style={{ cursor: utils.isMyTurn() ? "pointer" : undefined }}
            onClick={() => {
              if (!utils.isMyTurn()) return;
              store.update(`passed`);
            }}
          >
            (pass)
          </div>
        </div>
      );
    case Action.build:
    case Action.explore:
    case Action.influence:
    case Action.move:
    case Action.research:
    case Action.upgrade:
      return <></>;
  }
}

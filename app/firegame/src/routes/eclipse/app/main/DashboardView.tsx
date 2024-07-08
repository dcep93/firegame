import { ReactElement } from "react";
import styles from "../../../../shared/styles.module.css";
import { Action, Ship } from "../utils/gameTypes";
import utils, { store } from "../utils/utils";

export default function DashboardView(props: {
  selectedSector: number;
}): ReactElement | null {
  const game = store.gameW.game;
  switch (game.action.action) {
    case Action.selectFaction:
      return null;
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
      return props.selectedSector === -1 ? null : (
        <div>
          {utils.enumArray(Ship).map((s) => (
            <div
              key={s}
              className={styles.bubble}
              style={{
                cursor: utils.build(
                  false,
                  s,
                  game.sectors[props.selectedSector]
                )
                  ? "pointer"
                  : undefined,
              }}
              onClick={() =>
                utils.build(true, s, game.sectors[props.selectedSector])
              }
            >
              {Ship[s]}
            </div>
          ))}
        </div>
      );
    case Action.explore:
    case Action.influence:
    case Action.move:
    case Action.research:
    case Action.upgrade:
      return <></>;
  }
}

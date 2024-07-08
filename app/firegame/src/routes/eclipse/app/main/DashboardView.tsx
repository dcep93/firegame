import { ReactElement } from "react";
import styles from "../../../../shared/styles.module.css";
import { Action, Ship } from "../utils/gameTypes";
import utils, { store } from "../utils/utils";

export default function DashboardView(props: {
  sectorIndex: number;
}): ReactElement | null {
  const game = store.gameW.game;
  switch (game.action.action) {
    case Action.selectFaction:
    case Action.turn:
      return null;
    case Action.build:
      return props.sectorIndex === -1 ? null : (
        <div>
          {utils.enumArray(Ship).map((s) => (
            <div
              key={s}
              className={styles.bubble}
              style={{
                cursor: utils.build(false, s, game.sectors[props.sectorIndex])
                  ? "pointer"
                  : undefined,
              }}
              onClick={() =>
                utils.build(true, s, game.sectors[props.sectorIndex])
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
    case Action._pass:
      return <></>;
  }
}

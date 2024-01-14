import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/Actions";
import utils, { store } from "../utils/utils";

export default function ActionsBoard() {
  return (
    <div>
      <div className={styles.bubble}>
        <h3>actions</h3>
        <div>
          remaining harvests:{" "}
          {(store.gameW.game.remainingHarvests || []).join(",")}
        </div>
        <div style={{ display: "flex" }}>
          {utils.chunk(store.gameW.game.actions, 3).map((a2, i) => (
            <div key={i}>
              {a2
                .map((a) => ({
                  a,
                  actionData: (store.gameW.game.takenActions || {})[a],
                }))
                .map(({ a, actionData }, j) => (
                  <div key={a}>
                    <div
                      className={styles.bubble}
                      style={{
                        width: "5em",
                        height: "4em",
                        position: "relative",
                        cursor: utils.canAction(a) ? "pointer" : undefined,
                      }}
                      onClick={() =>
                        utils.canAction(a) && utils.action(a, utils.getMe())
                      }
                    >
                      {actionData === undefined ? null : (
                        <div
                          className={styles.bubble}
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            backgroundColor: utils.getColor(
                              actionData.playerIndex
                            ),
                          }}
                        >
                          {actionData.weaponLevel <= 0
                            ? null
                            : actionData.weaponLevel}
                        </div>
                      )}
                      <pre style={{ width: 0, fontSize: "small" }}>
                        {Action[a].replaceAll("_", "\n")}
                      </pre>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

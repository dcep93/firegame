import styles from "../../../../shared/styles.module.css";
import Actions, { Action } from "../utils/Actions";
import utils, { store } from "../utils/utils";

export default function ActionsView() {
  return (
    <div>
      <div className={styles.bubble}>
        <h3>actions</h3>
        <div>
          <div>
            remaining harvests:{" "}
            {(store.gameW.game.remainingHarvests || []).join(",")}
          </div>
          <div>
            starting player:{" "}
            {store.gameW.game.players[store.gameW.game.startingPlayer].userName}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {utils.chunk(store.gameW.game.actions, 3).map((a2, i) => (
            <div key={i}>
              {a2
                .map((a) => ({
                  a,
                  action: Actions[a],
                  takenAction: (store.gameW.game.takenActions || {})[a],
                }))
                .map(({ a, action, takenAction }, j) => (
                  <div key={a}>
                    <div
                      className={styles.bubble}
                      title={
                        action.title ||
                        [
                          action.foodCost === undefined
                            ? null
                            : `food cost: ${action.foodCost}`,
                          action.enrichment === undefined
                            ? null
                            : `enrichment: ${action.enrichment
                                .map((e) => JSON.stringify(e))
                                .join("->")}`,
                        ]
                          .filter((s) => s !== null)
                          .join("\n")
                      }
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
                      {takenAction === undefined ? null : (
                        <div
                          className={styles.bubble}
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            backgroundColor: utils.getColor(
                              takenAction.playerIndex
                            ),
                          }}
                        >
                          {takenAction.weaponLevel <= 0
                            ? null
                            : takenAction.weaponLevel}
                        </div>
                      )}
                      <pre style={{ width: 0, fontSize: "small" }}>
                        {Action[a].split("__")[0].replaceAll("_", "\n")}
                      </pre>
                      {JSON.stringify(
                        (store.gameW.game.actionBonuses || {})[a]
                      )}
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

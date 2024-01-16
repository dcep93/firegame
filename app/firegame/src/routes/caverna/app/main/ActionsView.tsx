import styles from "../../../../shared/styles.module.css";
import Actions, { Action } from "../utils/Actions";
import utils, { store } from "../utils/utils";
import { chunk } from "./Main";

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
          {chunk(store.gameW.game.actions, 3).map((a2, i) => (
            <div key={i}>
              {a2
                .map((a) => ({
                  a,
                  action: Actions[a],
                  takenAction: (store.gameW.game.takenActions || {})[a],
                }))
                .map((o) => ({
                  ...o,
                  usedDwarves:
                    o.takenAction === undefined
                      ? undefined
                      : store.gameW.game.players[o.takenAction!.playerIndex]
                          .usedDwarves!,
                }))
                .map((o) => ({
                  ...o,
                  weaponLevel:
                    o.takenAction === undefined
                      ? undefined
                      : o.usedDwarves![
                          o.usedDwarves!.length - o.takenAction!.dwarfIndex
                        ],
                }))
                .map(({ a, action, takenAction, weaponLevel }, j) => (
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
                        cursor: utils.action(a, false) ? "pointer" : undefined,
                      }}
                      onClick={() => utils.action(a, true)}
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
                          {weaponLevel! <= 0 ? null : weaponLevel}
                        </div>
                      )}
                      <pre
                        style={{
                          width: 0,
                          fontSize: "small",
                          position: "absolute",
                          top: 0,
                        }}
                      >
                        {Action[a].split("__")[0].replaceAll("_", "\n")}
                      </pre>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                        }}
                      >
                        {JSON.stringify(
                          (store.gameW.game.actionBonuses || {})[a]
                        )}
                      </div>
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

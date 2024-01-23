import styles from "../../../../shared/styles.module.css";
import Actions, { Action } from "../utils/Actions";
import utils, { store } from "../utils/utils";
import Button from "./Button";

export default function ActionsView() {
  return (
    <div>
      <div className={styles.bubble}>
        <h3>actions</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: "30em",
          }}
        >
          {store.gameW.game.actions
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
              <div
                key={a}
                title={[
                  action.title,
                  action.foodCost === undefined
                    ? null
                    : `food cost: ${action.foodCost}`,
                  action.enrichment === undefined
                    ? null
                    : `enrichment: ${action.enrichment
                        .map((e) => utils.stringify(e))
                        .join("->")}`,
                ]
                  .filter((s) => s !== null)
                  .join("\n")}
                style={{
                  height: `${
                    [
                      Action.drift_mining__4_7,
                      Action.imitation__4_7,
                      Action.logging__4_7,
                      Action.forest_exploration__4_7,
                    ].includes(a)
                      ? 25
                      : a === Action.ore_delivery &&
                        store.gameW.game.players.length <= 2
                      ? 66
                      : 33
                  }%`,
                  width: "5em",
                  padding: "0 1em",
                }}
              >
                <Button
                  text={Action[a].split("__")[0].replaceAll("_", "\n")}
                  disabled={!utils.action(a, false)}
                  onClick={() => utils.action(a, true)}
                >
                  {takenAction === undefined ? (
                    utils.stringify((store.gameW.game.actionBonuses || {})[a])
                  ) : (
                    <div
                      className={styles.bubble}
                      style={{
                        backgroundColor: utils.getColor(
                          takenAction.playerIndex
                        ),
                      }}
                    >
                      {weaponLevel! <= 0 ? null : weaponLevel}
                    </div>
                  )}
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

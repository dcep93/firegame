import styles from "../../../../shared/styles.module.css";
import Caverns, { Cavern } from "../utils/Caverns";
import utils, { store } from "../utils/utils";
import { chunk } from "./Main";

export default function CavernsView(props: {
  selected: [number, number, number] | undefined;
}) {
  const me = utils.getMe();
  return (
    <div>
      <div className={styles.bubble}>
        <div>
          <h3>store</h3>
        </div>
        <div>
          {chunk(
            utils
              .enumArray(Cavern)
              .filter((t) => t !== Cavern.starting_dwelling),
            12
          ).map((t4, i) => (
            <div key={i} style={{ display: "flex" }}>
              {chunk(t4, 6).map((t3, j) => (
                <div
                  key={`${i}.${j}`}
                  style={{
                    margin: "1em",
                  }}
                >
                  {chunk(t3, 3).map((t2, k) => (
                    <div key={`${i}.${j}.${k}`} style={{ display: "flex" }}>
                      {t2
                        .map((t) => ({ t, cavern: Caverns[t] }))
                        .map(({ t, cavern }, l) => (
                          <div
                            key={`${i}.${j}.${k}.${l}`}
                            className={styles.bubble}
                            style={{
                              display: "inline-block",
                              width: "8em",
                              cursor: !utils.furnish(
                                t,
                                me,
                                props.selected,
                                false
                              )
                                ? undefined
                                : "pointer",
                              position: "relative",
                            }}
                            title={cavern.title}
                            onClick={() =>
                              utils.furnish(t, me, props.selected, true)
                            }
                          >
                            {(store.gameW.game.purchasedTiles || {})[t] ===
                            undefined ? null : (
                              <div
                                className={styles.bubble}
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: utils.getColor(
                                    store.gameW.game.purchasedTiles![t]!
                                  ),
                                }}
                              ></div>
                            )}
                            <pre>
                              (
                              {cavern.points === undefined
                                ? "*"
                                : cavern.points}
                              ) {Cavern[t].split("__")[0].replaceAll("_", "\n")}
                            </pre>
                            <div style={{ fontSize: "small" }}>
                              {JSON.stringify(cavern.cost)}
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
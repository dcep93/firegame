import styles from "../../../../shared/styles.module.css";
import Caverns, { Cavern } from "../utils/Caverns";
import utils, { store } from "../utils/utils";
import Button from "./Button";
import { chunk } from "./Main";

export default function CavernsView(props: {
  selected: [number, number, number] | undefined;
}) {
  const p = utils.getCurrent();
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
                            style={{
                              width: "8em",
                              height: "8em",
                              margin: "0.5em",
                            }}
                            title={cavern.title}
                          >
                            <Button
                              text={`(${
                                cavern.points === undefined
                                  ? "*"
                                  : cavern.points
                              }) ${Cavern[t]
                                .split("__")[0]
                                .replaceAll("_", "\n")}`}
                              disabled={
                                !utils.furnish(t, p, props.selected, false)
                              }
                              onClick={() =>
                                utils.furnish(t, p, props.selected, true)
                              }
                            >
                              <pre
                                style={{ fontSize: "small", margin: "0.1em" }}
                              >
                                {JSON.stringify(cavern.cost, null, 2)
                                  ?.split("\n")
                                  ?.slice(1, -1)
                                  ?.join("\n")}
                              </pre>
                              {(store.gameW.game.purchasedTiles || {})[t] ===
                              undefined ? null : (
                                <div
                                  className={styles.bubble}
                                  style={{
                                    backgroundColor: utils.getColor(
                                      store.gameW.game.purchasedTiles![t]!
                                    ),
                                  }}
                                ></div>
                              )}
                            </Button>
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

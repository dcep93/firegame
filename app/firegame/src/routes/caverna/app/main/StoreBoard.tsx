import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/Tiles";
import utils from "../utils/utils";

export default function StoreBoard() {
  const me = utils.getMe();
  return (
    <div>
      <div className={styles.bubble}>
        <div>
          <h3>store</h3>
        </div>
        <div>
          {utils.chunk(utils.enumArray(Tile), 12).map((t4, i) => (
            <div key={i} style={{ display: "flex" }}>
              {utils.chunk(t4, 6).map((t3, j) => (
                <div
                  key={`${i}.${j}`}
                  style={{
                    margin: "1em",
                  }}
                >
                  {utils.chunk(t3, 3).map((t2, k) => (
                    <div key={`${i}.${j}.${k}`} style={{ display: "flex" }}>
                      {t2.map((t, l) => (
                        <pre
                          key={`${i}.${j}.${k}.${l}`}
                          className={styles.bubble}
                          style={{
                            display: "inline-block",
                            width: "8em",
                            cursor: utils.canBuy(t, me) ? "pointer" : undefined,
                          }}
                        >
                          {Tile[t].replaceAll("_", "\n")}
                        </pre>
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

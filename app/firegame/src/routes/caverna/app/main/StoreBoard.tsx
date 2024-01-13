import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/Tiles";
import utils from "../utils/utils";

export default function StoreBoard() {
  return (
    <div>
      <div className={styles.bubble}>
        <div>
          <h3>store</h3>
        </div>
        <div>
          {utils.chunk(utils.enumArray(Tile), 12).map((t3, i) => (
            <div key={i} style={{ display: "flex" }}>
              {utils.chunk(t3, 6).map((t2, j) => (
                <div
                  key={`${i}.${j}`}
                  style={{
                    margin: "1em",
                  }}
                >
                  {utils.chunk(t2, 3).map((t1, k) => (
                    <div key={`${i}.${j}.${k}`} style={{ display: "flex" }}>
                      {t1.map((t, l) => (
                        <pre
                          key={`${i}.${j}.${k}.${l}`}
                          className={styles.bubble}
                          style={{ display: "inline-block", width: "8em" }}
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

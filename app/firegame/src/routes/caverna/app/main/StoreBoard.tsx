import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/Tiles";
import utils from "../utils/utils";

function chunk<T>(ts: T[], num: number): T[][] {
  return ts.reverse().reduce(
    (prev, curr: T) => {
      if (prev[0].length === num) {
        prev.unshift([]);
      }
      prev[0].unshift(curr);
      return prev;
    },
    [[]] as T[][]
  );
}

export default function StoreBoard() {
  return (
    <div className={styles.bubble}>
      <div>
        <h3>store</h3>
      </div>
      <div>
        {chunk(utils.enumArray(Tile), 12).map((t3, i) => (
          <div key={i} style={{ display: "flex" }}>
            {chunk(t3, 6).map((t2, j) => (
              <div
                key={`${i}.${j}`}
                style={{
                  margin: "20px",
                }}
              >
                {chunk(t2, 3).map((t1, k) => (
                  <div style={{ display: "flex" }}>
                    {t1.map((t) => (
                      <pre
                        key={`${i}.${j}.${k}`}
                        className={styles.bubble}
                        style={{ display: "inline-block", width: "100px" }}
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
  );
}

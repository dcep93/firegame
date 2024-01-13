import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/Actions";
import utils, { store } from "../utils/utils";

export default function ActionsBoard() {
  return (
    <div>
      <div className={styles.bubble}>
        <h3>actions</h3>
        <div style={{ display: "flex" }}>
          {utils.chunk(store.gameW.game.actions, 3).map((a2, i) => (
            <div key={i}>
              {a2.map((a, j) => (
                <div key={a}>
                  <pre
                    className={styles.bubble}
                    style={{
                      width: "8em",
                      height: "4em",
                      cursor: utils.canAction(a) ? "pointer" : undefined,
                    }}
                  >
                    {Action[a].replaceAll("_", "\n")}
                  </pre>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

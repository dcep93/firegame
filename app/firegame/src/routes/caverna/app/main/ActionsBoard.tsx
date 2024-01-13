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
            <div>
              {a2.map((a1, j) => (
                <div key={a1}>
                  <div
                    className={styles.bubble}
                    style={{ width: "120px", height: "60px" }}
                  >
                    {Action[a1]}
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

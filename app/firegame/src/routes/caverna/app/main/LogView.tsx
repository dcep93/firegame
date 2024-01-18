import { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";

const keys = ["score", "toUpdate", "playerIndex", "firebaseId", "time"];

export default function LogView() {
  const [visible, update] = useState(false);
  return (
    <div className={styles.bubble}>
      <h3 onClick={() => update(!visible)}>log</h3>
      <div hidden={!visible}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              {keys.map((k) => (
                <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {store.gameW.game.log
              .slice()
              .reverse()
              .map((l) =>
                Object.assign({}, null, l, {
                  time: new Date(l.time).toLocaleTimeString(),
                })
              )
              .map((l, i) => (
                <tr key={i}>
                  {keys.map((k, j) => (
                    <td key={j}>{l[k]}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

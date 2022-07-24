import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

import locations_json from "./locations.json";

class Main extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Spyfall</h2>
        <div>
          {store.gameW.game.ps.map((p, i) => (
            <div
              className={styles.bubble}
              key={i}
              onClick={() =>
                alert(
                  store.gameW.game.spy === p
                    ? "you are the spy"
                    : store.gameW.game.word
                )
              }
            >
              {p}
            </div>
          ))}
        </div>
        <div>
          <h1>All Locations</h1>
          <div>
            {locations_json.map((l, i) => (
              <div key={i} className={styles.bubble}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

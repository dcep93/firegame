import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Spyfall</h2>
        <div>
          {store.gameW.game.params.p.split("\n").map((p, i) => (
            <div className={styles.bubble} key={i} onClick={() => alert(p)}>
              {p}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Main;

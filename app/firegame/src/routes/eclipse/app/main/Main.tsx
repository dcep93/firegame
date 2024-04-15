import React from "react";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Main</h2>
        <pre
          onClick={() => {
            if (utils.isMyTurn()) {
              utils.incrementPlayerTurn();
              store.update("clicked");
            }
          }}
        >
          {JSON.stringify(store.gameW.game)}
        </pre>
      </div>
    );
  }
}

export default Main;

import React from "react";
import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";

function Board() {
  return (
    <div className={styles.bubble}>
      <h2>Main</h2>
      <pre>{JSON.stringify(store.gameW.game)}</pre>
    </div>
  );
}

export default Board;

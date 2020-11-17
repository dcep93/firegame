import React from "react";
import styles from "../../../../shared/styles.module.css";
import { PlayerType } from "../utils/NewGame";
import { store } from "../utils/utils";

class Board extends React.Component<{ player: PlayerType }> {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Wingspan</h2>
        <pre>{JSON.stringify(store.gameW.game)}</pre>
      </div>
    );
  }
}

export default Board;

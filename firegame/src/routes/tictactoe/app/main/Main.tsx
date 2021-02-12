import React from "react";
import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    const board = store.gameW.game.board;
    return (
      <div>
        <div className={[styles.bubble, styles.inline].join(" ")}>
          {board.map((row, i) => (
            <div key={i} className={styles.flex}>
              {row.map((cell, j) => (
                <div key={j} className={styles.bubble}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Main;

import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils from "../../../7wd/app/utils/utils";
import { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    const board = store.gameW.game.board;
    return (
      <div>
        <div>
          <div className={[styles.bubble, styles.inline].join(" ")}>
            {board.map((row, i) => (
              <div key={i} className={styles.flex}>
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className={styles.bubble}
                    onClick={() => this.click(i, j)}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  click(row: number, column: number) {
    if (!utils.isMyTurn()) return;
  }
}

export default Main;

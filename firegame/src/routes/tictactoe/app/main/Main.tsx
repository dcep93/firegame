import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    const board = store.gameW.game.board;
    return (
      <div>
        <div>
          <div className={[styles.bubble, styles.inline].join(" ")}>
            {board.map((row, i) => (
              <div key={i} className={styles.flex}>
                {row.map((tile, j) => (
                  <div
                    key={j}
                    className={styles.bubble}
                    onClick={() => this.click(i, j)}
                    style={{ backgroundColor: Tile[tile] }}
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
    const board = store.gameW.game.board;
    if (board[row][column] !== Tile.white) return;
    board[row][column] = utils.myIndex();
    utils.incrementPlayerTurn();
    store.update(`played at ${column},${row}`);
  }
}

export default Main;

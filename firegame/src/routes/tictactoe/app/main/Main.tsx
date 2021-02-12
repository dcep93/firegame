import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Main extends React.Component<{}, { selected: Set<string> }> {
  constructor(props: {}) {
    super(props);
    this.state = { selected: new Set() };
  }

  render() {
    const board = store.gameW.game.board;
    return (
      <div>
        <h3 className={styles.bubble}>
          {store.gameW.game.players.map((p) => p.userName).join(" vs ")}
        </h3>
        <div>
          <div className={[styles.bubble, styles.inline].join(" ")}>
            {board.map((row, i) => (
              <div key={i} className={styles.flex}>
                {row.map((tile, j) => (
                  <div
                    key={j}
                    className={styles.flex}
                    style={{
                      backgroundColor: this.state.selected.has(this.key(i, j))
                        ? "grey"
                        : "white",
                    }}
                  >
                    <div
                      className={styles.bubble}
                      onClick={() => this.click(i, j)}
                      style={{ backgroundColor: Tile[tile] }}
                    ></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  key(row: number, column: number): string {
    return `${row},${column}`;
  }

  click(row: number, column: number) {
    if (!utils.isMyTurn()) return;
    const board = store.gameW.game.board;
    if (store.gameW.game.isSliding) {
      if (this.state.selected.has(this.key(row, column))) {
        this.state.selected.delete(this.key(row, column));
      } else {
        if (board[row][column] === Tile.white) {
          const direction = this.getSlideDirection(row, column);
          if (direction !== null) {
            const num = this.state.selected.size;
            this.state.selected.clear();
            this.setState({});
            store.gameW.game.isSliding = false;
            utils.incrementPlayerTurn();
            store.update(`slid ${num} ${direction} ${this.key(column, row)}`);
          }
          return;
        } else {
          if (!this.isContiguous(row, column)) {
            this.state.selected.clear();
          }
          this.state.selected.add(this.key(row, column));
        }
      }
      this.setState({});
    } else {
      if (board[row][column] !== Tile.white) return;
      board[row][column] = utils.myIndex();
      store.gameW.game.isSliding = true;
      store.update(`played at ${this.key(column, row)}`);
    }
  }

  getSlideDirection(row: number, column: number): string | null {
    return null;
  }

  isContiguous(row: number, column: number): boolean {
    return true;
  }
}

export default Main;

import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

const directionStrings: { [key: string]: string } = {
  "0,1": "→",
  "0,-1": "←",
  "1,0": "↑",
  "-1,0": "↓",
};

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

  unkey(key: string): number[] {
    return key.split(",").map((i) => parseInt(i));
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
            const num = this.slide(row, column, direction);
            const directionString =
              directionStrings[this.key(direction[0], direction[1])];
            this.setState({});
            store.gameW.game.isSliding = false;
            utils.incrementPlayerTurn();
            store.update(
              `slid ${num} ${directionString} ${this.key(column, row)}`
            );
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

  slide(_row: number, _column: number, direction: number[]): number {
    var row = _row;
    var column = _column;
    var num = 0;
    const board = store.gameW.game.board;
    while (this.state.selected.size > 0) {
      num++;
      const sorted = Array.from(this.state.selected.keys()).sort();
      if (this.key(row, column) > sorted[0]) sorted.reverse();
      const closest = sorted[0];
      this.state.selected.delete(closest);
      const slid = this.unkey(closest);
      board[row][column] = board[slid[0]][slid[1]];
      board[slid[0]][slid[1]] = Tile.white;
      row += direction[0];
      column += direction[1];
    }
    return num;
  }

  getSlide(row: number, column: number): number[] | null {
    const sorted = Array.from(this.state.selected.keys()).sort();
    if (this.key(row, column) > sorted[0]) sorted.reverse();
    const mapped = sorted.map(this.unkey);
    const closest = mapped[0];
    const farthest = mapped[mapped.length - 1];
    const added = [row, column];
    const key = closest[0] === row ? 0 : 1;
    if (closest[key] !== farthest[key]) return null;
    if (farthest[key] !== added[key]) return null;
    return closest.map((val, index) => val - added[index]);
  }

  getSlideDirection(row: number, column: number): number[] | null {
    const slide = this.getSlide(row, column);
    if (slide === null) return null;
    return slide.map((i) => (i === 0 ? i : i > 0 ? 1 : -1));
  }

  isContiguous(row: number, column: number): boolean {
    if (this.state.selected.size === 0) return true;
    const slide = this.getSlide(row, column);
    if (slide === null) return false;
    return directionStrings[this.key(slide[0], slide[1])] !== undefined;
  }
}

export default Main;

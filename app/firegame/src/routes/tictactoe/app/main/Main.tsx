import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

const directionStrings: { [key: string]: string } = {
  "0,1": "→",
  "0,-1": "←",
  "1,0": "↓",
  "-1,0": "↑",
};

class Main extends React.Component<{}, { selected: Set<string> }> {
  checkboxRef: React.RefObject<HTMLInputElement> = React.createRef();
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
            <div
              className={styles.flex}
              style={{ justifyContent: "space-around" }}
            >
              {utils.count(6).map((i) => (
                <div key={i}>{this.indexToLetter(i)}</div>
              ))}
            </div>
            {board.map((row, i) => (
              <div
                key={i}
                className={styles.flex}
                style={{ alignItems: "center" }}
              >
                <span>{i + 1}</span>
                {row.map((tile, j) => (
                  <div
                    key={j}
                    className={styles.flex}
                    style={{
                      backgroundColor: this.state.selected.has(this.key(i, j))
                        ? "lightgrey"
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
        <div className={styles.bubble}>
          <div>
            <label hidden={!utils.isMyTurn() || !utils.getMe().canPlaceNeutral}>
              Place Neutral: <input type={"checkbox"} ref={this.checkboxRef} />
            </label>
          </div>
          <div>
            <button disabled={!this.canSkip()} onClick={this.skip.bind(this)}>
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  canSkip(): boolean {
    return utils.isMyTurn() && !store.gameW.game.skippedPlacing;
  }

  skip() {
    if (!this.canSkip()) return;
    const me = utils.getMe();
    if (store.gameW.game.isPlacingNeutralAtEndOfTurn) {
      utils.incrementPlayerTurn();
      store.update("skipped placing a neutral tile");
    } else if (!store.gameW.game.isSliding) {
      store.gameW.game.isSliding = true;
      store.gameW.game.skippedPlacing = true;
      store.update("skipped playing a tile");
    } else {
      if (me.canPlaceNeutral) {
        store.gameW.game.isPlacingNeutralAtEndOfTurn = true;
      } else {
        utils.incrementPlayerTurn();
      }
      store.update("skipped sliding");
    }
  }

  indexToLetter(row: number): string {
    return (row + 10).toString(36).toUpperCase();
  }

  key(row: number, column: number): string {
    return `${this.indexToLetter(column)}${row + 1}`;
  }

  unkey(key: string): [number, number] {
    const column = key[0].toLowerCase().charCodeAt(0) - 97;
    const row = parseInt(key[1]);
    return [row - 1, column];
  }

  click(row: number, column: number) {
    if (!utils.isMyTurn()) return;
    const board = store.gameW.game.board;
    if (this.checkboxRef.current!.checked) {
      const me = utils.getMe();
      if (!me.canPlaceNeutral) return;
      if (board[row][column] !== Tile.white) return;
      board[row][column] = Tile.grey;
      me.canPlaceNeutral = false;
      if (store.gameW.game.isPlacingNeutralAtEndOfTurn)
        utils.incrementPlayerTurn();
      this.checkboxRef.current!.checked = false;
      store.update(`played neutral at ${this.key(row, column)}`);
    } else if (store.gameW.game.isSliding) {
      if (this.state.selected.has(this.key(row, column))) {
        this.state.selected.delete(this.key(row, column));
      } else {
        if (board[row][column] === Tile.white) {
          const direction = this.getSlideDirection(row, column);
          if (direction === null) return;
          const num = this.slide(row, column, direction);
          const directionString = directionStrings[`${direction.join(",")}`];
          if (utils.getMe().canPlaceNeutral) {
            store.gameW.game.skippedPlacing = false;
            store.gameW.game.isPlacingNeutralAtEndOfTurn = true;
          } else {
            utils.incrementPlayerTurn();
          }
          store.update(
            `slid ${num} ${directionString} ${this.key(row, column)}`
          );
        } else {
          if (!this.isContiguous(row, column)) this.state.selected.clear();
          this.state.selected.add(this.key(row, column));
        }
      }
      this.setState({});
    } else {
      if (board[row][column] !== Tile.white) return;
      board[row][column] = utils.myIndex();
      store.gameW.game.isSliding = true;
      utils.checkIfFourOrLessEmpty();
      store.update(`played at ${this.key(row, column)}`);
    }
  }

  slide(_row: number, _column: number, direction: [number, number]): number {
    var row = _row;
    var column = _column;
    const num = this.state.selected.size;
    const board = store.gameW.game.board;
    while (this.state.selected.size > 0) {
      const sorted = Array.from(this.state.selected.keys()).sort();
      if (this.key(row, column) > sorted[0]) sorted.reverse();
      const closest = sorted[0];
      this.state.selected.delete(closest);
      const slid = this.unkey(closest);
      board[row][column] = board[slid[0]][slid[1]];
      board[slid[0]][slid[1]] = Tile.white;
      row -= direction[0];
      column -= direction[1];
    }
    return num;
  }

  getSlide(row: number, column: number): [number, number] | null {
    const sorted = Array.from(this.state.selected.keys()).sort();
    if (sorted.length === 0) return null;
    if (this.key(row, column) > sorted[0]) sorted.reverse();
    const mapped = sorted.map(this.unkey);
    const closest = mapped[0];
    const farthest = mapped[mapped.length - 1];
    const added = [row, column];
    const key = closest[0] === row ? 0 : 1;
    if (closest[key] !== farthest[key]) return null;
    if (farthest[key] !== added[key]) return null;
    const rval = closest.map((val, index) => added[index] - val);
    return [rval[0], rval[1]];
  }

  getSlideDirection(row: number, column: number): [number, number] | null {
    const slide = this.getSlide(row, column);
    if (slide === null) return null;
    const board = store.gameW.game.board;
    if (slide[0] === 0) {
      if (slide[1] > 0) {
        for (let i = 1; i < slide[1]; i++) {
          if (board[row][column - i] !== Tile.white) return null;
        }
        return [0, 1];
      } else {
        for (let i = -1; i > slide[1]; i--) {
          if (board[row][column - i] !== Tile.white) return null;
        }
        return [0, -1];
      }
    } else {
      if (slide[0] > 0) {
        for (let i = 1; i < slide[1]; i++) {
          if (board[row - i][column] !== Tile.white) return null;
        }
        return [1, 0];
      } else {
        for (let i = -1; i > slide[1]; i--) {
          if (board[row - i][column] !== Tile.white) return null;
        }
        return [-1, 0];
      }
    }
  }

  isContiguous(row: number, column: number): boolean {
    if (this.state.selected.size === 0) return true;
    const slide = this.getSlide(row, column);
    if (slide === null) return false;
    return directionStrings[`${slide.join(",")}`] !== undefined;
  }
}

export default Main;

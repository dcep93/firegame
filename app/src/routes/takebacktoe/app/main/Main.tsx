import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

class Main extends React.Component<{}, { clicked: number[] | null }> {
  constructor(params: {}) {
    super(params);
    this.state = { clicked: null };
  }

  render() {
    return (
      <div>
        <div className={styles.bubble}>
          <h2>Take Back Toe</h2>
          <div>
            <div>roll: {store.gameW.game.roll || "?"}</div>
            <h4>{store.gameW.game.players[0].userName}</h4>
            <div
              className={styles.grid}
              style={{ gridTemplateColumns: "repeat(5, auto)" }}
            >
              <div></div>
              {utils.count(4).map((i) => (
                <div>{String.fromCharCode(65 + i)}</div>
              ))}
              {store.gameW.game.grid.map((row, i) => (
                <React.Fragment key={i}>
                  <div>{i + 1}</div>
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      className={[
                        styles.bubble,
                        this.isClicked(i, j) && styles.grey,
                      ].join(" ")}
                      style={{ width: "3em" }}
                      onClick={() => this.click(i, j)}
                    >
                      {cell}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <h4>{store.gameW.game.players[1].userName}</h4>
          </div>
        </div>
        {utils.isMyTurn() && store.gameW.game.roll === 0 && (
          <div>
            <button className={styles.bubble} onClick={this.roll}>
              roll
            </button>
          </div>
        )}
      </div>
    );
  }

  isClicked(i: number, j: number): boolean {
    if (this.state.clicked === null) return false;
    return this.state.clicked[0] === i && this.state.clicked[1] === j;
  }

  click(i: number, j: number) {
    const roll = store.gameW.game.roll;
    if (roll === 0) return;
    if (this.isClicked(i, j)) {
      this.setState({ clicked: null });
    } else if (this.state.clicked == null) {
      if (store.gameW.game.grid[i][j] < roll) {
        alert("not enough in stack");
        return;
      }
      this.setState({ clicked: [i, j] });
    } else {
      if (
        !(
          this.isClicked(i, j + 1) ||
          this.isClicked(i, j - 1) ||
          this.isClicked(i + 1, j) ||
          this.isClicked(i - 1, j)
        )
      ) {
        alert("needs to be adjacent");
        return;
      }
      if (
        (store.gameW.game.previous || []).toString() ===
        this.state.clicked.concat([i, j, roll]).toString()
      ) {
        alert("no take backs");
        return;
      }
      utils.incrementPlayerTurn();
      store.gameW.game.roll = 0;
      store.gameW.game.previous = [i, j]
        .concat(this.state.clicked)
        .concat([roll]);
      store.gameW.game.grid[this.state.clicked[0]][
        this.state.clicked[1]
      ] -= roll;
      store.gameW.game.grid[i][j] += roll;
      if (this.gameIsOver()) {
        // todo score
        store.gameW.info.alert = "game over";
      }
      const from = `${utils.numberToLetter(this.state.clicked[1])}${
        this.state.clicked[0] + 1
      }`;
      const to = `${utils.numberToLetter(j)}${i + 1}`;
      store.update(`moved ${from} -> ${to}`);
      this.setState({ clicked: null });
    }
  }

  gameIsOver(): boolean {
    return this.helper(0) || this.helper(2);
  }

  helper(i: number): boolean {
    const row = store.gameW.game.grid[i].slice().sort();
    return row[1] > 0 && row.filter((i) => i === row[1]).length >= 3;
  }

  roll() {
    const val = 1 + Math.floor(Math.random() * 6);
    if (
      store.gameW.game.grid.flatMap((i) => i).find((i) => i >= val) ===
      undefined
    ) {
      utils.incrementPlayerTurn();
      store.update(`rolled ${val} - cannot play`);
      return;
    }
    store.gameW.game.roll = val;
    store.update(`rolled ${val}`);
  }
}

export default Main;

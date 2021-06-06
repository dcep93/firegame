import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    const me = utils.getMe();
    const played = store.gameW.game.first;
    return (
      <div>
        <div className={styles.bubble}>
          {store.gameW.game.players.map((p, i) => (
            <div key={i} className={styles.bubble}>
              <h2>{p.userName}</h2>
              <div>score: {p.score}</div>
              <div>
                hand:{" "}
                {Object.entries(
                  utils.freqDict(
                    (p.hand || []).map((n) => (n % 2 === 0 ? "white" : "black"))
                  )
                )
                  .map(([v, c]) => `${v}: ${c}`)
                  .join(" ")}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className={styles.bubble}>
            active:{" "}
            {played === undefined
              ? "NONE"
              : played % 2 === 0
              ? "white"
              : "black"}
          </div>
        </div>
        {me && (
          <div className={styles.flex}>
            {(me.hand || []).map((v, i) => (
              <div
                key={i}
                className={styles.bubble}
                style={{ backgroundColor: v % 2 === 0 ? "white" : "grey" }}
                onClick={() => this.click(i)}
              >
                {v}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  click(index: number) {
    if (!utils.isMyTurn()) return;
    const played = utils.getMe().hand!.splice(index, 1)[0];
    const color = played % 2 === 0 ? "white" : "black";
    if (store.gameW.game.first === undefined) {
      store.gameW.game.first = played;
      utils.incrementPlayerTurn();
      store.update(`played ${color}`);
    } else {
      const previous = store.gameW.game.first;
      delete store.gameW.game.first;
      if (played > previous) {
        utils.getCurrent().score++;
        store.update(`played ${color} and won`);
      } else if (played < previous) {
        utils.incrementPlayerTurn();
        utils.getCurrent().score++;
        store.update(`played ${color} and lost`);
      } else {
        utils.incrementPlayerTurn();
        store.update(`played ${color} and tied`);
      }
    }
  }
}

export default Main;

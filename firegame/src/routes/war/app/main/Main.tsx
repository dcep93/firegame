import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    return (
      <div>
        {store.gameW.game.players.map((p, i) => (
          <div key={i}>
            <div className={styles.bubble}>
              <h2>{p.userName}</h2>
              <div className={styles.flex}>
                <div>
                  <div>cards in deck: {(p.deck || []).length}</div>
                  <div>cards in discard: {(p.discard || []).length}</div>
                </div>
                <div>{p.previousCards}</div>
              </div>
            </div>
          </div>
        ))}
        <div className={styles.bubble}>
          <button disabled={!utils.isMyTurn()} onClick={utils.flip}>
            Flip
          </button>
        </div>
      </div>
    );
  }
}

export default Main;

import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/NewGame";
import { store } from "../utils/utils";
import Factory from "./Factory";
import Player from "./Player";

class Main extends React.Component {
  render() {
    const height = window.innerHeight;
    return (
      <div style={{ display: "contents", height }}>
        <div className={styles.resizeable}>
          <div style={{ width: "50em", height }}>{this.renderLeft()}</div>
        </div>
        <div className={styles.resizeable}>
          <div style={{ width: "50em", height }}>{this.renderRight()}</div>
        </div>
      </div>
    );
  }

  renderLeft() {
    return (
      <div>
        {store.gameW.game.players.map((p) => (
          <Player key={p.userId} p={p} />
        ))}
      </div>
    );
  }

  renderRight() {
    return (
      <div className={[styles.bubble, styles.inline_flex].join(" ")}>
        <div>
          {(store.gameW.game.factories || []).map((tiles, index) => (
            <Factory key={index} index={index} tiles={tiles || []} />
          ))}
        </div>
        <div className={styles.bubble}>
          <div>Table</div>
          {(store.gameW.game.table || []).map((tile, index) => (
            <div
              className={styles.bubble}
              key={index}
              style={{ backgroundColor: Tile[tile] }}
            ></div>
          ))}
        </div>
      </div>
    );
  }
}

export default Main;

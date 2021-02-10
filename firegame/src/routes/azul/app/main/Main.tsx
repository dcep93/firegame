import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import Factory from "./Factory";
import Player from "./Player";

class Main extends React.Component<{}, { destination: number }> {
  constructor(props: {}) {
    super(props);
    this.state = { destination: -1 };
  }

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

  popDestination(): number {
    const destination = this.state.destination;
    this.setState({ destination: -1 });
    return destination;
  }

  setDestination(destination: number) {
    this.setState({ destination });
  }

  renderLeft() {
    return (
      <div>
        {store.gameW.game.players.map((p) => (
          <Player
            key={p.userId}
            p={p}
            destination={this.state.destination}
            setDestination={this.setDestination.bind(this)}
          />
        ))}
      </div>
    );
  }

  renderRight() {
    return (
      <div className={[styles.bubble, styles.inline_flex].join(" ")}>
        <div>
          {(store.gameW.game.factories || []).map((tiles, index) => (
            <Factory
              key={index}
              index={index}
              tiles={tiles || []}
              popDestination={this.popDestination.bind(this)}
            />
          ))}
        </div>
        <div className={styles.bubble}>
          <div>Table</div>
          {(store.gameW.game.table || []).map((tile, index) => (
            <div
              className={styles.bubble}
              key={index}
              style={{ backgroundColor: Tile[tile] }}
              onClick={() =>
                utils.takeTile(
                  "table",
                  tile,
                  true,
                  this.popDestination.bind(this)
                )
              }
            ></div>
          ))}
        </div>
      </div>
    );
  }
}

export default Main;

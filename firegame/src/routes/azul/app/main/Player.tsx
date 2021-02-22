import React from "react";
import styles from "../../../../shared/styles.module.css";
import { PlayerType, Tile } from "../utils/NewGame";
import utils from "../utils/utils";

class Player extends React.Component<{
  p: PlayerType;
  destination: number;
  setDestination: (d: number) => void;
}> {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>{this.props.p.userName}</h2>
        <h3>score: {this.props.p.score}</h3>
        <div className={styles.inline_flex}>
          <div>{utils.enumArray(Tile).map(this.renderLine.bind(this))}</div>
          <div style={{ width: "30px" }}></div>
          <div>{utils.enumArray(Tile).map(this.renderWall.bind(this))}</div>
        </div>
        <div
          className={[styles.flex, styles.bubble].join(" ")}
          style={{ justifyContent: "space-between" }}
        >
          {utils.FLOOR_SCORING.map((value, index) => (
            <div key={index}>
              <div>{value}</div>
              <div
                className={styles.bubble}
                style={{
                  backgroundColor: this.getFloorBackground(index),
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  getFloorBackground(index: number): string {
    const tile = (this.props.p.floor || [])[index];
    if (tile === undefined) return "white";
    if (tile < 0) return "green";
    return Tile[tile];
  }

  meOnMyTurn(): boolean {
    return utils.isMyTurn() && utils.getMe().userId === this.props.p.userId;
  }

  renderLine(_: Tile, index: number) {
    const isDestination = index === this.props.destination;
    return (
      <div
        key={index}
        className={styles.right}
        onClick={() =>
          this.meOnMyTurn() &&
          this.props.setDestination(isDestination ? -1 : index)
        }
        style={
          this.meOnMyTurn() && isDestination ? { backgroundColor: "green" } : {}
        }
      >
        {utils.count(index + 1).map((i) => (
          <div
            key={i}
            className={styles.bubble}
            style={{
              backgroundColor: utils.default(
                Tile[((this.props.p.lines || [])[index] || [])[index - i]],
                "white"
              ),
            }}
          ></div>
        ))}
      </div>
    );
  }

  renderWall(_: Tile, index: number) {
    const numTiles = utils.enumArray(Tile).length;
    return (
      <div key={index} className={styles.right}>
        {utils.count(numTiles).map((i) => (
          <span
            key={i}
            style={{
              backgroundColor: Tile[(numTiles + i - index) % numTiles],
            }}
          >
            <div
              className={styles.bubble}
              style={{
                backgroundColor: utils.default(
                  Tile[((this.props.p.wall || {})[index] || [])[i]],
                  "white"
                ),
              }}
            ></div>
          </span>
        ))}
      </div>
    );
  }
}

export default Player;

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
      </div>
    );
  }

  meOnMyTurn(): boolean {
    return utils.isMyTurn() && utils.getMe().userId === this.props.p.userId;
  }

  renderLine(_: Tile, index: number) {
    return (
      <div
        key={index}
        className={styles.right}
        onClick={() => this.meOnMyTurn() && this.props.setDestination(index)}
        style={
          this.meOnMyTurn() && index === this.props.destination
            ? { backgroundColor: "green" }
            : {}
        }
      >
        {utils.count(index + 1).map((i) => (
          <div
            key={i}
            className={styles.bubble}
            style={{
              backgroundColor: utils.default(
                ((this.props.p.lines || [])[index] || [])[i],
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
          <div
            key={i}
            className={styles.inline}
            style={{ backgroundColor: Tile[(numTiles + i - index) % numTiles] }}
          >
            <div
              className={styles.bubble}
              style={{
                backgroundColor: utils.default(
                  ((this.props.p.wall || [])[index] || [])[i],
                  "white"
                ),
              }}
            ></div>
          </div>
        ))}
      </div>
    );
  }
}

export default Player;

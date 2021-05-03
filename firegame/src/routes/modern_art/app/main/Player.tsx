import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Artist, PlayerType } from "../utils/NewGame";

class Player extends React.Component<{ p: PlayerType }> {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>{this.props.p.userName}</h2>
        <div>hand: {this.props.p.hand.length}</div>
        {Object.entries(this.props.p.collection)
          .map(([artist, num]) => [parseInt(artist) as Artist, num])
          .map(([artist, num]) => (
            <div key={artist}>
              {Artist[artist]}: {num}
            </div>
          ))}
      </div>
    );
  }
}

export default Player;

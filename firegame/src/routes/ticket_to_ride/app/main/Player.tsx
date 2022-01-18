import React from "react";
import styles from "../../../../shared/styles.module.css";
import { PlayerType } from "../utils/NewGame";

function Player(props: { player: PlayerType }) {
  return (
    <div className={styles.bubble}>
      <h2>Player</h2>
      <pre>{JSON.stringify(props.player)}</pre>
    </div>
  );
}

export default Player;

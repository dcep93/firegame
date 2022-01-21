import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Routes } from "../utils/bank";
import { PlayerType } from "../utils/NewGame";
import utils from "../utils/utils";

function Player(props: { player: PlayerType }) {
  return (
    <div>
      <div className={styles.bubble}>
        <h2>{props.player.userName}</h2>
        <div>hand: {(props.player.hand || []).length}</div>
        <div>tickets: {(props.player.ticketIndices || []).length}</div>
        <div>
          trains left:{" "}
          {45 -
            (props.player.routeIndices || [])
              .map((i) => Routes[i])
              .map((r) => r.length)
              .sum()}
        </div>
        <div>routes: {(props.player.routeIndices || []).length}</div>
        <div>
          base score:{" "}
          {(props.player.routeIndices || [])
            .map((i) => Routes[i])
            .map((r) => r.length)
            .map(utils.linkPoints)
            .sum()}
        </div>
        <div>longest path: ?</div>
      </div>
    </div>
  );
}

export default Player;

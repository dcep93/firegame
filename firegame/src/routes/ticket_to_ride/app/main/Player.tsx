import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Routes, Tickets } from "../utils/bank";
import { PlayerType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

const NUM_TRAINS = 45;
const LONGEST_PATH_REWARD = 10;

function Player(props: { player: PlayerType }) {
  return (
    <div>
      <div className={styles.bubble}>
        <h2>{props.player.userName}</h2>
        <div>hand: {(props.player.hand || []).length}</div>
        <div>tickets: {(props.player.ticketIndices || []).length}</div>
        <div>
          trains left:{" "}
          {NUM_TRAINS -
            (props.player.routeIndices || [])
              .map((i) => Routes[i])
              .map((r) => r.length)
              .sum()}
        </div>
        <div>routes: {(props.player.routeIndices || []).length}</div>
        <div>longest path: {utils.longestPath(props.player)}</div>
        <div>
          base score:{" "}
          {(props.player.routeIndices || [])
            .map((i) => Routes[i])
            .map((r) => r.length)
            .map(utils.linkPoints)
            .sum()}
        </div>
        {store.gameW.game.lastPlayer === -1 && (
          <div>
            final score:{" "}
            {(props.player.routeIndices || [])
              .map((i) => Routes[i])
              .map((r) => r.length)
              .map(utils.linkPoints)
              .sum() +
              (props.player.ticketIndices || [])
                .map((t) => Tickets[t])
                .map(
                  (t) =>
                    t.points * (utils.ticketCompleted(t, props.player) ? 1 : -1)
                )
                .sum() +
              Math.max(...store.gameW.game.players.map(utils.longestPath)) ===
            utils.longestPath(props.player)
              ? LONGEST_PATH_REWARD
              : 0}
          </div>
        )}
      </div>
    </div>
  );
}

export default Player;

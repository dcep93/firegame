import React from "react";
import styles from "../../../../shared/styles.module.css";
import { HabitatEnum } from "../utils/types";
import utils, { store } from "../utils/utils";
import Habitat from "./Habitat";

class Board extends React.Component<{ index: number }> {
  render() {
    const isMe = utils.myIndex() === this.props.index;
    const isTurn = store.gameW.game.currentPlayer === this.props.index;
    const player = utils.getPlayer(this.props.index);
    return (
      <div
        className={[
          styles.bubble,
          isMe && styles.grey,
          isTurn && styles.blue,
        ].join(" ")}
      >
        <h2>{player.userName}</h2>
        {utils.enumArray(HabitatEnum).map((h) => (
          <Habitat key={h} habitat={h} player={player} />
        ))}
      </div>
    );
  }
}

export default Board;

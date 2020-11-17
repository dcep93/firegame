import React from "react";
import { PlayerType } from "../utils/NewGame";
import { store } from "../utils/utils";
import Board from "./Board";
import Player from "./Player";

class Main extends React.Component<{}, { trashSelected: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { trashSelected: false };
  }

  render() {
    return (
      <div>
        <Player
          trashSelected={this.state.trashSelected}
          selectTrash={this.selectTrash.bind(this)}
        />
        {store.gameW.game.players.map((p: PlayerType, i: number) => (
          <Board key={i} player={p} />
        ))}
      </div>
    );
  }

  selectTrash() {
    this.setState({ trashSelected: !this.state.trashSelected });
  }
}

export default Main;

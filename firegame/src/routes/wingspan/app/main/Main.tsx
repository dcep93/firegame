import React from "react";
import { PlayerType } from "../utils/NewGame";
import { store } from "../utils/utils";
import Board from "./Board";
import Feeder from "./Feeder";
import Goals from "./Goals";
import Player from "./Player";

class Main extends React.Component<{}, { selected: string | null }> {
  constructor(props: {}) {
    super(props);
    this.state = { selected: null };
  }

  render() {
    return (
      <div>
        <Player
          selected={this.state.selected}
          select={this.select.bind(this)}
        />
        <div>
          <Goals />
          <Feeder />
        </div>
        {store.gameW.game.players.map((p: PlayerType, i: number) => (
          <Board key={i} player={p} />
        ))}
      </div>
    );
  }

  select(key: string) {
    if (this.state.selected === key) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: key });
    }
  }
}

export default Main;

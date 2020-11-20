import React from "react";
import { HabitatEnum } from "../utils/types";
import { store } from "../utils/utils";
import Board from "./Board";
import Feeder from "./Feeder";
import Goals from "./Goals";
import Player from "./Player";

class Main extends React.Component<
  {},
  {
    selectedPlayer: string;
    selectedBoard: { [habitat in HabitatEnum]?: number };
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = { selectedPlayer: "", selectedBoard: {} };
  }

  render() {
    return (
      <div>
        {store.gameW.game.players.map((_, i: number) => (
          <Board
            key={i}
            index={i}
            selected={this.state.selectedBoard}
            select={this.selectBoard.bind(this)}
          />
        ))}
        <Player
          selected={this.state.selectedPlayer}
          select={this.selectPlayer.bind(this)}
        />
        <div>
          <Goals />
          <Feeder />
        </div>
      </div>
    );
  }

  selectBoard(habitat: HabitatEnum, index: number) {
    if (this.state.selectedBoard[habitat] === index) index = -1;
    this.setState({ selectedBoard: { [habitat]: index } });
  }

  selectPlayer(key: string) {
    if (this.state.selectedPlayer === key) {
      this.setState({ selectedPlayer: "" });
    } else {
      this.setState({ selectedPlayer: key });
    }
  }
}

export default Main;

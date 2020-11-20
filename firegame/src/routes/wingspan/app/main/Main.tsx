import React from "react";
import { HabitatEnum } from "../utils/types";
import utils, { store } from "../utils/utils";
import Board from "./Board";
import Feeder from "./Feeder";
import Goals from "./Goals";
import Player from "./Player";

const defaultState = { selectedPlayer: "", selectedBoard: {} };

class Main extends React.Component<
  {},
  {
    selectedPlayer: string;
    selectedBoard: { [habitat in HabitatEnum]?: number };
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <div>
        {store.gameW.game.players.map((_, i: number) => (
          <Board
            key={i}
            index={i}
            selected={utils.myIndex() === i ? this.state.selectedBoard : null}
            select={utils.myIndex() === i ? this.selectBoard.bind(this) : null}
          />
        ))}
        <Player
          selected={this.state.selectedPlayer}
          select={this.selectPlayer.bind(this)}
          selectHand={this.selectHand.bind(this)}
        />
        <div>
          <Goals />
          <Feeder />
        </div>
      </div>
    );
  }

  selectBoard(habitat: HabitatEnum, index: number) {
    const obj =
      this.state.selectedBoard[habitat] === index ? {} : { [habitat]: index };
    this.setState(Object.assign({}, defaultState, { selectedBoard: obj }));
  }

  selectPlayer(key: string) {
    if (this.state.selectedPlayer === key) key = "";
    this.setState(Object.assign({}, defaultState, { selectedPlayer: key }));
  }

  selectHand(handIndex: number): boolean {
    const selectedBoard = Object.keys(this.state.selectedBoard);
    if (selectedBoard.length === 0) {
      return false;
    }
    const habitat = parseInt(selectedBoard[0]);
    const me = utils.getMe();
    const index = me.hand!.splice(handIndex, 1)[0];
    utils.getHabitat(me, habitat).push({ index, eggs: 0, cache: 0, tucked: 0 });
    store.update(`played in ${HabitatEnum[habitat]}`);
    return true;
  }
}

export default Main;
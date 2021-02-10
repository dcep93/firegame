import React from "react";
import styles from "../../../../shared/styles.module.css";
import { HabitatEnum } from "../utils/types";
import utils, { store } from "../utils/utils";
import Board from "./Board";
import Cards from "./Cards";
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
    const height = window.innerHeight;
    return (
      <div style={{ display: "contents", height }}>
        <div className={styles.resizeable}>
          <div style={{ width: "50em", height }}>{this.renderPlayers()}</div>
        </div>
        <div className={styles.resizeable}>
          <div style={{ width: "50em", height }}>{this.renderSelf()}</div>
        </div>
      </div>
    );
  }

  renderPlayers() {
    return store.gameW.game.players.map((_, i: number) => (
      <Board
        key={i}
        index={i}
        migrate={utils.myIndex() === i ? this.selectMigrator.bind(this) : null}
        select={utils.myIndex() === i ? this.selectBoard.bind(this) : null}
        selected={utils.myIndex() === i ? this.state.selectedBoard : null}
        trashSelected={this.state.selectedPlayer === "trash"}
      />
    ));
  }

  renderSelf() {
    return (
      <>
        <Player
          selected={this.state.selectedPlayer}
          select={this.selectPlayer.bind(this)}
          selectHand={this.selectHand.bind(this)}
        />
        <div className={styles.flex}>
          <Goals />
          <div>
            <h5 className={styles.bubble}>
              Round: {store.gameW.game.roundNumber} Turn:{" "}
              {store.gameW.game.turnNumber}
            </h5>
            <br />
            <Feeder />
          </div>
        </div>
        <Cards />
      </>
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

  selectMigrator(mHabitat: HabitatEnum, mIndex: number): boolean {
    const habitat = this.getSelectHabitat();
    if (habitat === null) return false;
    const me = utils.getMe();
    const bird = me.habitats[mHabitat]!.splice(mIndex, 1)[0];
    utils.getHabitat(me, habitat).push(bird);
    store.update(
      `migrated ${HabitatEnum[mHabitat]} -> ${HabitatEnum[habitat]}`
    );
    return true;
  }

  selectHand(handIndex: number): boolean {
    const habitat = this.getSelectHabitat();
    if (habitat === null) return false;
    const me = utils.getMe();
    const index = me.hand!.splice(handIndex, 1)[0];
    utils.getHabitat(me, habitat).push({ index, eggs: 0, cache: 0, tucked: 0 });
    store.update(`played in ${HabitatEnum[habitat]}`);
    return true;
  }

  getSelectHabitat(): HabitatEnum | null {
    const selectedBoard = Object.keys(this.state.selectedBoard);
    if (selectedBoard.length === 0) {
      return null;
    }
    this.setState(defaultState);
    return parseInt(selectedBoard!.pop()!);
  }
}

export default Main;

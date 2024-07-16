import React from "react";
import Hotkeys from "react-hot-keys";

import utils, { store } from "../utils/utils";

import { Age } from "../utils/types";
import Commercial from "./commercial/Commercial";
import Military from "./Military";
import Pantheon from "./Pantheon";
import Player from "./player/Player";
import Science from "./Science";
import Structure from "./structure/Structure";
import Trash from "./Trash";

import styles from "../../../../shared/styles.module.css";

export enum SelectedEnum {
  trash = -2,
  build = -1,
  // wonder = 0+
}

class Main extends React.Component<
  {},
  {
    selectedTarget?: SelectedEnum;
    selectedPantheon?: number;
    usedTokens?: { [tokenIndex: number]: boolean };
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  onKeyDown(keyName: string) {
    switch (keyName) {
      case "t":
        this.select(SelectedEnum.trash);
        break;
      case "b":
        this.select(SelectedEnum.build);
        break;
      default:
        const wonderIndex = parseInt(keyName) - 1;
        if (wonderIndex >= (utils.getMe()?.wonders || []).length) return;
        this.select(wonderIndex);
    }
  }

  render() {
    return (
      <div>
        <Hotkeys
          keyName="t,b,1,2,3,4,5,6,7"
          onKeyDown={this.onKeyDown.bind(this)}
        ></Hotkeys>
        <div>
          {store.gameW.game.p1Advantage !== undefined ? null : (
            <div className={styles.bubble}>
              <h2>p1Advantage</h2>
            </div>
          )}
        </div>
        {store.gameW.game.commercials && (
          <Commercial
            selectedPantheon={this.state.selectedPantheon}
            reset={this.reset.bind(this)}
          />
        )}
        {store.gameW.game.params.godExpansion && (
          <div>
            <Pantheon
              selectPantheon={this.selectPantheon.bind(this)}
              selectedPantheon={this.state.selectedPantheon}
            />
          </div>
        )}
        <div>
          <Structure selectCard={this.selectCard.bind(this)} {...this.props} />
        </div>
        {this.renderPlayers()}
        <div>
          <Military players={this.getPlayers()} />
        </div>
        <div>
          <Science />
        </div>
        <Trash
          select={this.selectTrash.bind(this)}
          selected={this.state.selectedTarget === SelectedEnum.trash}
        />
      </div>
    );
  }

  reset() {
    this.setState({
      selectedTarget: undefined,
      selectedPantheon: undefined,
      usedTokens: undefined,
    });
  }

  getPlayers() {
    return utils.myIndex() >= 0
      ? [utils.getMe(), utils.getOpponent()]
      : store.gameW.game.players;
  }

  renderPlayers() {
    const players = this.getPlayers();

    return (
      <div>
        <Player
          player={players[0]}
          selected={this.state.selectedTarget}
          usedTokens={this.state.usedTokens}
          selectWonder={this.select.bind(this)}
          discount={this.discountToken.bind(this)}
        />
        <Player
          player={players[1]}
          selectWonder={() => null}
          discount={() => null}
        />
      </div>
    );
  }

  selectPantheon(selectedPantheon: number) {
    if (!utils.isMyTurn()) return;
    const godIndex = store.gameW.game.pantheon[selectedPantheon];
    if (store.gameW.game.age === Age.one) {
      if (godIndex !== -1) return;
      if (this.state.selectedPantheon === selectedPantheon)
        selectedPantheon = -1;
      this.setState({ selectedPantheon });
    } else {
      utils.buyGod(selectedPantheon, this.state.usedTokens);
      this.reset();
    }
  }

  discountToken(tokenIndex: number) {
    if (!utils.isMyTurn()) return;
    const usedTokens = this.state.usedTokens || {};
    if (usedTokens[tokenIndex]) {
      delete usedTokens[tokenIndex];
    } else {
      usedTokens[tokenIndex] = true;
    }
    this.setState({ usedTokens });
  }

  select(selectedTarget: SelectedEnum) {
    if (!utils.isMyTurn()) return;
    if (this.state.selectedTarget === selectedTarget) return this.reset();
    this.setState({ selectedTarget });
  }

  selectTrash() {
    this.select(SelectedEnum.trash);
  }

  selectCard(x: number, y: number) {
    const message = utils.selectCard(x, y, this.state.selectedTarget);
    if (!message) return;
    this.reset();
    store.update(message);
  }
}

export default Main;

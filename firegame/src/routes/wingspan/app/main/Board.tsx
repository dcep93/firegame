import React from "react";
import styles from "../../../../shared/styles.module.css";
import { FoodEnum, HabitatEnum } from "../utils/types";
import utils, { store } from "../utils/utils";
import Habitat from "./Habitat";

type PropsType = {
  index: number;
  selected: { [habitat in HabitatEnum]?: number } | null;
  select: ((habitat: HabitatEnum, index: number) => void) | null;
};

class Board extends React.Component<PropsType, { minimized: boolean }> {
  constructor(props: PropsType) {
    super(props);
    this.state = { minimized: false };
  }

  render() {
    const isMe = utils.myIndex() === this.props.index;
    const isTurn = store.gameW.game.currentPlayer === this.props.index;
    const player = utils.getPlayer(this.props.index);
    const points = utils.getPoints(player);
    return (
      <div className={styles.bubble}>
        <h2
          className={[
            styles.bubble,
            isMe && styles.grey,
            isTurn && styles.blue,
          ].join(" ")}
          onClick={this.toggle.bind(this)}
        >
          {player.userName}
        </h2>
        <div hidden={this.state.minimized}>
          <div className={styles.bubble}>
            <div title={JSON.stringify(points, null, 2).replace(/"/g, "")}>
              Points: {Object.values(points).reduce((a, b) => a + b, 0)}
            </div>
            <div>Hand: {(player.hand || []).length}</div>
            <div>Bonuses: {player.bonuses.length}</div>
          </div>
          <div>
            {utils
              .enumArray(FoodEnum)
              .filter((food) => food !== FoodEnum.wild)
              .map(this.renderFood.bind(this))}
          </div>
          {utils.enumArray(HabitatEnum).map((h: HabitatEnum) => (
            <Habitat
              key={h}
              habitat={h}
              player={player}
              select={this.props.select}
              selected={(this.props.selected || {})[h]}
            />
          ))}
        </div>
      </div>
    );
  }

  renderFood(food: FoodEnum): JSX.Element {
    return (
      <div key={food} className={styles.bubble}>
        <span onClick={() => this.gainFood(food, false)}>{FoodEnum[food]}</span>
        :{" "}
        <span onClick={() => this.gainFood(food, true)}>
          {(utils.getMe().food || {})[food] || 0}
        </span>
      </div>
    );
  }

  gainFood(food: FoodEnum, positive: boolean) {
    utils.gainFood(food, positive ? 1 : -1);
    store.update(`${positive ? "gained" : "paid"} ${FoodEnum[food]}`);
  }

  toggle(): void {
    this.setState({ minimized: !this.state.minimized });
  }
}

export default Board;

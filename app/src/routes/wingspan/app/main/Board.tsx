import React from "react";
import styles from "../../../../shared/styles.module.css";
import { FoodEnum, HabitatEnum } from "../utils/types";
import utils, { store } from "../utils/utils";
import Habitat from "./Habitat";

type PropsType = {
  index: number;
  migrate: ((habitat: HabitatEnum, index: number) => boolean) | null;
  select: ((habitat: HabitatEnum, index: number) => void) | null;
  selected: { [habitat in HabitatEnum]?: number } | null;
  trashSelected: boolean;
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
    const points = utils.getPoints(player, this.props.index);
    return (
      <div className={styles.bubble}>
        <div>
          <h2
            className={[
              styles.inline,
              styles.bubble,
              isMe && styles.blue,
              !isMe && isTurn && styles.grey,
            ].join(" ")}
            onClick={this.toggle.bind(this)}
          >
            {player.userName}
          </h2>
          <div className={styles.inline} hidden={this.state.minimized}>
            <div className={[styles.inline, styles.bubble].join(" ")}>
              <div title={JSON.stringify(points, null, 2).replace(/"/g, "")}>
                Points*: {Object.values(points).reduce((a, b) => a + b, 0)}
              </div>
              <div>Hand: {(player.hand || []).length}</div>
              <div>Bonuses: {player.bonuses.length}</div>
              <div>
                Food: {Object.values(player.food).reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <div className={styles.inline}>
              {utils
                .enumArray(FoodEnum)
                .filter((food) => food !== FoodEnum.wild)
                .map(this.renderFood.bind(this))}
            </div>
          </div>
          <div hidden={this.state.minimized}>
            {utils.enumArray(HabitatEnum).map((h: HabitatEnum) => (
              <Habitat
                key={h}
                habitat={h}
                player={player}
                migrate={this.props.migrate}
                select={this.props.select}
                selected={(this.props.selected || {})[h]}
                trashSelected={this.props.trashSelected}
              />
            ))}
          </div>
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
          {utils.getPlayer(this.props.index).food[food]}
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

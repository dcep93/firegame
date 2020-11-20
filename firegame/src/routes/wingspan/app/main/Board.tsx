import React from "react";
import styles from "../../../../shared/styles.module.css";
import { FoodEnum, HabitatEnum } from "../utils/types";
import utils, { store } from "../utils/utils";
import Habitat from "./Habitat";

class Board extends React.Component<{
  index: number;
  selected: { [habitat in HabitatEnum]?: number } | null;
  select: ((habitat: HabitatEnum, index: number) => void) | null;
}> {
  render() {
    const isMe = utils.myIndex() === this.props.index;
    const isTurn = store.gameW.game.currentPlayer === this.props.index;
    const player = utils.getPlayer(this.props.index);
    return (
      <div className={styles.bubble}>
        <div>
          <h2
            className={[
              styles.bubble,
              isMe && styles.grey,
              isTurn && styles.blue,
            ].join(" ")}
          >
            {player.userName}
          </h2>
        </div>
        <div className={styles.bubble}>
          <div>Points: ?</div>
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
    );
  }

  renderFood(food: FoodEnum): JSX.Element {
    return (
      <div key={food} className={styles.bubble}>
        <span
          onClick={() => {
            utils.gainFood(food, -1);
            store.update(`paid ${FoodEnum[food]}`);
          }}
        >
          {FoodEnum[food]}
        </span>
        :{" "}
        <span
          onClick={() => {
            utils.gainFood(food, 1);
            store.update(`gained ${FoodEnum[food]}`);
          }}
        >
          {(utils.getMe().food || {})[food] || 0}
        </span>
      </div>
    );
  }
}

export default Board;

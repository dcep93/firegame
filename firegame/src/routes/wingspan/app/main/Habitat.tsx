import React from "react";
import store from "../../../../shared/store";
import styles from "../../../../shared/styles.module.css";
import wStyles from "../index.module.css";
import bank from "../utils/bank";
import { PlayerType } from "../utils/NewGame";
import { HabitatEnum } from "../utils/types";
import utils from "../utils/utils";

class Habitat extends React.Component<{
  habitat: HabitatEnum;
  player: PlayerType;
  select: (habitat: HabitatEnum, index: number) => void;
  selected: number | undefined;
}> {
  render() {
    return (
      <div className={[wStyles.habitatRow].join(" ")}>
        <span
          className={[
            styles.inline,
            styles.bubble,
            wStyles.habitatName,
            wStyles.habitatWords,
          ].join(" ")}
          onClick={this.use.bind(this)}
        >
          {HabitatEnum[this.props.habitat]}
        </span>
        {utils.count(5).map(this.renderPlace.bind(this))}
      </div>
    );
  }

  use(): void {
    store.update(`activated ${HabitatEnum[this.props.habitat]}`);
  }

  renderPlace(index: number): JSX.Element {
    return (
      <div key={index} className={styles.bubble}>
        {this.renderPlaceHelper(index)}
      </div>
    );
  }

  renderPlaceHelper(index: number): JSX.Element {
    const habitat = utils.getHabitat(this.props.player, this.props.habitat);
    const item = habitat[index]?.index;
    if (item !== undefined) {
      const card = bank.cards[item];
      return utils.cardItems(card);
    }
    const hg = placeToBonus[this.props.habitat];
    return (
      <div
        className={[
          wStyles.bird,
          wStyles.habitatWords,
          this.props.selected === index && styles.blue,
        ].join(" ")}
        onClick={() => this.select(index)}
      >
        {hg.start + Math.floor(index / 2)} [{hg.gain}]
        {index % 2 === 1 && ` + [${hg.pay}]`}{" "}
        {utils.repeat("*", Math.floor((index + 1) / 2)).join("")}
      </div>
    );
  }

  select(index: number) {
    utils.getMe().userId === this.props.player.userId &&
      this.props.select(this.props.habitat, index);
  }
}

const placeToBonus: { [h in HabitatEnum]: HabitatGainType } = {
  [HabitatEnum.forest]: { start: 1, gain: "feeder", pay: "card" },
  [HabitatEnum.grassland]: { start: 2, gain: "egg", pay: "food" },
  [HabitatEnum.wetland]: { start: 1, gain: "card", pay: "egg" },
};

export type HabitatGainType = { start: number; gain: string; pay: string };

export default Habitat;

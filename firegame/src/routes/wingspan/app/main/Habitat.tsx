import React from "react";
import styles from "../../../../shared/styles.module.css";
import wStyles from "../index.module.css";
import bank from "../utils/bank";
import { PlayerType } from "../utils/NewGame";
import { HabitatEnum } from "../utils/types";
import utils from "../utils/utils";

class Habitat extends React.Component<{
  habitat: HabitatEnum;
  player: PlayerType;
}> {
  render() {
    return (
      <div className={[styles.flex].join(" ")}>
        <span className={wStyles.habitat}>
          {HabitatEnum[this.props.habitat]}
        </span>
        {utils.count(5).map(this.renderPlace.bind(this))}
      </div>
    );
  }

  renderPlace(index: number): JSX.Element {
    return (
      <div key={index} className={styles.bubble}>
        {this.renderPlaceHelper(index)}
      </div>
    );
  }

  renderPlaceHelper(index: number): JSX.Element {
    const item = ((this.props.player.habitats || {})[this.props.habitat] || [])[
      index
    ]?.index;
    if (item !== undefined) {
      const card = bank.cards[item];
      return utils.cardItems(card);
    }
    const hg = placeToBonus[this.props.habitat];
    return (
      <div className={[wStyles.bird, wStyles.habitatGain].join(" ")}>
        {hg.start + Math.floor(index / 2)} [{hg.gain}]
        {index % 2 === 1 && ` + [${hg.pay}]`}
      </div>
    );
  }
}

const placeToBonus: { [h in HabitatEnum]: HabitatGainType } = {
  [HabitatEnum.forest]: { start: 1, gain: "feeder", pay: "card" },
  [HabitatEnum.grassland]: { start: 2, gain: "egg", pay: "food" },
  [HabitatEnum.wetland]: { start: 1, gain: "card", pay: "egg" },
};

export type HabitatGainType = { start: number; gain: string; pay: string };

export default Habitat;

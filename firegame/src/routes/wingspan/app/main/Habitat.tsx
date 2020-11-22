import React from "react";
import styles from "../../../../shared/styles.module.css";
import wStyles from "../index.module.css";
import bank from "../utils/bank";
import { BirdType, PlayerType } from "../utils/NewGame";
import { HabitatEnum } from "../utils/types";
import utils, { store } from "../utils/utils";

class Habitat extends React.Component<{
  habitat: HabitatEnum;
  player: PlayerType;
  migrate: ((habitat: HabitatEnum, index: number) => boolean) | null;
  select: ((habitat: HabitatEnum, index: number) => void) | null;
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
    const item = habitat[index];
    if (item) {
      const card = bank.cards[item.index];
      return (
        <div>
          <div onClick={() => this.activate(index)}>
            {utils.cardItems(card)}
          </div>
          <div>
            <span onClick={() => this.handleEgg(item, index, false)}>Eggs</span>
            :{" "}
            <span onClick={() => this.handleEgg(item, index, true)}>
              {item.eggs}
            </span>
          </div>
          <div>
            <span onClick={() => this.handleTuck(item, index, false)}>
              Tucked
            </span>
            :{" "}
            <span onClick={() => this.handleTuck(item, index, true)}>
              {item.tucked}
            </span>
          </div>
          <div>
            <span onClick={() => this.handleCache(item, index, false)}>
              Cache
            </span>
            :{" "}
            <span onClick={() => this.handleCache(item, index, true)}>
              {item.cache}
            </span>
          </div>
        </div>
      );
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

  notMe(): boolean {
    return utils.getMe() !== this.props.player;
  }

  activation(index: number): string {
    return `${HabitatEnum[this.props.habitat]}:${index + 1}`;
  }

  activate(index: number) {
    if (this.notMe()) return;
    if (this.props.migrate && this.props.migrate(this.props.habitat, index))
      return;
    store.update(`activated ${this.activation(index)}`);
  }

  handleEgg(item: BirdType, index: number, positive: boolean) {
    if (this.notMe()) return;
    item.eggs += positive ? 1 : -1;
    store.update(
      `${positive ? "laid" : "paid"} an egg ${this.activation(index)}`
    );
  }

  handleCache(item: BirdType, index: number, positive: boolean) {
    if (this.notMe()) return;
    item.cache += positive ? 1 : -1;
    store.update(
      `${positive ? "added to" : "removed from"} cache ${this.activation(
        index
      )}`
    );
  }

  handleTuck(item: BirdType, index: number, positive: boolean) {
    if (this.notMe()) return;
    item.tucked++;
    (positive ? utils.getMe().hand! : store.gameW.game.deck).shift();
    store.update(
      `tucked from ${positive ? "hand" : "deck"} ${this.activation(index)}`
    );
  }

  select(index: number) {
    this.props.select && this.props.select(this.props.habitat, index);
  }
}

const placeToBonus: { [h in HabitatEnum]: HabitatGainType } = {
  [HabitatEnum.forest]: { start: 1, gain: "feeder", pay: "card" },
  [HabitatEnum.grassland]: { start: 2, gain: "egg", pay: "food" },
  [HabitatEnum.wetland]: { start: 1, gain: "card", pay: "egg" },
};

export type HabitatGainType = { start: number; gain: string; pay: string };

export default Habitat;

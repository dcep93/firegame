import React from "react";
import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import wStyles from "../index.module.css";
import Preview from "../sidebar/Preview";
import { BirdType, GameType, PlayerType } from "./NewGame";
import {
  BonusType,
  CardType,
  ExpansionEnum,
  FoodEnum,
  HabitatEnum,
  NestEnum,
} from "./types";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  goalScoring = [
    { 0: 4, 1: 1, 2: 0, 3: 0 },
    { 0: 5, 1: 2, 2: 1, 3: 0 },
    { 0: 6, 1: 3, 2: 2, 3: 0 },
    { 0: 7, 1: 4, 2: 3, 3: 0 },
  ];

  cardItems(
    card: CardType,
    eggs: number | null = null,
    cache: number | null = null
  ) {
    return (
      <div className={wStyles.bird} onMouseEnter={() => Preview.setCard(card)}>
        <h5>{card.name}</h5>
        <div>{card.text}</div>
        <div>---</div>
        <div>wingspan: {card.wingspan} cm</div>
        <div>points: {card.points}</div>
        <div>capacity: {card.capacity}</div>
        <div>nest: {NestEnum[card.nest]}</div>
        <div>
          habitats: {card.habitats.map((h) => HabitatEnum[h]).join(", ")}
        </div>
        {eggs && <div>eggs: {eggs}</div>}
        {cache && <div>cache: {cache}</div>}
      </div>
    );
  }
  cardTitle(card: CardType): string {
    return [card.scientific_name, ExpansionEnum[card.expansion]].join("\n");
  }

  bonusTitle(bonus: BonusType): string {
    return [bonus.extra, ExpansionEnum[bonus.expansion]]
      .filter(Boolean)
      .join("\n\n");
  }

  reroll(game: GameType): void {
    game.feeder = this.count(5).map((_) =>
      utils.randomFrom(
        utils.enumArray(FoodEnum).filter((i) => i !== FoodEnum.wild)
      )
    );
  }

  getHabitat(player: PlayerType, habitat: HabitatEnum): BirdType[] {
    if (!(player.habitats || {})[habitat])
      player.habitats = Object.assign({ [habitat]: [] }, player.habitats);
    return player.habitats[habitat]!;
  }
}

const utils = new Utils();

export default utils;

export { store };

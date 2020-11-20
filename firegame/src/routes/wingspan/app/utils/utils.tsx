import React from "react";
import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import wStyles from "../index.module.css";
import Preview from "../sidebar/Preview";
import bank from "./bank";
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

  cardItems(card: CardType) {
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
        <div>
          food:{card.food_star ? " *" : " "}
          {Object.entries(card.food)
            .sort()
            .map(
              ([f, num]) =>
                `(${FoodEnum[parseInt(f)]}${num! > 1 ? ` ${num}` : ""})`
            )
            .join(card.food_slash ? " / " : " ")}
        </div>
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
      utils.randomFrom(utils.enumArray(FoodEnum))
    );
  }

  getHabitat(player: PlayerType, habitat: HabitatEnum): BirdType[] {
    if (!(player.habitats || {})[habitat])
      player.habitats = Object.assign({ [habitat]: [] }, player.habitats);
    return player.habitats[habitat]!;
  }

  gainFood(food: FoodEnum, amount: number) {
    const me = utils.getMe();
    if (!(me.food || {})[food]) me.food = Object.assign({ [food]: 0 }, me.food);
    me.food![food]! += amount;
  }

  getPoints(p: PlayerType): { [s: string]: number } {
    const pointsOnBirds = Object.values(p.habitats || {})
      .flatMap((i) => i!.filter(Boolean))
      .flatMap((i) => bank.cards[i!.index]!.points)
      .reduce((a, b) => a + b, 0);
    const tuckedCards = Object.values(p.habitats || {})
      .flatMap((i) => i!.filter(Boolean))
      .flatMap((i) => i.tucked)
      .reduce((a, b) => a + b, 0);
    const cachedFood = Object.values(p.habitats || {})
      .flatMap((i) => i!.filter(Boolean))
      .flatMap((i) => i.cache)
      .reduce((a, b) => a + b, 0);
    const eggs = Object.values(p.habitats || {})
      .flatMap((i) => i!.filter(Boolean))
      .flatMap((i) => i.eggs)
      .reduce((a, b) => a + b, 0);
    const goals = 0; // todo
    return { pointsOnBirds, tuckedCards, cachedFood, eggs, goals };
  }
}

const utils = new Utils();

export default utils;

export { store };

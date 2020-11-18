import React from "react";
import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import Preview from "../sidebar/Preview";
import { GameType, PlayerType } from "./NewGame";
import {
  BonusType,
  CardType,
  ExpansionEnum,
  HabitatEnum,
  NestEnum,
} from "./types";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  cardItems(
    card: CardType,
    eggs: number | null = null,
    cache: number | null = null
  ) {
    return (
      <div onMouseEnter={() => Preview.setCard(card)}>
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
}

const utils = new Utils();

export default utils;

export { store };

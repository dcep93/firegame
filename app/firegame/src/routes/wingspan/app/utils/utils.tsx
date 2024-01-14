import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import wStyles from "../index.module.css";
import Preview from "../sidebar/Preview";
import { BirdType, GameType, PlayerType } from "./NewGame";
import bank from "./bank";
import {
  BonusType,
  CardType,
  ColorEnum,
  ExpansionEnum,
  FoodEnum,
  HabitatEnum,
  NestEnum,
} from "./types";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  goalScoring = [
    [4, 1, 0, 0],
    [5, 2, 1, 0],
    [6, 3, 2, 0],
    [7, 4, 2, 0],
  ];

  cardItems(card: CardType) {
    return (
      <div className={wStyles.bird} onMouseEnter={() => Preview.setCard(card)}>
        <h5>{card.name}</h5>
        <div>{card.text}</div>
        <div>---</div>
        <div>wingspan: {card.wingspan} cm</div>
        <div>color: {ColorEnum[card.color]}</div>
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
        {card.flocking && <div>flocking</div>}
        {card.predator && <div>predator</div>}
      </div>
    );
  }
  cardTitle(card: CardType): string {
    return [card.scientific_name, ExpansionEnum[card.expansion]].join("\n");
  }

  bonusTitle(bonus: BonusType): string {
    const num = utils.getBonusNum(bonus, utils.getMe());
    const points = utils.getBonusPoints(bonus, utils.getMe());
    return [bonus.extra, ExpansionEnum[bonus.expansion], `${num} -> ${points}`]
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
    me.food[food] += amount;
  }

  getPoints(p: PlayerType, index: number): { [s: string]: number } {
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
    const playerIndex = index;
    const goals = store.gameW.game.goals
      .map((g) => g.rankings)
      .map((r, i) =>
        r
          .map((c, j) =>
            c && c[playerIndex]
              ? utils.goalScoring[i][j] /
                Object.values(c).filter(Boolean).length
              : 0
          )
          .reduce((a, b) => a + b, 0)
      )
      .reduce((a, b) => a + b, 0);
    const points: { [s: string]: number } = {
      pointsOnBirds,
      tuckedCards,
      cachedFood,
      eggs,
      goals,
    };
    if (store.gameW.game.roundNumber >= 5)
      points["bonuses"] = p.bonuses
        .map((i) => bank.bonuses[i])
        .map((b) => utils.getBonusPoints(b, p))
        .reduce((a, b) => a + b, 0);
    return points;
  }

  getBonusNum(b: BonusType, p: PlayerType): number {
    if (b.name === "Ecologist") {
      return Math.min(...Object.values(p.habitats || {}).map((i) => i!.length));
    } else if (b.name === "Visionary Leader") {
      return (p.hand || []).length;
    } else {
      const birds = Object.values(p.habitats || {})
        .flatMap((i) => i)
        .flatMap((i) => i);
      if (b.name === "Breeding Manager") {
        return birds.filter((bt) => bt!.eggs >= 4).length;
      } else if (b.name === "Citizen Scientist") {
        return birds.filter((bt) => bt!.tucked >= 1).length;
      } else if (b.name === "Oologist") {
        return birds.filter((bt) => bt!.eggs >= 1).length;
      } else {
        return birds.filter(
          (bt) => bank.cards[bt!.index].bonuses.indexOf(b.name) !== -1
        ).length;
      }
    }
  }

  getBonusPoints(b: BonusType, p: PlayerType): number {
    const num = utils.getBonusNum(b, p);
    if (b.vp_f![0]) return b.vp_f![0] * num;
    const key = Math.max(
      ...Object.keys(b.vp_f!)
        .map((i) => parseInt(i))
        .filter((i) => num >= i)
    );
    if (key === -Infinity) return 0;
    return b.vp_f![key];
  }

  draw(p: PlayerType) {
    if (!p.hand) p.hand = [];
    p.hand.unshift(store.gameW.game.deck.shift()!);
  }

  layEggs(bt: BirdType, num: number): void {
    const capacity = bank.cards[bt.index].capacity;
    bt.eggs = Math.min(bt.eggs + num, capacity);
  }

  newActions(): { [h in HabitatEnum]: number } {
    // @ts-ignore
    return utils
      .enumArray(HabitatEnum)
      .map((h) => ({ [h]: 0 }))
      .reduce((a, b) => Object.assign(a, b), {});
  }
}

const utils = new Utils();

export default utils;

export { store };

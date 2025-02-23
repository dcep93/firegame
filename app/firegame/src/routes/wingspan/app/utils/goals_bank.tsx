import ActivationsBank from "./activations_bank";
import bank from "./bank";
import { GoalType, PlayerType } from "./NewGame";
import { BirdType, HabitatEnum, NestEnum } from "./types";
import utils from "./utils";

function getCount(b: BirdType): number {
  return bank.cards[b.index].activation === ActivationsBank.countDouble ? 2 : 1;
}

function eggsInHabitat(h: BirdType[] | undefined): number {
  return (h || []).map((b) => b.eggs).reduce((a, b) => a + b, 0);
}

function eggsInNest(p: PlayerType, n: NestEnum): number {
  return Object.values(p.habitats)
    .map((h) =>
      (h || [])
        .filter(
          (b) => [n, NestEnum.wild].indexOf(bank.cards[b.index].nest) !== -1
        )
        .map((b) => b.eggs)
        .reduce((a, b) => a + b, 0)
    )
    .reduce((a, b) => a + b, 0);
}

function birdsWithEggs(p: PlayerType, n: NestEnum): number {
  return Object.values(p.habitats)
    .map((h) =>
      (h || [])
        .filter(
          (b) =>
            b.eggs > 0 &&
            [n, NestEnum.wild].indexOf(bank.cards[b.index].nest) !== -1
        )
        .map(getCount)
        .reduce((a, b) => a + b, 0)
    )
    .reduce((a, b) => a + b, 0);
}

const GoalsBank: GoalType[] = [
  [
    {
      goal: "birds",
      f: (p: PlayerType) =>
        Object.values(p.habitats)
          .flatMap((i) => i!)
          .map(getCount)
          .reduce((a, b) => a + b, 0),
    },
    {
      goal: "sets of eggs in habitats",
      f: (p: PlayerType) =>
        Math.min(...Object.values(p.habitats).map(eggsInHabitat)),
    },
  ],
  utils.enumArray(HabitatEnum).map((i: HabitatEnum) => ({
    goal: `birds in [${HabitatEnum[i]}]`,
    f: (p: PlayerType) =>
      (p.habitats[i] || []).map(getCount).reduce((a, b) => a + b, 0),
  })),
  utils.enumArray(HabitatEnum).map((h: HabitatEnum) => ({
    goal: `eggs in [${HabitatEnum[h]}]`,
    f: (p: PlayerType) => eggsInHabitat(p.habitats[h]),
  })),
  utils
    .enumArray(NestEnum)
    .filter((i: NestEnum) => i !== NestEnum.none && i !== NestEnum.wild)
    .map((n: NestEnum) => ({
      goal: `birds with eggs in [${NestEnum[n]}]`,
      f: (p: PlayerType) => birdsWithEggs(p, n),
    })),
  utils
    .enumArray(NestEnum)
    .filter((i: NestEnum) => i !== NestEnum.none && i !== NestEnum.wild)
    .map((n: NestEnum) => ({
      goal: `eggs in [${NestEnum[n]}]`,
      f: (p: PlayerType) => eggsInNest(p, n),
    })),
].flatMap((i) => i);

export default GoalsBank;

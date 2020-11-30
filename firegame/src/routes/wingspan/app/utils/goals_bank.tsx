import ActivationsBank from "./activations_bank";
import bank from "./bank";
import { BirdType, PlayerType } from "./NewGame";
import { GoalType, HabitatEnum, NestEnum } from "./types";

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
  {
    goal: "birds in [forest]",
    f: (p: PlayerType) =>
      (p.habitats[HabitatEnum.forest] || [])
        .map(getCount)
        .reduce((a, b) => a + b, 0),
  },
  {
    goal: "eggs in [grassland]",
    f: (p: PlayerType) => eggsInHabitat(p.habitats[HabitatEnum.grassland]),
  },
  {
    goal: "eggs in [wetland]",
    f: (p: PlayerType) => eggsInHabitat(p.habitats[HabitatEnum.wetland]),
  },
  {
    goal: "sets of eggs in habitats",
    f: (p: PlayerType) =>
      Math.min(...Object.values(p.habitats).map(eggsInHabitat)),
  },
  {
    goal: "birds with eggs in [cavity]",
    f: (p: PlayerType) => birdsWithEggs(p, NestEnum.cavity),
  },
  {
    goal: "birds with eggs in [bowl]",
    f: (p: PlayerType) => birdsWithEggs(p, NestEnum.bowl),
  },
  {
    goal: "eggs in [ground]",
    f: (p: PlayerType) => eggsInNest(p, NestEnum.ground),
  },
  {
    goal: "eggs in [platform]",
    f: (p: PlayerType) => eggsInNest(p, NestEnum.platform),
  },
];

export default GoalsBank;

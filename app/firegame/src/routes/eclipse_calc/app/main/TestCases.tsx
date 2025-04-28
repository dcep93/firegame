import { getOutcomesHelper } from "./Outcomes";

export default function TestCases(): string[] {
  const cases = [
    {
      name: "manual__initiative_vs_computer_hull",
      groups: [
        [
          {
            ship: {
              name: "evil",
              values: {
                cannons_1: 1,
                cannons_2: 0,
                cannons_3: 0,
                cannons_4: 0,
                computer: 0,
                count: 1,
                hull: 0,
                initiative: 1,
                missiles_1: 0,
                missiles_2: 0,
                missiles_3: 0,
                missiles_4: 0,
                shield: 0,
              },
            },
            damage: 0,
            fI: 1,
          },
        ],
        [
          {
            ship: {
              name: "good",
              values: {
                cannons_1: 1,
                cannons_2: 0,
                cannons_3: 0,
                cannons_4: 0,
                computer: 1,
                count: 1,
                hull: 1,
                initiative: 0,
                missiles_1: 0,
                missiles_2: 0,
                missiles_3: 0,
                missiles_4: 0,
                shield: 0,
              },
            },
            damage: 0,
            fI: 0,
          },
        ],
      ],
      expected: 29 / 32,
    },
  ];
  return cases
    .filter(
      (c) =>
        Math.abs(getOutcomesHelper(c.groups)![0].probability - c.expected) >
        0.01
    )
    .map((c) => c.name);
}

import { getOutcomesHelper } from "./Outcomes";

export default function TestCases(): { key: string; result: number }[] {
  const cases = [
    {
      name: "manual__initiative_vs_computer_hull",
      expected: 29 / 32,
      groups: [
        [
          {
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
        ],
        [
          {
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
        ],
      ],
    },
    {
      name: "sudden_death_1_cannon",
      expected: 3 / 4,
      groups: [
        [
          {
            name: "good",
            values: {
              initiative: 5,
              hull: 0,
              computer: 2,
              shield: 1,
              cannons_1: 1,
            },
          },
        ],
        [
          {
            name: "evil",
            values: {
              initiative: 4,
              hull: 0,
              computer: 1,
              shield: 1,
              cannons_1: 1,
            },
          },
        ],
      ],
    },
    {
      name: "manual__hull_vs_hull",
      expected: 26 / 49, // todo verify
      groups: [
        [
          {
            name: "good",
            values: {
              hull: 1,
              cannons_1: 1,
            },
          },
        ],
        [
          {
            name: "evil",
            values: {
              hull: 1,
              cannons_1: 1,
            },
          },
        ],
      ],
    },
    {
      name: "missile_vs_killer_missile",
      expected: 85 / 128,
      groups: [
        [
          {
            name: "good",
            values: {
              initiative: 4,
              hull: 1,
              computer: 2,
              shield: 1,
              missiles_1: 1,
              missiles_2: 0,
              missiles_3: 0,
              missiles_4: 0,
              cannons_1: 1,
              cannons_2: 0,
              cannons_3: 0,
              cannons_4: 0,
            },
          },
        ],
        [
          {
            name: "evil",
            values: {
              initiative: 5,
              hull: 1,
              computer: 1,
              shield: 1,
              missiles_1: 0,
              missiles_2: 1,
              missiles_3: 0,
              missiles_4: 0,
              cannons_1: 1,
              cannons_2: 0,
              cannons_3: 0,
              cannons_4: 0,
            },
          },
        ],
      ],
    },
    {
      name: "two_vs_three_missiles",
      expected: 23181 / 31104,
      groups: [
        [
          {
            name: "good",
            values: {
              initiative: 5,
              hull: 1,
              computer: 2,
              shield: 1,
              missiles_1: 2,
              cannons_1: 1,
            },
          },
        ],
        [
          {
            name: "evil",
            values: {
              initiative: 4,
              hull: 2,
              computer: 1,
              shield: 1,
              missiles_1: 3,
              cannons_1: 1,
            },
          },
        ],
      ],
    },
    {
      name: "multi_damage_combo",
      expected: 233_948_607 / 275_365_888,
      groups: [
        [
          {
            name: "good",
            values: {
              initiative: 6,
              hull: 2,
              computer: 2,
              shield: 1,
              missiles_1: 1,
              missiles_2: 1,
              cannons_1: 1,
              cannons_2: 1,
            },
          },
        ],
        [
          {
            name: "evil",
            values: {
              initiative: 4,
              hull: 2,
              computer: 1,
              shield: 1,
              missiles_1: 2,
              missiles_2: 1,
              cannons_1: 2,
            },
          },
        ],
      ],
    },
  ];
  return cases
    .filter(
      (c) =>
        [
          // filter
          "manual__initiative_vs_computer_hull",
        ].includes(c.name) === true
    )
    .map((c) => ({
      c,
      result: (() => {
        try {
          return getOutcomesHelper(c.groups)![0].probability;
        } catch (e) {
          console.log(c.name);
          console.error(e);
          return Number.POSITIVE_INFINITY;
        }
      })(),
    }))
    .filter(({ c, result }) => Math.abs(result - c.expected) > 0.01)
    .map(({ c, result }) => ({ key: c.name, result }));
}

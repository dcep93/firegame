import { getOutcomesHelper } from "./Outcomes";

const filteredTestName: string = "filteredTestName";

export default function TestCases(): {}[] {
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
              computer: 1,
              hull: 1,
            },
          },
        ],
        [
          {
            name: "evil",
            values: {
              cannons_1: 1,
              initiative: 1,
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
              cannons_1: 1,
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
              missiles_2: 1,
              cannons_1: 1,
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
              hull: 1,
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
  ].filter((c) => c.name === filteredTestName || filteredTestName === "");
  return cases
    .map((c) => ({
      ...c,
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
    .filter(({ expected, result }) => Math.abs(result - expected) > 0.01)
    .map(({ groups, ...c }) => c);
}

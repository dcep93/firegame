export enum Resource {
  coal,
  oil,
  garbage,
  uranium,

  hybrid,
  renewable,
}

export type PowerPlant = {
  cost: number;
  resources: { [r in Resource]?: number };
  power: number;
};

export const startingBankResources = {
  [Resource.coal]: 24,
  [Resource.oil]: 18,
  [Resource.garbage]: 6,
  [Resource.uranium]: 2,
};

export const powerplants: PowerPlant[] = [
  { cost: 3, resources: { [Resource.oil]: 2 }, power: 1 },
  { cost: 4, resources: { [Resource.coal]: 2 }, power: 1 },
  { cost: 5, resources: { [Resource.hybrid]: 2 }, power: 1 },
  { cost: 6, resources: { [Resource.garbage]: 1 }, power: 1 },
  { cost: 7, resources: { [Resource.oil]: 3 }, power: 2 },
  { cost: 8, resources: { [Resource.coal]: 3 }, power: 2 },
  { cost: 9, resources: { [Resource.oil]: 1 }, power: 1 },
  { cost: 10, resources: { [Resource.coal]: 2 }, power: 2 },
  { cost: 11, resources: { [Resource.uranium]: 1 }, power: 2 },
  { cost: 12, resources: { [Resource.hybrid]: 2 }, power: 2 },
  { cost: 13, resources: { [Resource.renewable]: 0 }, power: 1 },
  { cost: 14, resources: { [Resource.garbage]: 2 }, power: 2 },
  { cost: 15, resources: { [Resource.coal]: 2 }, power: 3 },
  { cost: 16, resources: { [Resource.oil]: 2 }, power: 3 },
  { cost: 17, resources: { [Resource.uranium]: 1 }, power: 2 },
  { cost: 18, resources: { [Resource.renewable]: 0 }, power: 2 },
  { cost: 19, resources: { [Resource.garbage]: 2 }, power: 3 },
  { cost: 20, resources: { [Resource.coal]: 3 }, power: 5 },
  { cost: 21, resources: { [Resource.hybrid]: 2 }, power: 4 },
  { cost: 22, resources: { [Resource.renewable]: 0 }, power: 2 },
  { cost: 23, resources: { [Resource.uranium]: 1 }, power: 3 },
  { cost: 24, resources: { [Resource.garbage]: 2 }, power: 4 },
  { cost: 25, resources: { [Resource.coal]: 2 }, power: 5 },
  { cost: 26, resources: { [Resource.oil]: 2 }, power: 5 },
  { cost: 27, resources: { [Resource.renewable]: 0 }, power: 3 },
  { cost: 28, resources: { [Resource.uranium]: 1 }, power: 4 },
  { cost: 29, resources: { [Resource.hybrid]: 1 }, power: 4 },
  { cost: 30, resources: { [Resource.garbage]: 3 }, power: 6 },
  { cost: 31, resources: { [Resource.coal]: 3 }, power: 6 },
  { cost: 32, resources: { [Resource.oil]: 3 }, power: 6 },
  { cost: 33, resources: { [Resource.renewable]: 0 }, power: 4 },
  { cost: 34, resources: { [Resource.uranium]: 1 }, power: 5 },
  { cost: 35, resources: { [Resource.oil]: 1 }, power: 5 },
  { cost: 36, resources: { [Resource.coal]: 3 }, power: 7 },
  { cost: 37, resources: { [Resource.renewable]: 0 }, power: 4 },
  { cost: 38, resources: { [Resource.garbage]: 3 }, power: 7 },
  { cost: 39, resources: { [Resource.uranium]: 1 }, power: 6 },
  { cost: 40, resources: { [Resource.oil]: 2 }, power: 6 },
  { cost: 42, resources: { [Resource.coal]: 2 }, power: 6 },
  { cost: 44, resources: { [Resource.renewable]: 0 }, power: 5 },
  { cost: 46, resources: { [Resource.hybrid]: 3 }, power: 7 },
  { cost: 50, resources: { [Resource.renewable]: 0 }, power: 6 },
];

export type BoardMap = {
  name: string;
  img: string;
  cities: { color: string; name: string; x: number; y: number }[];
  edges: { c1: string; c2: string; cost: number }[];
};

export const maps: BoardMap[] = [
  {
    name: "germany",
    img: "https://cf.geekdo-images.com/S4goYZXgXYxg6YM3XjCc3Q__original/img/8MwA59fnTZn8RdC4py4cryJ2uTM=/0x0/filters:format(jpeg)/pic354241.jpg",
    cities: [
      {
        color: "teal",
        name: "flensburg",
        x: 0.4108072916666667,
        y: 0.03369140625,
      },
      {
        color: "teal",
        name: "kiel",
        x: 0.4609375,
        y: 0.09521484375,
      },
      {
        color: "teal",
        name: "cuxhaven",
        x: 0.341796875,
        y: 0.14990234375,
      },
      {
        color: "teal",
        name: "wilhelmshaven",
        x: 0.2740885416666667,
        y: 0.1875,
      },
      {
        color: "teal",
        name: "bremen",
        x: 0.357421875,
        y: 0.24658203125,
      },
      {
        color: "teal",
        name: "hamburg",
        x: 0.4544270833333333,
        y: 0.1875,
      },
      {
        color: "teal",
        name: "hannover",
        x: 0.4563802083333333,
        y: 0.33642578125,
      },
      {
        color: "red",
        name: "osnabruck",
        x: 0.2819010416666667,
        y: 0.32177734375,
      },
      {
        color: "red",
        name: "munster",
        x: 0.22591145833333334,
        y: 0.38037109375,
      },
      {
        color: "red",
        name: "dortmund",
        x: 0.2421875,
        y: 0.45166015625,
      },
      {
        color: "red",
        name: "essen",
        x: 0.15559895833333334,
        y: 0.42333984375,
      },
      {
        color: "red",
        name: "duisburg",
        x: 0.09309895833333333,
        y: 0.40625,
      },
      {
        color: "red",
        name: "dusseldorf",
        x: 0.11002604166666667,
        y: 0.478515625,
      },
      {
        color: "red",
        name: "kassel",
        x: 0.4036458333333333,
        y: 0.46875,
      },
      {
        color: "blue",
        name: "aachen",
        x: 0.080078125,
        y: 0.54736328125,
      },
      {
        color: "blue",
        name: "koln",
        x: 0.17513020833333334,
        y: 0.5244140625,
      },
      {
        color: "blue",
        name: "trier",
        x: 0.12109375,
        y: 0.65771484375,
      },
      {
        color: "blue",
        name: "saarbrucken",
        x: 0.20638020833333334,
        y: 0.7275390625,
      },
      {
        color: "blue",
        name: "mannheim",
        x: 0.3359375,
        y: 0.70849609375,
      },
      {
        color: "blue",
        name: "wiesbaden",
        x: 0.28515625,
        y: 0.61962890625,
      },
      {
        color: "blue",
        name: "frankfurt-m",
        x: 0.3450520833333333,
        y: 0.5986328125,
      },
      {
        color: "purple",
        name: "freiburg",
        x: 0.2506510416666667,
        y: 0.8603515625,
      },
      {
        color: "purple",
        name: "konstanz",
        x: 0.3645833333333333,
        y: 0.8994140625,
      },
      {
        color: "purple",
        name: "stuttgart",
        x: 0.3658854166666667,
        y: 0.7861328125,
      },
      {
        color: "purple",
        name: "augsburg",
        x: 0.52734375,
        y: 0.81103515625,
      },
      {
        color: "purple",
        name: "munchen",
        x: 0.6256510416666666,
        y: 0.85986328125,
      },
      {
        color: "purple",
        name: "regensburg",
        x: 0.658203125,
        y: 0.751953125,
      },
      {
        color: "purple",
        name: "passau",
        x: 0.806640625,
        y: 0.80224609375,
      },
      {
        color: "yellow",
        name: "nurnberg",
        x: 0.5807291666666666,
        y: 0.6943359375,
      },
      {
        color: "yellow",
        name: "wurzburg",
        x: 0.4694010416666667,
        y: 0.6533203125,
      },
      {
        color: "yellow",
        name: "fulda",
        x: 0.453125,
        y: 0.5595703125,
      },
      {
        color: "yellow",
        name: "erfurt",
        x: 0.5807291666666666,
        y: 0.50390625,
      },
      {
        color: "yellow",
        name: "halle",
        x: 0.6529947916666666,
        y: 0.43994140625,
      },
      {
        color: "yellow",
        name: "leipzig",
        x: 0.7057291666666666,
        y: 0.46630859375,
      },
      {
        color: "yellow",
        name: "dresden",
        x: 0.8470052083333334,
        y: 0.50732421875,
      },
      {
        color: "brown",
        name: "frankfurt-d",
        x: 0.8854166666666666,
        y: 0.33935546875,
      },
      {
        color: "brown",
        name: "berlin",
        x: 0.7825520833333334,
        y: 0.31591796875,
      },
      {
        color: "brown",
        name: "magdeburg",
        x: 0.6360677083333334,
        y: 0.345703125,
      },
      {
        color: "brown",
        name: "schwerin",
        x: 0.5989583333333334,
        y: 0.19287109375,
      },
      {
        color: "brown",
        name: "rostock",
        x: 0.658203125,
        y: 0.1142578125,
      },
      {
        color: "brown",
        name: "torgelow",
        x: 0.845703125,
        y: 0.1865234375,
      },
      {
        color: "brown",
        name: "lubeck",
        x: 0.533203125,
        y: 0.13720703125,
      },
    ],
    edges: [
      { c1: "flensburg", c2: "kiel", cost: 4 },
      { c1: "kiel", c2: "hamburg", cost: 8 },
      { c1: "hamburg", c2: "lubeck", cost: 6 },
      { c1: "lubeck", c2: "schwerin", cost: 6 },
      { c1: "schwerin", c2: "hannover", cost: 19 },
      { c1: "hannover", c2: "hamburg", cost: 17 },
      { c1: "cuxhaven", c2: "bremen", cost: 8 },
      { c1: "bremen", c2: "hamburg", cost: 11 },
      { c1: "cuxhaven", c2: "hamburg", cost: 11 },
      { c1: "rostock", c2: "torgelow", cost: 19 },
      { c1: "torgelow", c2: "schwerin", cost: 19 },
      { c1: "schwerin", c2: "rostock", cost: 6 },
      { c1: "berlin", c2: "schwerin", cost: 18 },
      { c1: "magdeburg", c2: "schwerin", cost: 16 },
      { c1: "magdeburg", c2: "berlin", cost: 10 },
      { c1: "berlin", c2: "torgelow", cost: 15 },
      { c1: "berlin", c2: "frankfurt-d", cost: 6 },
      { c1: "dresden", c2: "frankfurt-d", cost: 16 },
      { c1: "frankfurt-d", c2: "leipzig", cost: 21 },
      { c1: "halle", c2: "berlin", cost: 17 },
      { c1: "halle", c2: "leipzig", cost: 0 },
      { c1: "magdeburg", c2: "halle", cost: 11 },
      { c1: "erfurt", c2: "dresden", cost: 19 },
      { c1: "halle", c2: "erfurt", cost: 6 },
      { c1: "leipzig", c2: "dresden", cost: 13 },
      { c1: "hannover", c2: "magdeburg", cost: 15 },
      { c1: "hamburg", c2: "schwerin", cost: 6 },
      { c1: "kiel", c2: "lubeck", cost: 4 },
      { c1: "wilhelmshaven", c2: "osnabruck", cost: 14 },
      { c1: "osnabruck", c2: "bremen", cost: 11 },
      { c1: "wilhelmshaven", c2: "bremen", cost: 11 },
      { c1: "bremen", c2: "hannover", cost: 10 },
      { c1: "hannover", c2: "osnabruck", cost: 16 },
      { c1: "osnabruck", c2: "munster", cost: 7 },
      { c1: "munster", c2: "essen", cost: 6 },
      { c1: "essen", c2: "duisburg", cost: 0 },
      { c1: "essen", c2: "dusseldorf", cost: 2 },
      { c1: "essen", c2: "dortmund", cost: 4 },
      { c1: "munster", c2: "dortmund", cost: 2 },
      { c1: "osnabruck", c2: "kassel", cost: 20 },
      { c1: "kassel", c2: "hannover", cost: 15 },
      { c1: "hannover", c2: "erfurt", cost: 19 },
      { c1: "erfurt", c2: "kassel", cost: 15 },
      { c1: "fulda", c2: "erfurt", cost: 13 },
      { c1: "kassel", c2: "fulda", cost: 8 },
      { c1: "dortmund", c2: "kassel", cost: 18 },
      { c1: "kassel", c2: "frankfurt-m", cost: 13 },
      { c1: "frankfurt-m", c2: "dortmund", cost: 20 },
      { c1: "dortmund", c2: "koln", cost: 10 },
      { c1: "koln", c2: "dusseldorf", cost: 4 },
      { c1: "dusseldorf", c2: "aachen", cost: 9 },
      { c1: "aachen", c2: "koln", cost: 7 },
      { c1: "frankfurt-m", c2: "fulda", cost: 8 },
      { c1: "koln", c2: "wiesbaden", cost: 21 },
      { c1: "wiesbaden", c2: "trier", cost: 18 },
      { c1: "trier", c2: "koln", cost: 20 },
      { c1: "aachen", c2: "trier", cost: 19 },
      { c1: "saarbrucken", c2: "wiesbaden", cost: 10 },
      { c1: "wiesbaden", c2: "mannheim", cost: 11 },
      { c1: "mannheim", c2: "saarbrucken", cost: 11 },
      { c1: "saarbrucken", c2: "stuttgart", cost: 17 },
      { c1: "stuttgart", c2: "mannheim", cost: 6 },
      { c1: "mannheim", c2: "wurzburg", cost: 10 },
      { c1: "wurzburg", c2: "fulda", cost: 11 },
      { c1: "frankfurt-m", c2: "wurzburg", cost: 13 },
      { c1: "wurzburg", c2: "nurnberg", cost: 8 },
      { c1: "nurnberg", c2: "erfurt", cost: 21 },
      { c1: "trier", c2: "saarbrucken", cost: 11 },
      { c1: "konstanz", c2: "freiburg", cost: 14 },
      { c1: "freiburg", c2: "stuttgart", cost: 16 },
      { c1: "stuttgart", c2: "konstanz", cost: 16 },
      { c1: "konstanz", c2: "augsburg", cost: 17 },
      { c1: "augsburg", c2: "stuttgart", cost: 15 },
      { c1: "stuttgart", c2: "wurzburg", cost: 12 },
      { c1: "wurzburg", c2: "augsburg", cost: 19 },
      { c1: "augsburg", c2: "munchen", cost: 6 },
      { c1: "munchen", c2: "passau", cost: 14 },
      { c1: "passau", c2: "regensburg", cost: 12 },
      { c1: "regensburg", c2: "munchen", cost: 10 },
      { c1: "regensburg", c2: "augsburg", cost: 13 },
      { c1: "nurnberg", c2: "regensburg", cost: 12 },
      { c1: "nurnberg", c2: "augsburg", cost: 18 },
    ],
  },
];

export const totalResources: { [r in Resource]?: number } = {
  [Resource.coal]: 24,
  [Resource.oil]: 24,
  [Resource.garbage]: 24,
  [Resource.uranium]: 12,
};

export const recharges: {
  [numPlayers: number]: { [step: number]: { [r in Resource]?: number } };
} = {
  2: {
    1: {
      [Resource.coal]: 3,
      [Resource.oil]: 2,
      [Resource.garbage]: 1,
      [Resource.uranium]: 1,
    },
    2: {
      [Resource.coal]: 4,
      [Resource.oil]: 2,
      [Resource.garbage]: 2,
      [Resource.uranium]: 1,
    },
    3: {
      [Resource.coal]: 3,
      [Resource.oil]: 4,
      [Resource.garbage]: 3,
      [Resource.uranium]: 1,
    },
  },
  3: {
    1: {
      [Resource.coal]: 4,
      [Resource.oil]: 2,
      [Resource.garbage]: 1,
      [Resource.uranium]: 1,
    },
    2: {
      [Resource.coal]: 5,
      [Resource.oil]: 3,
      [Resource.garbage]: 2,
      [Resource.uranium]: 1,
    },
    3: {
      [Resource.coal]: 3,
      [Resource.oil]: 4,
      [Resource.garbage]: 3,
      [Resource.uranium]: 1,
    },
  },
  4: {
    1: {
      [Resource.coal]: 5,
      [Resource.oil]: 3,
      [Resource.garbage]: 2,
      [Resource.uranium]: 1,
    },
    2: {
      [Resource.coal]: 6,
      [Resource.oil]: 4,
      [Resource.garbage]: 3,
      [Resource.uranium]: 2,
    },
    3: {
      [Resource.coal]: 4,
      [Resource.oil]: 5,
      [Resource.garbage]: 4,
      [Resource.uranium]: 2,
    },
  },
  5: {
    1: {
      [Resource.coal]: 5,
      [Resource.oil]: 4,
      [Resource.garbage]: 3,
      [Resource.uranium]: 2,
    },
    2: {
      [Resource.coal]: 7,
      [Resource.oil]: 5,
      [Resource.garbage]: 3,
      [Resource.uranium]: 3,
    },
    3: {
      [Resource.coal]: 5,
      [Resource.oil]: 6,
      [Resource.garbage]: 5,
      [Resource.uranium]: 2,
    },
  },
  6: {
    1: {
      [Resource.coal]: 7,
      [Resource.oil]: 5,
      [Resource.garbage]: 3,
      [Resource.uranium]: 2,
    },
    2: {
      [Resource.coal]: 9,
      [Resource.oil]: 6,
      [Resource.garbage]: 5,
      [Resource.uranium]: 3,
    },
    3: {
      [Resource.coal]: 6,
      [Resource.oil]: 7,
      [Resource.garbage]: 6,
      [Resource.uranium]: 3,
    },
  },
};

export const incomes: { [count: number]: number } = {
  0: 10,
  1: 22,
  2: 33,
  3: 44,
  4: 54,
  5: 64,
  6: 73,
  7: 82,
  8: 90,
  9: 98,
  10: 105,
  11: 112,
  12: 118,
  13: 124,
  14: 129,
  15: 134,
  16: 138,
  17: 142,
  18: 145,
  19: 148,
  20: 150,
};

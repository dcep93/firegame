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
  index: number;
  isPlug: boolean;
};

export const deck: PowerPlant[] = [
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
].map((pp, index) => ({
  ...pp,
  index,
  isPlug: pp.cost <= 15,
}));

export type Map = {
  name: string;
  img: string;
  cities: { name: string; x: number; y: number }[];
  edges: { c1: string; c2: string; cost: number }[];
};

export const maps: Map[] = [
  {
    name: "germany",
    img: "https://cf.geekdo-images.com/S4goYZXgXYxg6YM3XjCc3Q__original/img/8MwA59fnTZn8RdC4py4cryJ2uTM=/0x0/filters:format(jpeg)/pic354241.jpg",
    cities: [
      {
        name: "flensburg",
        x: 631,
        y: 69,
      },
      {
        name: "kiel",
        x: 708,
        y: 195,
      },
      {
        name: "cuxhaven",
        x: 525,
        y: 307,
      },
      {
        name: "wilhelmshaven",
        x: 421,
        y: 384,
      },
      {
        name: "bremen",
        x: 549,
        y: 505,
      },
      {
        name: "hamburg",
        x: 698,
        y: 384,
      },
      {
        name: "hannover",
        x: 701,
        y: 689,
      },
      {
        name: "osnabruck",
        x: 433,
        y: 659,
      },
      {
        name: "munster",
        x: 347,
        y: 779,
      },
      {
        name: "dortmund",
        x: 372,
        y: 925,
      },
      {
        name: "essen",
        x: 239,
        y: 867,
      },
      {
        name: "duisburg",
        x: 143,
        y: 832,
      },
      {
        name: "dusseldorf",
        x: 169,
        y: 980,
      },
      {
        name: "kassel",
        x: 620,
        y: 960,
      },
      {
        name: "aachen",
        x: 123,
        y: 1121,
      },
      {
        name: "koln",
        x: 269,
        y: 1074,
      },
      {
        name: "trier",
        x: 186,
        y: 1347,
      },
      {
        name: "saarbrucken",
        x: 317,
        y: 1490,
      },
      {
        name: "mannheim",
        x: 516,
        y: 1451,
      },
      {
        name: "wiesbaden",
        x: 438,
        y: 1269,
      },
      {
        name: "frankfurt-m",
        x: 530,
        y: 1226,
      },
      {
        name: "freiburg",
        x: 385,
        y: 1762,
      },
      {
        name: "konstanz",
        x: 560,
        y: 1842,
      },
      {
        name: "stuttgart",
        x: 562,
        y: 1610,
      },
      {
        name: "augsburg",
        x: 810,
        y: 1661,
      },
      {
        name: "munchen",
        x: 961,
        y: 1761,
      },
      {
        name: "regensburg",
        x: 1011,
        y: 1540,
      },
      {
        name: "passau",
        x: 1239,
        y: 1643,
      },
      {
        name: "nurnberg",
        x: 892,
        y: 1422,
      },
      {
        name: "wurzburg",
        x: 721,
        y: 1338,
      },
      {
        name: "fulda",
        x: 696,
        y: 1146,
      },
      {
        name: "erfurt",
        x: 892,
        y: 1032,
      },
      {
        name: "halle",
        x: 1003,
        y: 901,
      },
      {
        name: "leipzig",
        x: 1084,
        y: 955,
      },
      {
        name: "dresden",
        x: 1301,
        y: 1039,
      },
      {
        name: "frankfurt-d",
        x: 1360,
        y: 695,
      },
      {
        name: "berlin",
        x: 1202,
        y: 647,
      },
      {
        name: "magdeburg",
        x: 977,
        y: 708,
      },
      {
        name: "schwerin",
        x: 920,
        y: 395,
      },
      {
        name: "rostock",
        x: 1011,
        y: 234,
      },
      {
        name: "torgelow",
        x: 1299,
        y: 382,
      },
      {
        name: "lubeck",
        x: 819,
        y: 281,
      },
    ],
    edges: [],
  },
];

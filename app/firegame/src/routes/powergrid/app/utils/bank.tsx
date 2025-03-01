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
        name: "",
        x: 628,
        y: 67,
      },
      {
        name: "",
        x: 708,
        y: 196,
      },
      {
        name: "",
        x: 697,
        y: 389,
      },
      {
        name: "",
        x: 523,
        y: 310,
      },
      {
        name: "",
        x: 421,
        y: 386,
      },
      {
        name: "",
        x: 552,
        y: 502,
      },
      {
        name: "",
        x: 699,
        y: 688,
      },
      {
        name: "",
        x: 822,
        y: 280,
      },
      {
        name: "",
        x: 921,
        y: 397,
      },
      {
        name: "",
        x: 1013,
        y: 232,
      },
      {
        name: "",
        x: 1296,
        y: 382,
      },
      {
        name: "",
        x: 1199,
        y: 649,
      },
      {
        name: "",
        x: 972,
        y: 709,
      },
      {
        name: "",
        x: 1361,
        y: 695,
      },
      {
        name: "",
        x: 1005,
        y: 905,
      },
      {
        name: "",
        x: 1085,
        y: 958,
      },
      {
        name: "",
        x: 1299,
        y: 1043,
      },
      {
        name: "",
        x: 889,
        y: 1030,
      },
      {
        name: "",
        x: 698,
        y: 1145,
      },
      {
        name: "",
        x: 718,
        y: 1334,
      },
      {
        name: "",
        x: 891,
        y: 1422,
      },
      {
        name: "",
        x: 1239,
        y: 1643,
      },
      {
        name: "",
        x: 962,
        y: 1761,
      },
      {
        name: "",
        x: 1011,
        y: 1539,
      },
      {
        name: "",
        x: 812,
        y: 1658,
      },
      {
        name: "",
        x: 560,
        y: 1611,
      },
      {
        name: "",
        x: 387,
        y: 1757,
      },
      {
        name: "",
        x: 558,
        y: 1838,
      },
      {
        name: "",
        x: 513,
        y: 1450,
      },
      {
        name: "",
        x: 316,
        y: 1487,
      },
      {
        name: "",
        x: 186,
        y: 1345,
      },
      {
        name: "",
        x: 433,
        y: 1273,
      },
      {
        name: "",
        x: 532,
        y: 1225,
      },
      {
        name: "",
        x: 269,
        y: 1075,
      },
      {
        name: "",
        x: 120,
        y: 1123,
      },
      {
        name: "",
        x: 144,
        y: 828,
      },
      {
        name: "",
        x: 165,
        y: 975,
      },
      {
        name: "",
        x: 236,
        y: 865,
      },
      {
        name: "",
        x: 371,
        y: 921,
      },
      {
        name: "",
        x: 346,
        y: 776,
      },
      {
        name: "",
        x: 433,
        y: 660,
      },
      {
        name: "",
        x: 624,
        y: 958,
      },
    ],
    edges: [],
  },
];

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

export type GameType = {
  currentPlayer: number;
  players: PlayerType[];

  deckIndices: number[] | undefined;
  outOfPlayZones: number[] | undefined; // todo
  resources: { [r in Resource]?: number };
};

export type PlayerType = {
  userId: string;
  userName: string;

  color: string;
  money: number;
  powerPlantIndices: number[] | undefined;
  cityIndices: number[] | undefined;
  resources: { [r in Resource]?: number };
};

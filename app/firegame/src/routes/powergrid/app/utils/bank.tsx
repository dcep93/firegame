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
  index: number;
  isPlug: boolean;
};

export const deck: PowerPlant[] = [
  { cost: 3, resources: {} },
  { cost: 4, resources: {} },
  { cost: 16, resources: {} },
  { cost: 17, resources: {} },
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

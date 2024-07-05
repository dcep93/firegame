export enum Rank {
  i,
  ii,
  iii,
}

export const Tiles: { [id: string]: { points: number } } = {};

export type TileType = {
  rank: number;
};

export enum ResearchEnum {
  neutron_bombs,
}

export enum Track {
  pink,
  green,
  yellow,
  black,
}

export type ResearchType = { track: number; cost: number };

export const Research: {
  [r in ResearchEnum]: ResearchType;
} = {
  [ResearchEnum.neutron_bombs]: { track: 0, cost: 2 },
};

export type MaterialsType = {
  materials: number;
  science: number;
  gold: number;
};

export enum FactionEnum {
  blue,
  green,
  white,
  black,
  red,
  yellow,
}

export enum DiamondEnum {
  monolith,
}

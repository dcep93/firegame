import { Enemy, Tile, Token } from "./library";

export enum Resource {
  materials,
  science,
  gold,
}

export type Resources = {
  [r in Resource]: number;
};

export type Sector = {
  tile: Tile;
  orientation: number;
  enemies?: Enemy[];
  tokens?: Token[];
};

export enum Track {
  pink,
  green,
  yellow,
  black,
}

export enum Rank {
  o,
  i,
  ii,
  iii,
}

export enum Action {
  selectFaction,
}

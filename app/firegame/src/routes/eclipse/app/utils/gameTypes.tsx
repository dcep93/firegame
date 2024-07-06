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
  x: number;
  y: number;
  enemies: Enemy[] | undefined;
  tokens?: Token[];
};

export enum Track {
  pink,
  green,
  yellow,
  black,
}

export enum Rank {
  special,
  i,
  ii,
  iii,
}

export enum Action {
  selectFaction,
  turn,
  research,
}

export enum Ship {
  interceptor,
  cruiser,
  dreadnought,
  starbase,
}

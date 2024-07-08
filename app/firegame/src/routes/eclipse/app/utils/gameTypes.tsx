import { Faction, Tile, Token } from "./library";

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
  faction?: Faction;
  orientation: number;
  x: number;
  y: number;
  units?: { faction?: Faction; ship: Ship }[];
  tokens?: Token[];
  colonists:
    | { resource?: Resource; advanced?: boolean; active: boolean }[]
    | undefined;
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
  explore,
  move,
  build,
  upgrade,
  research,
  influence,
}

export enum Ship {
  interceptor,
  cruiser,
  dreadnought,
  starbase,
}

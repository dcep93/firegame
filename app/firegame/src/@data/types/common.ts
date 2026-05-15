import { ActionType, PopulationSquareType, ResourceType, WormholeEdge } from '../enums';

export interface HexCoord {
  readonly q: number;
  readonly r: number;
}

export interface PopulationSquare {
  readonly type: PopulationSquareType;
  readonly advanced: boolean;
}

export interface WormholeConfig {
  readonly edges: readonly WormholeEdge[];
  readonly halfWormholes?: readonly WormholeEdge[];
}

export interface ResourceTrackConfig {
  readonly startingProduction: number;
  readonly trackValues: readonly number[];
}

export interface ActivationLimits {
  readonly [ActionType.Explore]: number;
  readonly [ActionType.Research]: number;
  readonly [ActionType.Upgrade]: number;
  readonly [ActionType.Build]: number;
  readonly [ActionType.Move]: number;
  readonly [ActionType.Influence]: number;
}

export type Resources = { readonly [K in ResourceType]: number };

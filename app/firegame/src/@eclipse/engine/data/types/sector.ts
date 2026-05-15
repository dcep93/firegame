import { RingType, SpeciesId } from '../enums';
import { PopulationSquare, WormholeConfig } from './common';

export interface SectorDefinition {
  readonly id: string;
  readonly name: string;
  readonly ring: RingType;
  readonly vpValue: number;
  readonly wormholes: WormholeConfig;
  readonly populationSquares: readonly PopulationSquare[];
  readonly hasDiscovery: boolean;
  readonly hasArtifact: boolean;
  readonly hasAncient: boolean;
  readonly ancientCount?: number;
  readonly speciesHome?: SpeciesId;
}

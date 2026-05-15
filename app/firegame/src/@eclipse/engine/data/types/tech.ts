import { TechCategory } from '../enums';

export interface TechEffect {
  readonly type: string;
  readonly params?: Record<string, unknown>;
}

export interface TechDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: TechCategory;
  readonly minCost: number;
  readonly maxCost: number;
  readonly trackPosition?: number;
  readonly unlocksShipPart?: string;
  readonly unlocksBuilding?: string;
  readonly effect?: TechEffect;
  readonly isRare: boolean;
  readonly description: string;
}

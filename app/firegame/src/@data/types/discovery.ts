import { DiscoveryType, ResourceType } from '../enums';

export interface DiscoveryTileDefinition {
  readonly id: string;
  readonly type: DiscoveryType;
  readonly name: string;
  readonly count: number;
  readonly vpValue: number;
  readonly resourceBonus?: Partial<Record<ResourceType, number>>;
  readonly specialEffect?: string;
  readonly shipPartId?: string; // For AncientShipPart tiles: references SHIP_PARTS_BY_ID key
  readonly description: string;
}

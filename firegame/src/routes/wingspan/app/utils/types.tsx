export type BonusType = {
  name: string;
  to_skip: boolean;
  expansion: ExpansionEnum;
  automa: boolean;
  automa_only: boolean;
  condition: string;
  extra: string;
  vp_text: string;
  vp_f: { [num: number]: number } | null;
  percent: number | null;
};

export type CardType = {
  name: string;
  scientific_name: string;
  expansion: ExpansionEnum;
  text: string;
  predator: boolean;
  flocking: boolean;
  bonus: boolean;
  points: number;
  nest: NestEnum;
  capacity: number;
  wingspan: number;
  habitats: HabitatEnum[];
  food: { [f in FoodEnum]?: number };
  food_slash: boolean;
  food_star: boolean;
  bonuses: string[];
};

export enum ExpansionEnum {
  core,
  european,
  swiftstart,
  chinesepromo,
}

export enum NestEnum {
  cavity,
  ground,
  platform,
  bowl,
  wild,
  none,
}

export enum HabitatEnum {
  forest,
  grassland,
  wetland,
}

export enum FoodEnum {
  invertebrate,
  seed,
  fruit,
  fish,
  rodent,
  wild,
}

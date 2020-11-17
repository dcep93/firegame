export type BonusType = any;
export type CardType = {
  name: string;
  scientific_name: string;
  expansion: expansion;
  text: string;
  predator: boolean;
  flocking: boolean;
  bonus: boolean;
  points: number;
  nest: nest;
  capacity: number;
  wingspan: number;
  habitats: habitat[];
  food: { [f in food]?: number };
  food_slash: boolean;
  food_star: boolean;
  bonuses: string[];
};

enum expansion {
  core,
  european,
  swiftstart,
  chinesepromo,
}

enum nest {
  cavity,
  ground,
  platform,
  bowl,
  wild,
  none,
}

enum habitat {
  forest,
  grassland,
  wetland,
}

enum food {
  invertebrate,
  seed,
  fruit,
  fish,
  rodent,
  wild,
}

export default { expansion, nest, habitat, food };

export type BonusType = any;
export type CardType = any;

enum expansion {
  core,
  european,
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

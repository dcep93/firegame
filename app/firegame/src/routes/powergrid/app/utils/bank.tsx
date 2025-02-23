export enum Resource {
  coal,
  oil,
  garbage,
  uranium,
}

export type PowerPlant = { index: number; cost: number; isPlug: boolean };

export const deck: PowerPlant[] = [{ cost: 3 }, { cost: 16 }].map(
  (pp, index) => ({
    ...pp,
    index,
    isPlug: pp.cost <= 15,
  })
);

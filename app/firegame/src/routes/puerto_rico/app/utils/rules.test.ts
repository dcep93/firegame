import {
  BUILDINGS,
  BUILDING_IDS,
  GOODS_SUPPLY,
  PLANTATION_COUNTS,
  SETUP,
  TRADER_PRICES,
} from "./rules";

describe("Puerto Rico base rules data", () => {
  test("sets up supported player counts", () => {
    expect(SETUP[3].victoryPoints).toBe(75);
    expect(SETUP[4].shipSizes).toEqual([5, 6, 7]);
    expect(SETUP[5].roles).toContain("prospector_2");
    expect(SETUP[3].roles).not.toContain("prospector_1");
  });

  test("has the base production economy", () => {
    expect(PLANTATION_COUNTS).toMatchObject({
      corn: 10,
      indigo: 12,
      sugar: 11,
      tobacco: 9,
      coffee: 8,
    });
    expect(GOODS_SUPPLY).toMatchObject({
      corn: 10,
      indigo: 11,
      sugar: 11,
      tobacco: 9,
      coffee: 9,
    });
    expect(TRADER_PRICES).toMatchObject({
      corn: 0,
      indigo: 1,
      sugar: 2,
      tobacco: 3,
      coffee: 4,
    });
  });

  test("includes base buildings and core production capacities", () => {
    expect(BUILDING_IDS).toHaveLength(23);
    expect(BUILDINGS.small_indigo_plant).toMatchObject({
      cost: 1,
      victoryPoints: 1,
      good: "indigo",
      capacity: 1,
    });
    expect(BUILDINGS.coffee_roaster).toMatchObject({
      cost: 6,
      victoryPoints: 3,
      good: "coffee",
      capacity: 2,
    });
    expect(BUILDINGS.city_hall).toMatchObject({
      cost: 10,
      victoryPoints: 4,
      size: 2,
      kind: "large",
    });
  });
});

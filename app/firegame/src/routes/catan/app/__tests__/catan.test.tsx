import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Main from "../main/Main";
import NewGame, {
  GameType,
  Params,
  PlayerType,
  Resource,
  ResourceCard,
} from "../utils/NewGame";
import store from "../../../../shared/store";

const baseLobby = {
  u1: "Alice",
  u2: "Bob",
};

const baseMe = {
  userId: "u1",
  roomId: 1,
  gameName: "catan",
  VERSION: "v0.1.2",
};

const baseInfo = {
  host: "u1",
  timestamp: 0,
  id: 0,
  message: "test",
  playerId: "u1",
  playerName: "Alice",
};

const baseNumbers = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12,
];

const setStore = (game: GameType) => {
  (store as any).me = { ...baseMe };
  (store as any).lobby = { ...baseLobby };
  (store as any).gameW = { info: { ...baseInfo }, game };
  (store as any).update = jest.fn();
};

const setBaseStore = () => {
  (store as any).me = { ...baseMe };
  (store as any).lobby = { ...baseLobby };
};

const seedRandom = (seed: number) => {
  let t = seed;
  return () => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const withSeed = async <T,>(seed: number, fn: () => Promise<T> | T) => {
  const randomSpy = jest
    .spyOn(Math, "random")
    .mockImplementation(seedRandom(seed));
  try {
    return await fn();
  } finally {
    randomSpy.mockRestore();
  }
};

const makePlayer = (
  userId: string,
  userName: string,
  resources: Partial<Record<ResourceCard, number>> = {}
): PlayerType => ({
  userId,
  userName,
  resources: {
    wood: 0,
    sheep: 0,
    wheat: 0,
    brick: 0,
    ore: 0,
    ...resources,
  },
  settlements: 2,
  cities: 0,
  roads: 2,
  victoryPoints: 2,
});

describe("Catan game logic", () => {
  test("newGame creates a deterministic seeded board", async () => {
    setBaseStore();
    const params: Params = {
      lobby: baseLobby,
      citiesAndKnights: false,
    };
    const gameA = await withSeed(1337, () => NewGame(params));
    const gameB = await withSeed(1337, () => NewGame(params));

    expect(gameA.tiles).toEqual(gameB.tiles);
    expect(gameA.tiles).toHaveLength(19);

    const resources = gameA.tiles.map((tile) => tile.resource);
    const resourceCounts = resources.reduce<Record<Resource, number>>(
      (counts, resource) => {
        counts[resource] += 1;
        return counts;
      },
      { wood: 0, sheep: 0, wheat: 0, brick: 0, ore: 0, desert: 0 }
    );

    expect(resourceCounts).toEqual({
      wood: 4,
      sheep: 4,
      wheat: 4,
      brick: 3,
      ore: 3,
      desert: 1,
    });

    const numbers = gameA.tiles
      .filter((tile) => tile.resource !== "desert")
      .map((tile) => tile.number)
      .filter((num): num is number => num !== undefined)
      .sort((a, b) => a - b);
    expect(numbers).toEqual([...baseNumbers].sort((a, b) => a - b));

    expect(gameA.players).toHaveLength(2);
    expect(gameA.players[0].resources).toEqual({
      wood: 0,
      sheep: 0,
      wheat: 0,
      brick: 0,
      ore: 0,
    });
    expect(gameA.currentPlayer).toBe(0);
  });

  test("roll dice grants resources for matching tiles", () => {
    const game: GameType = {
      params: { lobby: baseLobby, citiesAndKnights: false },
      currentPlayer: 0,
      players: [makePlayer("u1", "Alice"), makePlayer("u2", "Bob")],
      tiles: [
        { resource: "wood", number: 5 },
        { resource: "desert" },
      ],
      hasRolled: false,
    };
    setStore(game);

    const randomSpy = jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5);

    render(<Main />);
    fireEvent.click(screen.getByRole("button", { name: /roll dice/i }));

    expect(game.hasRolled).toBe(true);
    expect(game.lastRoll).toEqual({
      dice: [1, 4],
      total: 5,
      playerIndex: 0,
    });
    expect(game.players[0].resources.wood).toBe(1);

    randomSpy.mockRestore();
  });

  test("build settlement spends resources and awards points", () => {
    const game: GameType = {
      params: { lobby: baseLobby, citiesAndKnights: false },
      currentPlayer: 0,
      players: [
        makePlayer("u1", "Alice", {
          brick: 1,
          wood: 1,
          sheep: 1,
          wheat: 1,
        }),
        makePlayer("u2", "Bob"),
      ],
      tiles: [{ resource: "desert" }],
      hasRolled: true,
    };
    setStore(game);

    render(<Main />);
    fireEvent.click(
      screen.getByRole("button", { name: /build settlement/i })
    );

    expect(game.players[0].resources).toEqual({
      wood: 0,
      sheep: 0,
      wheat: 0,
      brick: 0,
      ore: 0,
    });
    expect(game.players[0].settlements).toBe(3);
    expect(game.players[0].victoryPoints).toBe(3);
  });

  test("upgrade city converts settlement and updates points", () => {
    const game: GameType = {
      params: { lobby: baseLobby, citiesAndKnights: false },
      currentPlayer: 0,
      players: [
        makePlayer("u1", "Alice", { ore: 3, wheat: 2 }),
        makePlayer("u2", "Bob"),
      ],
      tiles: [{ resource: "desert" }],
      hasRolled: true,
    };
    game.players[0].settlements = 1;
    setStore(game);

    render(<Main />);
    fireEvent.click(
      screen.getByRole("button", { name: /upgrade to city/i })
    );

    expect(game.players[0].resources).toEqual({
      wood: 0,
      sheep: 0,
      wheat: 0,
      brick: 0,
      ore: 0,
    });
    expect(game.players[0].settlements).toBe(0);
    expect(game.players[0].cities).toBe(1);
    expect(game.players[0].victoryPoints).toBe(3);
  });
});

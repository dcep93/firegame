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
import {
  baseGameScript,
  citiesAndKnightsScript,
} from "../utils/gameScripts";
import {
  createDomDemoDriver,
  hasScriptWinner,
  runGameScript,
  withSeed,
} from "../utils/demoRunner";
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
  commodities: {
    cloth: 0,
    coin: 0,
    paper: 0,
  },
  settlements: 0,
  cities: 0,
  roads: 0,
  playedKnights: 0,
  victoryPoints: 0,
  devCards: 0,
  ports: [],
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
    expect(gameA.players[0].commodities).toEqual({
      cloth: 0,
      coin: 0,
      paper: 0,
    });
    expect(gameA.setupPhase?.active).toBe(true);
    expect(gameA.setupPhase?.order).toEqual([0, 1, 1, 0]);
    expect(gameA.currentPlayer).toBe(0);
  });

  test("newGame base game omits starting commodities in the bank", async () => {
    setBaseStore();
    const params: Params = {
      lobby: baseLobby,
      citiesAndKnights: false,
    };
    const game = await withSeed(2024, () => NewGame(params));

    expect(game.bank?.commodities).toEqual({
      cloth: 0,
      coin: 0,
      paper: 0,
    });
  });

  test("roll dice grants resources for matching tiles", () => {
    const game: GameType = {
      params: { lobby: baseLobby, citiesAndKnights: false },
      currentPlayer: 0,
      players: [
        { ...makePlayer("u1", "Alice"), settlements: 1, victoryPoints: 1 },
        makePlayer("u2", "Bob"),
      ],
      tiles: [
        { resource: "wood", number: 5, vertices: [0] },
        { resource: "desert" },
      ],
      vertices: [{ id: 0, x: 0, y: 0, building: { playerIndex: 0, type: "settlement" } }],
      roads: [],
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
        {
          ...makePlayer("u1", "Alice", {
            brick: 1,
            wood: 1,
            sheep: 1,
            wheat: 1,
          }),
          settlements: 2,
          victoryPoints: 2,
        },
        makePlayer("u2", "Bob"),
      ],
      tiles: [{ resource: "desert", vertices: [0] }],
      vertices: [{ id: 0, x: 0, y: 0 }],
      roads: [],
      hasRolled: true,
    };
    setStore(game);

    render(<Main />);
    fireEvent.click(screen.getByRole("button", { name: /vertex-0/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /confirm/i })
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
        {
          ...makePlayer("u1", "Alice", { ore: 3, wheat: 2 }),
          settlements: 1,
          victoryPoints: 2,
        },
        makePlayer("u2", "Bob"),
      ],
      tiles: [{ resource: "desert", vertices: [0] }],
      vertices: [
        { id: 0, x: 0, y: 0, building: { playerIndex: 0, type: "settlement" } },
      ],
      roads: [],
      hasRolled: true,
    };
    setStore(game);

    render(<Main />);
    fireEvent.click(screen.getByRole("button", { name: /vertex-0/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /confirm/i })
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

  test("setup phase places settlements in snake order without cost", () => {
    const game: GameType = {
      params: { lobby: baseLobby, citiesAndKnights: false },
      currentPlayer: 0,
      players: [makePlayer("u1", "Alice"), makePlayer("u2", "Bob")],
      tiles: [
        { resource: "desert", vertices: [0] },
        { resource: "desert", vertices: [1] },
      ],
      vertices: [
        { id: 0, x: 0, y: 0 },
        { id: 1, x: 2, y: 0 },
      ],
      roads: [],
      hasRolled: false,
      setupPhase: { active: true, order: [0, 1, 1, 0], index: 0, step: "settlement" },
    };
    setStore(game);

    const { rerender } = render(<Main />);

    fireEvent.click(screen.getByRole("button", { name: /vertex-0/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(game.players[0].settlements).toBe(1);
    expect(game.players[0].victoryPoints).toBe(1);
    expect(game.currentPlayer).toBe(0);

    fireEvent.click(screen.getByRole("button", { name: /edge-0/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(game.currentPlayer).toBe(1);

    (store as any).me = { ...baseMe, userId: "u2" };
    rerender(<Main />);

    fireEvent.click(screen.getByRole("button", { name: /vertex-1/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(game.players[1].settlements).toBe(1);
    expect(game.players[1].victoryPoints).toBe(1);
    expect(game.currentPlayer).toBe(1);
    expect(game.setupPhase?.index).toBe(1);
  });

  test("setup second settlement grants adjacent resources", () => {
    const game: GameType = {
      params: { lobby: baseLobby, citiesAndKnights: false },
      currentPlayer: 0,
      players: [
        { ...makePlayer("u1", "Alice"), settlements: 1, victoryPoints: 1 },
        makePlayer("u2", "Bob"),
      ],
      tiles: [
        { resource: "wood", vertices: [0] },
        { resource: "brick", vertices: [0] },
        { resource: "desert", vertices: [0] },
      ],
      vertices: [{ id: 0, x: 0, y: 0 }],
      roads: [],
      hasRolled: false,
      bank: {
        resources: { wood: 19, sheep: 19, wheat: 19, brick: 19, ore: 19 },
        commodities: { cloth: 0, coin: 0, paper: 0 },
      },
      setupPhase: { active: true, order: [0], index: 0, step: "settlement" },
    };
    setStore(game);

    render(<Main />);

    fireEvent.click(screen.getByRole("button", { name: /vertex-0/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(game.players[0].resources).toEqual({
      wood: 1,
      sheep: 0,
      wheat: 0,
      brick: 1,
      ore: 0,
    });
    expect(game.players[0].settlements).toBe(2);
    expect(game.players[0].victoryPoints).toBe(2);
  });

  test("spectators see a safe hand summary", () => {
    const game: GameType = {
      params: { lobby: baseLobby, citiesAndKnights: false },
      currentPlayer: 0,
      players: [makePlayer("u1", "Alice"), makePlayer("u2", "Bob")],
      tiles: [{ resource: "desert", vertices: [0] }],
      vertices: [{ id: 0, x: 0, y: 0 }],
      roads: [],
      hasRolled: false,
    };
    setStore(game);
    (store as any).me = { ...baseMe, userId: "spectator" };

    render(<Main />);

    expect(screen.getByText(/your hand:/i)).toBeInTheDocument();
    expect(screen.getByText(/spectating/i)).toBeInTheDocument();
  });

  test.each([
    ["base", baseGameScript, false],
    ["cities and knights", citiesAndKnightsScript, true],
  ])("demo script produces a winner (%s)", async (_label, script, ckEnabled) => {
    setBaseStore();
    const params: Params = {
      lobby: baseLobby,
      citiesAndKnights: ckEnabled,
      isDemo: true,
    };
    const game = await withSeed(1337, () => NewGame(params));
    setStore(game);

    const { rerender } = render(<Main />);
    const driver = createDomDemoDriver(() => store.gameW.game);

    await runGameScript(script, driver, {
      beforeEach: () => {
        expect(hasScriptWinner(store.gameW.game)).toBe(false);
      },
      afterEach: () => {
        rerender(<Main />);
      },
    });

    expect(hasScriptWinner(store.gameW.game)).toBe(true);
  });
});

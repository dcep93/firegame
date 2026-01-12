import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type Resource = "wood" | "sheep" | "wheat" | "brick" | "ore" | "desert";
export type ResourceCard = Exclude<Resource, "desert">;
export type Commodity = "cloth" | "coin" | "paper";
export type ResourceCounts = Record<ResourceCard, number>;
export type CommodityCounts = Record<Commodity, number>;

export type BuildingType = "settlement" | "city";

export type Building = {
  playerIndex: number;
  type: BuildingType;
};

export type Vertex = {
  id: number;
  x: number;
  y: number;
  building?: Building;
};

export type RoadSegment = {
  playerIndex: number;
  edge: [number, number];
};

export type Tile = {
  resource: Resource;
  number?: number;
  vertices?: number[];
};

export type Params = {
  lobby: LobbyType;
  citiesAndKnights: boolean;
};

export type PortType = "generic" | ResourceCard;

export type PlayerType = {
  userId: string;
  userName: string;
  resources: ResourceCounts;
  commodities: CommodityCounts;
  settlements: number;
  cities: number;
  roads: number;
  playedKnights: number;
  victoryPoints: number;
  devCards: number;
  ports?: PortType[];
};

export type RollType = {
  dice: [number, number];
  total: number;
  playerIndex: number;
};

export type SetupPhase = {
  active: boolean;
  order: number[];
  index: number;
  step: "settlement" | "road";
};

export type Port = {
  edge: [number, number];
  type: PortType;
};

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  tiles: Tile[];
  vertices?: Vertex[];
  roads?: RoadSegment[];
  robberTileIndex?: number;
  ports?: Port[];
  bank?: {
    resources: ResourceCounts;
    commodities: CommodityCounts;
  };
  hasRolled: boolean;
  lastRoll?: RollType;
  pendingRobber?: boolean;
  setupPhase?: SetupPhase;
};

const baseNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const baseBankResources: ResourceCounts = {
  wood: 19,
  sheep: 19,
  wheat: 19,
  brick: 19,
  ore: 19,
};

const baseBankCommodities: CommodityCounts = {
  cloth: 0,
  coin: 0,
  paper: 0,
};

const cornerAngles = [30, 90, 150, 210, 270, 330].map(
  (deg) => (deg * Math.PI) / 180
);

const axialCoords = () => {
  const coords: { q: number; r: number }[] = [];
  for (let r = -2; r <= 2; r += 1) {
    const qMin = Math.max(-2, -r - 2);
    const qMax = Math.min(2, -r + 2);
    for (let q = qMin; q <= qMax; q += 1) {
      coords.push({ q, r });
    }
  }
  return coords;
};

const buildBoard = (resources: Resource[], numbers: number[]) => {
  const vertexMap = new Map<string, number>();
  const vertices: Vertex[] = [];

  const tiles: Tile[] = resources.map((resource, index) => {
    const { q, r } = axialCoords()[index];
    const centerX = Math.sqrt(3) * (q + r / 2);
    const centerY = (3 / 2) * r;
    const vertexIndices = cornerAngles.map((angle) => {
      const x = centerX + Math.cos(angle);
      const y = centerY + Math.sin(angle);
      const key = `${x.toFixed(4)},${y.toFixed(4)}`;
      if (!vertexMap.has(key)) {
        const id = vertices.length;
        vertexMap.set(key, id);
        vertices.push({ id, x, y });
      }
      return vertexMap.get(key)!;
    });

    if (resource === "desert") {
      return { resource, vertices: vertexIndices };
    }

    return {
      resource,
      number: numbers.shift(),
      vertices: vertexIndices,
    };
  });

  return { tiles, vertices };
};

const buildPorts = (tiles: Tile[]) => {
  const edgeCounts = new Map<
    string,
    { edge: [number, number]; count: number }
  >();

  tiles.forEach((tile) => {
    const verts = tile.vertices || [];
    verts.forEach((vertexId, index) => {
      const next = verts[(index + 1) % verts.length];
      const edge: [number, number] =
        vertexId < next ? [vertexId, next] : [next, vertexId];
      const key = edge.join("-");
      const existing = edgeCounts.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        edgeCounts.set(key, { edge, count: 1 });
      }
    });
  });

  const outerEdges = Array.from(edgeCounts.values())
    .filter((edge) => edge.count === 1)
    .map((edge) => edge.edge);

  const portTypes: PortType[] = [
    "generic",
    "generic",
    "generic",
    "generic",
    "wood",
    "brick",
    "sheep",
    "wheat",
    "ore",
  ];

  const shuffledPorts = utils.shuffle([...portTypes]);
  const shuffledEdges = utils
    .shuffle([...outerEdges])
    .slice(0, shuffledPorts.length);

  return shuffledEdges.map((edge, index) => ({
    edge,
    type: shuffledPorts[index],
  }));
};

function NewGame(params: Params): Promise<GameType> {
  const baseResources = [
    ...utils.repeat("wood", 4),
    ...utils.repeat("sheep", 4),
    ...utils.repeat("wheat", 4),
    ...utils.repeat("brick", 3),
    ...utils.repeat("ore", 3),
    "desert",
  ] as Resource[];
  const shuffledResources = utils.shuffle([...baseResources]);
  const shuffledNumbers = utils.shuffle([...baseNumbers]);

  const { tiles, vertices } = buildBoard(shuffledResources, shuffledNumbers);
  const robberTileIndex = tiles.findIndex((tile) => tile.resource === "desert");
  const ports = buildPorts(tiles);

  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    tiles,
    vertices,
    roads: [],
    robberTileIndex: robberTileIndex >= 0 ? robberTileIndex : undefined,
    ports,
    bank: {
      resources: { ...baseBankResources },
      commodities: params.citiesAndKnights
        ? { cloth: 6, coin: 6, paper: 6 }
        : { ...baseBankCommodities },
    },
    hasRolled: false,
  };

  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      resources: {
        wood: 0,
        sheep: 0,
        wheat: 0,
        brick: 0,
        ore: 0,
      },
      commodities: params.citiesAndKnights
        ? {
            cloth: 0,
            coin: 0,
            paper: 0,
          }
        : { ...baseBankCommodities },
      settlements: 0,
      cities: 0,
      roads: 0,
      playedKnights: 0,
      victoryPoints: 0,
      devCards: 0,
      ports: [],
    }));

  const playerCount = game.players.length;
  const forward = utils.count(playerCount);
  const order = [...forward, ...[...forward].reverse()];
  game.setupPhase = {
    active: true,
    order,
    index: 0,
    step: "settlement",
  };
  game.currentPlayer = order[0] ?? 0;

  return Promise.resolve(game);
}

export default NewGame;

import {
  SPECIES,
  TECHS_BY_ID,
  INNER_SECTORS,
  MIDDLE_SECTORS,
  OUTER_SECTORS,
  GALACTIC_CENTER_SECTOR,
  STARTING_SECTORS,
  GUARDIAN_SECTORS,
  SECTORS_BY_ID,
  DISCOVERY_TILES,
  createReputationBag,
  DEFAULT_BLUEPRINTS,
  SHIP_PARTS_BY_ID,
} from '@data/definitions/index';
import {
  SHIP_LIMITS,
  TECH_SETUP_DRAW,
  OUTER_SECTOR_COUNTS,
  NON_RARE_TILE_COUNT,
  RARE_TILE_COUNT,
} from '@data/constants';
import {
  PhaseType,
  ActionType,
  ShipType,
  TechCategory,
  NpcType,
  PopulationSquareType,
  ResourceType,
} from '@data/enums';
import type {
  GameState,
  GameConfig,
  PlayerState,
  BoardState,
  TechTrayState,
  TechTraySlot,
  SectorStacks,
  PlacedSector,
  PlacedPopulation,
  ShipOnBoard,
  PlayerId,
} from '../types';
import { createRng, nextInt, shuffle, drawFromBag } from '../utils/rng';
import { positionToKey, hexRingPositions } from '../hex/hex-math';
import { appendEvent, createEvent } from '../utils/events';
import { createInitialBlueprint } from './blueprint-helpers';

export function createGame(config: GameConfig): GameState {
  // 1. Validate config
  const playerIds = Object.keys(config.speciesAssignments);
  if (config.playerCount < 2 || config.playerCount > 6) {
    throw new Error(`Invalid player count: ${config.playerCount}. Must be 2-6.`);
  }
  if (playerIds.length !== config.playerCount) {
    throw new Error(
      `Species assignments count (${playerIds.length}) does not match player count (${config.playerCount}).`,
    );
  }
  const speciesIds = Object.values(config.speciesAssignments);
  const uniqueSpecies = new Set(speciesIds);
  if (uniqueSpecies.size !== speciesIds.length) {
    throw new Error('Duplicate species assignments.');
  }
  for (const speciesId of speciesIds) {
    if (!SPECIES[speciesId]) {
      throw new Error(`Invalid species ID: ${speciesId}`);
    }
  }

  // 2. Initialize RNG
  let rngState = createRng(config.seed);

  // 2b. Resolve NPC blueprint variants (random if not specified)
  let ancientVariant = config.ancientBlueprintVariant;
  if (ancientVariant == null) {
    let v: number;
    [v, rngState] = nextInt(rngState, 1, 2);
    ancientVariant = v as 1 | 2;
  }
  let guardianVariant = config.guardianBlueprintVariant;
  if (guardianVariant == null) {
    let v: number;
    [v, rngState] = nextInt(rngState, 1, 2);
    guardianVariant = v as 1 | 2;
  }
  let gcdsVariant = config.gcdsBlueprintVariant;
  if (gcdsVariant == null) {
    let v: number;
    [v, rngState] = nextInt(rngState, 1, 2);
    gcdsVariant = v as 1 | 2;
  }

  const resolvedConfig: GameConfig = {
    ...config,
    ancientBlueprintVariant: ancientVariant,
    guardianBlueprintVariant: guardianVariant,
    gcdsBlueprintVariant: gcdsVariant,
  };

  // 3. Create sector stacks
  const innerIds = INNER_SECTORS.map((s) => s.id);
  const middleIds = MIDDLE_SECTORS.map((s) => s.id);
  const outerIds = OUTER_SECTORS.map((s) => s.id);

  let shuffledInner: readonly string[];
  [shuffledInner, rngState] = shuffle(rngState, innerIds);
  let shuffledMiddle: readonly string[];
  [shuffledMiddle, rngState] = shuffle(rngState, middleIds);
  let shuffledOuter: readonly string[];
  [shuffledOuter, rngState] = shuffle(rngState, outerIds);

  const outerCount = OUTER_SECTOR_COUNTS[config.playerCount]!;
  shuffledOuter = shuffledOuter.slice(0, outerCount);

  const sectorStacks: SectorStacks = {
    inner: shuffledInner,
    middle: shuffledMiddle,
    outer: shuffledOuter,
  };

  // 4. Create tech tray — draw from a single mixed bag with multiple copies
  // Non-rare techs have NON_RARE_TILE_COUNT copies each, rare techs have 1.
  // Rule: draw tiles one at a time until we hit the target number of NON-RARE tiles.
  // Any rare tiles drawn along the way go to the rare row but don't count toward the target.
  // Drawing a duplicate of something already on tray increments its count (stacking).
  const bag: string[] = [];
  for (const tech of Object.values(TECHS_BY_ID)) {
    const copies = tech.isRare ? RARE_TILE_COUNT : NON_RARE_TILE_COUNT;
    for (let i = 0; i < copies; i++) {
      bag.push(tech.id);
    }
  }
  let shuffledBag: readonly string[];
  [shuffledBag, rngState] = shuffle(rngState, bag);

  const targetNonRare = TECH_SETUP_DRAW[config.playerCount]!;
  const militarySlots = new Map<string, TechTraySlot>();
  const gridSlots = new Map<string, TechTraySlot>();
  const nanoSlots = new Map<string, TechTraySlot>();
  const rareSlots = new Map<string, TechTraySlot>();
  let nonRareDrawn = 0;

  for (const techId of shuffledBag) {
    if (nonRareDrawn >= targetNonRare) break;
    const tech = TECHS_BY_ID[techId]!;

    if (tech.isRare) {
      const existing = rareSlots.get(techId);
      rareSlots.set(techId, { techId, count: (existing?.count ?? 0) + 1 });
    } else {
      nonRareDrawn++;
      const targetMap = tech.category === TechCategory.Military ? militarySlots
        : tech.category === TechCategory.Grid ? gridSlots
        : nanoSlots;
      const existing = targetMap.get(techId);
      targetMap.set(techId, { techId, count: (existing?.count ?? 0) + 1 });
    }
  }

  const techTray: TechTrayState = {
    military: Array.from(militarySlots.values()),
    grid: Array.from(gridSlots.values()),
    nano: Array.from(nanoSlots.values()),
    rare: Array.from(rareSlots.values()),
  };

  // 5. Create discovery deck
  const discoveryDeckIds: string[] = [];
  for (const tile of DISCOVERY_TILES) {
    for (let i = 0; i < tile.count; i++) {
      discoveryDeckIds.push(tile.id);
    }
  }
  let shuffledDiscoveryArr: readonly string[];
  [shuffledDiscoveryArr, rngState] = shuffle(rngState, discoveryDeckIds);
  const discoveryDeck: string[] = [...shuffledDiscoveryArr];

  // 6. Create reputation bag
  const reputationBag = createReputationBag();

  // 7. Assign player colors
  // 8. Create player states
  const players: Record<PlayerId, PlayerState> = {};

  const zeroActions: Readonly<Record<ActionType, number>> = {
    [ActionType.Explore]: 0,
    [ActionType.Research]: 0,
    [ActionType.Upgrade]: 0,
    [ActionType.Build]: 0,
    [ActionType.Move]: 0,
    [ActionType.Influence]: 0,
  };

  for (let i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i]!;
    const speciesId = config.speciesAssignments[playerId]!;
    const species = SPECIES[speciesId]!;
    const color = species.color;

    // Population tracks: all 11 cubes present
    const populationTracks = {
      materials: Array.from({ length: 11 }, () => true) as boolean[],
      science: Array.from({ length: 11 }, () => true) as boolean[],
      money: Array.from({ length: 11 }, () => true) as boolean[],
    };

    // Starting tech tracks
    const techTracks = {
      military: [] as string[],
      grid: [] as string[],
      nano: [] as string[],
    };

    for (const techId of species.startingTechs) {
      const tech = TECHS_BY_ID[techId];
      if (!tech) continue;
      switch (tech.category) {
        case TechCategory.Military:
          techTracks.military.push(techId);
          break;
        case TechCategory.Grid:
          techTracks.grid.push(techId);
          break;
        case TechCategory.Nano:
          techTracks.nano.push(techId);
          break;
      }
    }

    // Create blueprints for all 4 ship types
    const blueprints = {
      [ShipType.Interceptor]: createInitialBlueprint(
        ShipType.Interceptor,
        DEFAULT_BLUEPRINTS[ShipType.Interceptor],
        species.blueprintOverrides[ShipType.Interceptor],
        SHIP_PARTS_BY_ID,
      ),
      [ShipType.Cruiser]: createInitialBlueprint(
        ShipType.Cruiser,
        DEFAULT_BLUEPRINTS[ShipType.Cruiser],
        species.blueprintOverrides[ShipType.Cruiser],
        SHIP_PARTS_BY_ID,
      ),
      [ShipType.Dreadnought]: createInitialBlueprint(
        ShipType.Dreadnought,
        DEFAULT_BLUEPRINTS[ShipType.Dreadnought],
        species.blueprintOverrides[ShipType.Dreadnought],
        SHIP_PARTS_BY_ID,
      ),
      [ShipType.Starbase]: createInitialBlueprint(
        ShipType.Starbase,
        DEFAULT_BLUEPRINTS[ShipType.Starbase],
        species.blueprintOverrides[ShipType.Starbase],
        SHIP_PARTS_BY_ID,
      ),
    };

    // Ship supply = total minus starting fleet
    const shipSupply: Record<ShipType, number> = {
      [ShipType.Interceptor]: SHIP_LIMITS.interceptor,
      [ShipType.Cruiser]: SHIP_LIMITS.cruiser,
      [ShipType.Dreadnought]: SHIP_LIMITS.dreadnought,
      [ShipType.Starbase]: SHIP_LIMITS.starbase,
    };
    for (const fleet of species.startingFleet) {
      shipSupply[fleet.shipType] -= fleet.count;
    }

    // Influence discs: 1 placed on home sector
    const influenceDiscs = {
      total: species.influenceDiscs,
      onTrack: species.influenceDiscs - 1,
      onActions: 0,
      onReactions: 0,
      onSectors: 1,
    };

    const player: PlayerState = {
      id: playerId,
      speciesId,
      color,
      resources: { ...species.startingResources },
      influenceDiscs,
      actionsThisRound: zeroActions,
      reactionsThisRound: {},
      populationTracks,
      graveyard: { materials: 0, science: 0, money: 0 },
      techTracks,
      blueprints,
      reputationTrack: species.reputationSlots.map(slotType => ({ slotType, tile: null })),
      ambassadorsGiven: [],
      ambassadorsReceived: [],
      colonyShips: {
        total: species.colonyShips,
        available: species.colonyShips,
      },
      discoveryTilesKeptForVP: [],
      savedShipParts: [],
      hasPassed: false,
      hasTraitor: false,
      eliminated: false,
      shipSupply,
    };

    players[playerId] = player;
  }

  // 9. Place Galactic Center at (0,0)
  const origin = { q: 0, r: 0 };
  const gcdsShip: ShipOnBoard = {
    id: 'gcds_001',
    type: ShipType.Dreadnought,
    owner: NpcType.GCDS,
    damage: 0,
    isRetreating: false,
    retreatTarget: null,
    entryOrder: 0,
  };

  const gcPlacedSector: PlacedSector = {
    sectorId: GALACTIC_CENTER_SECTOR.id,
    position: origin,
    rotation: 0,
    influenceDisc: null,
    populations: [],
    ships: [gcdsShip],
    structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
    discoveryTile: GALACTIC_CENTER_SECTOR.hasDiscovery ? 'galactic_center_discovery' : null,
    ancients: 1, // GCDS blocks discovery tile until defeated
    hasWarpPortal: false,
  };

  const boardSectors: Record<string, PlacedSector> = {
    [positionToKey(origin)]: gcPlacedSector,
  };

  // 10. Place starting sectors + guardians on ring 2 (middle) starting zones
  //
  // Eclipse board layout (concentric hex rings from center):
  //   Ring 0: Galactic Center (1 hex)
  //   Ring 1: Inner sectors (6 hexes) — empty at start, explored during game
  //   Ring 2: Middle ring (12 hexes) — 6 are "starting zones" for homeworlds/guardians
  //   Ring 3+: Outer ring — explored during game
  //
  // Starting zones are the 6 "corner" positions of ring 2 (those sharing exactly
  // 1 edge with the inner ring), at even indices of hexRingPositions(origin, 2).
  // Corner positions ensure one wormhole edge points directly toward center.
  // Rotation = center-facing edge index, so base wormholes [0,1,3,4] rotate to:
  //   center-facing edge, +1 clockwise, gap, +3, +4, gap
  // giving the physical game pattern: W, W, gap, W, W, gap from center outward.

  const ring2Positions = hexRingPositions(origin, 2);
  const STARTING_ZONES: { position: typeof origin; rotation: number }[] = [
    { position: ring2Positions[0]!,  rotation: 1 }, // zone 0: (-2, 2)
    { position: ring2Positions[2]!,  rotation: 2 }, // zone 1: (0, 2)
    { position: ring2Positions[4]!,  rotation: 3 }, // zone 2: (2, 0)
    { position: ring2Positions[6]!,  rotation: 4 }, // zone 3: (2, -2)
    { position: ring2Positions[8]!,  rotation: 5 }, // zone 4: (0, -2)
    { position: ring2Positions[10]!, rotation: 0 }, // zone 5: (-2, 0)
  ];

  // For fewer than 6 players, spread evenly around the ring
  const ZONE_INDICES_BY_PLAYER_COUNT: Record<number, number[]> = {
    2: [0, 3],          // opposite sides
    3: [0, 2, 4],       // every other
    4: [0, 1, 3, 4],    // two pairs opposite
    5: [0, 1, 2, 3, 4], // leave one gap
    6: [0, 1, 2, 3, 4, 5],
  };

  const playerZoneIndices = ZONE_INDICES_BY_PLAYER_COUNT[playerIds.length]!;
  let shipIdCounter = 0;

  for (let i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i]!;
    const speciesId = config.speciesAssignments[playerId]!;
    const species = SPECIES[speciesId]!;
    const zone = STARTING_ZONES[playerZoneIndices[i]!]!;

    // Find starting sector for this species
    const startingSector = STARTING_SECTORS.find(
      (s) => s.speciesHome === speciesId,
    );
    if (!startingSector) {
      throw new Error(`No starting sector found for species: ${speciesId}`);
    }

    // Place starting fleet ships
    const startingShips: ShipOnBoard[] = [];
    for (const fleet of species.startingFleet) {
      for (let j = 0; j < fleet.count; j++) {
        shipIdCounter++;
        startingShips.push({
          id: `ship_${playerId}_${shipIdCounter}`,
          type: fleet.shipType,
          owner: playerId,
          damage: 0,
          isRetreating: false,
          retreatTarget: null,
          entryOrder: shipIdCounter,
        });
      }
    }

    // Move population cubes from tracks to non-advanced home sector squares
    const player = players[playerId]!;
    const startingPopulations: PlacedPopulation[] = [];
    const popSquareTypeToResource: Record<string, ResourceType> = {
      [PopulationSquareType.Money]: ResourceType.Money,
      [PopulationSquareType.Science]: ResourceType.Science,
      [PopulationSquareType.Materials]: ResourceType.Materials,
    };

    for (let si = 0; si < startingSector.populationSquares.length; si++) {
      const sq = startingSector.populationSquares[si]!;
      if (sq.advanced) continue; // starred squares start empty
      const resource = popSquareTypeToResource[sq.type];
      if (resource == null) continue; // skip Wild (no starting sectors have non-advanced Wild)

      // Remove leftmost cube from the corresponding track
      // (safe to mutate — tracks are plain arrays before state is returned)
      const track = player.populationTracks[resource] as boolean[];
      const cubeIndex = track.indexOf(true);
      if (cubeIndex !== -1) {
        track[cubeIndex] = false;
        startingPopulations.push({ slotIndex: si, sourceTrack: resource });
      }
    }

    // Process special abilities that place cubes on advanced squares at start
    // (e.g. Hydran starts with a cube on their advanced science square)
    for (const ability of species.specialAbilities) {
      if (ability.effectType !== 'starting_advanced_pop') continue;
      const resourceStr = ability.params?.resourceType as string | undefined;
      const count = (ability.params?.count as number | undefined) ?? 1;
      const resource = popSquareTypeToResource[resourceStr ?? ''];
      if (resource == null) continue;

      let placed = 0;
      for (let si = 0; si < startingSector.populationSquares.length && placed < count; si++) {
        const sq = startingSector.populationSquares[si]!;
        if (!sq.advanced) continue;
        if (popSquareTypeToResource[sq.type] !== resource && sq.type !== PopulationSquareType.Wild) continue;
        if (startingPopulations.some(p => p.slotIndex === si)) continue; // already occupied

        const track = player.populationTracks[resource] as boolean[];
        const cubeIndex = track.indexOf(true);
        if (cubeIndex !== -1) {
          track[cubeIndex] = false;
          startingPopulations.push({ slotIndex: si, sourceTrack: resource });
          placed++;
        }
      }
    }

    const placedSector: PlacedSector = {
      sectorId: startingSector.id,
      position: zone.position,
      rotation: zone.rotation,
      influenceDisc: playerId,
      populations: startingPopulations,
      ships: startingShips,
      structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
      discoveryTile: null,
      ancients: 0,
      hasWarpPortal: false,
    };

    boardSectors[positionToKey(zone.position)] = placedSector;
  }

  // 10b. Place guardian sectors in unused starting zones
  const usedZoneIndices = new Set(playerZoneIndices);
  const unusedZones = STARTING_ZONES.filter((_, i) => !usedZoneIndices.has(i));

  // Shuffle guardian sectors and take as many as needed
  let shuffledGuardians: readonly string[];
  [shuffledGuardians, rngState] = shuffle(
    rngState,
    GUARDIAN_SECTORS.map((s) => s.id),
  );
  const guardiansToPlace = shuffledGuardians.slice(0, unusedZones.length);

  for (let i = 0; i < guardiansToPlace.length; i++) {
    const zone = unusedZones[i]!;
    const guardianSectorId = guardiansToPlace[i]!;

    // Each guardian sector gets one guardian ship
    shipIdCounter++;
    const guardianShip: ShipOnBoard = {
      id: `guardian_${positionToKey(zone.position)}`,
      type: ShipType.Cruiser,
      owner: NpcType.Guardian,
      damage: 0,
      isRetreating: false,
      retreatTarget: null,
      entryOrder: shipIdCounter,
    };

    // Draw discovery tile from deck if sector has one
    const guardianDef = SECTORS_BY_ID[guardianSectorId];
    let guardianDiscovery: string | null = null;
    if (guardianDef?.hasDiscovery && discoveryDeck.length > 0) {
      let discIndex: number;
      [discIndex, rngState] = nextInt(rngState, 0, discoveryDeck.length - 1);
      guardianDiscovery = discoveryDeck[discIndex]!;
      discoveryDeck.splice(discIndex, 1);
    }

    const guardianPlaced: PlacedSector = {
      sectorId: guardianSectorId,
      position: zone.position,
      rotation: zone.rotation,
      influenceDisc: null,
      populations: [],
      ships: [guardianShip],
      structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
      discoveryTile: guardianDiscovery,
      ancients: 1, // Guardian blocks discovery tile until defeated
      hasWarpPortal: false,
    };

    boardSectors[positionToKey(zone.position)] = guardianPlaced;
  }

  const board: BoardState = {
    sectors: boardSectors,
    emptyZones: [],
  };

  // 11. Determine turn order — sort by species baseInitiativeOrder ascending
  const sortedPlayerIds = [...playerIds].sort((a, b) => {
    const specA = SPECIES[config.speciesAssignments[a]!]!;
    const specB = SPECIES[config.speciesAssignments[b]!]!;
    return specA.baseInitiativeOrder - specB.baseInitiativeOrder;
  });

  // 12. Log GAME_CREATED event
  const gameCreatedEvent = createEvent('GAME_CREATED', {
    config: resolvedConfig,
    timestamp: Date.now(),
  });

  // 12b. Eridani setup: draw 2 reputation tiles
  let finalRepBag = reputationBag;
  let finalRng = rngState;
  for (const pid of playerIds) {
    const species = SPECIES[config.speciesAssignments[pid]!]!;
    const hasSetupDraw = species.specialAbilities.some(
      (a) => a.effectType === 'setup_draw_reputation',
    );
    if (!hasSetupDraw) continue;
    const drawCount = (species.specialAbilities.find(
      (a) => a.effectType === 'setup_draw_reputation',
    )!.params?.count as number) ?? 2;

    const [drawn, remaining, newRng] = drawFromBag(finalRng, finalRepBag, drawCount);
    finalRng = newRng;
    finalRepBag = remaining;

    const player = players[pid]!;
    // Place drawn tiles into first empty shared slots
    const newTrack = [...player.reputationTrack];
    let placed = 0;
    for (let si = 0; si < newTrack.length && placed < drawn.length; si++) {
      if (newTrack[si]!.tile === null && newTrack[si]!.slotType !== 'ambassador') {
        newTrack[si] = { ...newTrack[si]!, tile: { value: drawn[placed]!, fromAmbassador: false } };
        placed++;
      }
    }
    players[pid] = {
      ...player,
      reputationTrack: newTrack,
    };
  }

  const state: GameState = {
    gameId: `game_${config.seed}`,
    config: resolvedConfig,
    rngState: finalRng,
    phase: PhaseType.Action,
    round: 1,
    subPhase: null,
    turnOrder: sortedPlayerIds,
    currentPlayerIndex: 0,
    passOrder: [],
    actionPhaseComplete: false,
    players,
    board,
    techTray,
    upgradeTray: [],
    discoveryDeck,
    discoveryDiscard: [],
    reputationBag: finalRepBag,
    sectorStacks,
    sectorDiscards: { inner: [], middle: [], outer: [] },
    traitorHolder: null,
    startPlayer: sortedPlayerIds[0]!,
    eventLog: appendEvent([], gameCreatedEvent),
    turnNumber: 1,
    combatState: null,
  };

  return state;
}

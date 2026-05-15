import type {
  GameConfig,
  PhaseType,
  ResourceType,
  SubPhase,
  PlayerId,
  PlayerState,
  TechTrayState,
  GameEvent,
  PlacedSector,
  HexCoord,
  CombatState,
} from '@eclipse/engine';

/**
 * FilteredGameState: the per-player view of the game.
 * Hidden information (opponent reputation values, discovery tile IDs,
 * deck contents, RNG state) is redacted.
 */
export interface FilteredGameState {
  // Public game state
  readonly gameId: string;
  readonly config: GameConfig;
  readonly phase: PhaseType;
  readonly round: number;
  readonly subPhase: SubPhase | null;
  readonly turnOrder: readonly PlayerId[];
  readonly currentPlayerIndex: number;
  readonly passOrder: readonly PlayerId[];
  readonly actionPhaseComplete: boolean;
  readonly turnNumber: number;
  readonly traitorHolder: PlayerId | null;
  readonly startPlayer: PlayerId;

  // Your own FULL state (unredacted)
  readonly you: PlayerState;

  // Opponents (redacted)
  readonly opponents: Readonly<Record<PlayerId, FilteredPlayerState>>;

  // Board with masked discovery tiles
  readonly board: FilteredBoardState;

  // Fully public
  readonly techTray: TechTrayState;
  readonly upgradeTray: readonly string[];

  // Sizes only (no contents)
  readonly discoveryDeckSize: number;
  readonly reputationBagSize: number;
  readonly sectorStackSizes: {
    readonly inner: number;
    readonly middle: number;
    readonly outer: number;
  };

  // Combat state (fully public, no hidden info)
  readonly combatState: CombatState | null;

  // Filtered event log (reputation values redacted for opponents)
  readonly recentEvents: readonly GameEvent[];
}

/**
 * FilteredPlayerState: what you can see about an opponent.
 * Reputation tile values and discovery tile IDs are hidden.
 */
export interface FilteredPlayerState {
  // All the public fields from PlayerState
  readonly id: PlayerId;
  readonly speciesId: string;
  readonly color: string;
  readonly resources: { readonly money: number; readonly science: number; readonly materials: number };
  readonly influenceDiscs: {
    readonly total: number;
    readonly onTrack: number;
    readonly onActions: number;
    readonly onReactions: number;
    readonly onSectors: number;
  };
  readonly actionsThisRound: Readonly<Record<string, number>>;
  readonly reactionsThisRound: Readonly<Record<string, boolean>>;
  readonly populationTracks: {
    readonly materials: readonly boolean[];
    readonly science: readonly boolean[];
    readonly money: readonly boolean[];
  };
  readonly graveyard: { readonly materials: number; readonly science: number; readonly money: number };
  readonly techTracks: {
    readonly military: readonly string[];
    readonly grid: readonly string[];
    readonly nano: readonly string[];
  };
  readonly blueprints: PlayerState['blueprints'];
  readonly ambassadorsGiven: readonly { readonly playerId: PlayerId; readonly cubeTrack: ResourceType }[];
  readonly ambassadorsReceived: readonly { readonly playerId: PlayerId; readonly cubeTrack: ResourceType }[];
  readonly colonyShips: { readonly total: number; readonly available: number };
  readonly hasPassed: boolean;
  readonly hasTraitor: boolean;
  readonly eliminated: boolean;
  readonly shipSupply: Readonly<Record<string, number>>;
  readonly savedShipParts: readonly string[];

  // Redacted fields — counts only, no values
  readonly reputationTileCount: number;
  readonly discoveryTilesKeptCount: number;
}

/**
 * Filtered board state: discovery tiles are hidden (null).
 */
export interface FilteredBoardState {
  readonly sectors: Readonly<Record<string, FilteredPlacedSector>>;
  readonly emptyZones: readonly HexCoord[];
}

/**
 * FilteredPlacedSector: like PlacedSector but discovery tile is always null.
 * Only a boolean indicator of whether an unclaimed discovery exists.
 */
export interface FilteredPlacedSector {
  readonly sectorId: string;
  readonly position: HexCoord;
  readonly rotation: number;
  readonly influenceDisc: PlayerId | null;
  readonly populations: PlacedSector['populations'];
  readonly ships: PlacedSector['ships'];
  readonly structures: PlacedSector['structures'];
  readonly discoveryTile: null;
  readonly hasUnclaimedDiscovery: boolean;
  readonly ancients: number;
  readonly hasWarpPortal: boolean;
}

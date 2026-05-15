import type {
  ActionType,
  DieColor,
  NpcType,
  PhaseType,
  PlayerColor,
  ReputationSlotType,
  ResourceType,
  RingType,
  ShipType,
  SpeciesId,
} from '@data/enums';
import type { HexCoord, Resources } from '@data/types/common';

// Identifiers
export type PlayerId = string;
export type ShipId = string;
export type SectorKey = string; // "q,r" format

// Top-level game state
export interface GameState {
  readonly gameId: string;
  readonly config: GameConfig;
  readonly rngState: RngState;
  readonly phase: PhaseType;
  readonly round: number; // 1-8
  readonly subPhase: SubPhase | null;
  readonly turnOrder: readonly PlayerId[];
  readonly currentPlayerIndex: number;
  readonly passOrder: readonly PlayerId[];
  readonly actionPhaseComplete: boolean;
  readonly players: Readonly<Record<PlayerId, PlayerState>>;
  readonly board: BoardState;
  readonly techTray: TechTrayState;
  readonly upgradeTray: readonly string[]; // ShipPartId[]
  readonly discoveryDeck: readonly string[];
  readonly discoveryDiscard: readonly string[];
  readonly reputationBag: readonly number[];
  readonly sectorStacks: SectorStacks;
  readonly sectorDiscards: SectorStacks;
  readonly traitorHolder: PlayerId | null;
  readonly startPlayer: PlayerId;
  readonly eventLog: readonly GameEvent[];
  readonly turnNumber: number;
  readonly combatState: CombatState | null;
}

export interface GameConfig {
  readonly playerCount: number; // 2-6
  readonly speciesAssignments: Readonly<Record<PlayerId, SpeciesId>>;
  readonly seed: number;
  readonly useWarpPortals: boolean;
  readonly manualDamageAssignment?: boolean;
  readonly ancientBlueprintVariant?: 1 | 2;
  readonly guardianBlueprintVariant?: 1 | 2;
  readonly gcdsBlueprintVariant?: 1 | 2;
}

export interface RngState {
  readonly seed: number;
  readonly callCount: number;
}

// Sub-phase discriminated union for multi-step combat/resolution
export type SubPhase =
  | {
      readonly type: 'DAMAGE_ASSIGNMENT';
      readonly playerId: PlayerId;
      readonly sectorKey: SectorKey;
      readonly hits: readonly {
        readonly dieColor: string;
        readonly faceIndex: number;
        readonly faceValue: number;
        readonly isBurst: boolean;
        readonly isMiss: boolean;
        readonly damage: number;
      }[];
      readonly targetShips: readonly {
        readonly shipId: string;
        readonly shipType: string;
        readonly damage: number;
        readonly hullValue: number;
      }[];
      readonly attackerOwner: string;
      readonly isMissile: boolean;
    }
  | {
      readonly type: 'REPUTATION_SELECTION';
      readonly playerId: PlayerId;
      readonly drawn: readonly number[];
    }
  | { readonly type: 'COLONY_SHIP_PLACEMENT'; readonly playerId: PlayerId; readonly offeredPlayerIds: readonly PlayerId[] }
  | { readonly type: 'BANKRUPTCY_RESOLUTION'; readonly playerId: PlayerId }
  | {
      readonly type: 'DISCOVERY_DECISION';
      readonly playerId: PlayerId;
      readonly tileId: string;
      readonly sectorKey: string;
      readonly exploreSectorKeys?: readonly string[];
      readonly fromTech?: boolean;
    }
  | { readonly type: 'COMBAT_STEP' }
  | {
      readonly type: 'MOVE_CONTINUATION';
      readonly playerId: PlayerId;
      readonly activationsUsed: number;
      readonly maxActivations: number;
    }
  | {
      readonly type: 'EXPLORE_TILE_CHOICE';
      readonly playerId: PlayerId;
      readonly targetPosition: HexCoord;
      readonly ring: RingType;
      readonly drawnTiles: readonly [string, string];
    }
  | {
      readonly type: 'INFLUENCE_SECTOR_CHOICE';
      readonly playerId: PlayerId;
      readonly eligibleSectors: readonly string[];
      readonly offeredPlayerIds: readonly PlayerId[];
    }
  | {
      readonly type: 'DIPLOMACY_RESPONSE';
      readonly playerId: PlayerId;
      readonly initiatorId: PlayerId;
      readonly initiatorSourceTrack: ResourceType;
    }
  | {
      readonly type: 'BOMBARDMENT_CHOICE';
      readonly playerId: PlayerId;
      readonly sectorKey: string;
      readonly totalDamage: number;
      readonly rolls: readonly {
        readonly dieColor: DieColor;
        readonly faceValue: number;
        readonly isHit: boolean;
      }[];
      readonly hasOrbitalPop: boolean;
      readonly orbitalTrack: ResourceType | null;
      readonly isNonBattle?: boolean;
      readonly skipSectors?: readonly string[];
    }
  | {
      readonly type: 'WARP_PORTAL_CHOICE';
      readonly playerId: PlayerId;
      readonly eligibleSectors: readonly string[];
    }
  | {
      readonly type: 'ARTIFACT_RESOURCE_CHOICE';
      readonly playerId: PlayerId;
      readonly totalResources: number;
      readonly increment: number;
    }
  | {
      readonly type: 'RETREAT_DECISION';
      readonly playerId: PlayerId;
      readonly sectorKey: string;
      readonly validTargets: readonly HexCoord[];
      readonly playerShips: readonly {
        readonly shipId: string;
        readonly shipType: string;
        readonly damage: number;
        readonly hullValue: number;
      }[];
    }
  | {
      readonly type: 'POPULATION_GRAVEYARD_CHOICE';
      readonly playerId: PlayerId;
      readonly sectorKey: string;
      readonly attackerId: PlayerId;
      readonly choices: readonly {
        readonly source: 'orbital' | 'wild';
        readonly validTracks: readonly ResourceType[];
      }[];
      readonly isNonBattle?: boolean;
      readonly skipSectors?: readonly string[];
    };

// Player state
export interface PlayerState {
  readonly id: PlayerId;
  readonly speciesId: SpeciesId;
  readonly color: PlayerColor;
  readonly resources: Resources;
  readonly influenceDiscs: InfluenceDiscState;
  readonly actionsThisRound: Readonly<Record<ActionType, number>>;
  readonly reactionsThisRound: Readonly<Record<string, boolean>>;
  readonly populationTracks: PopulationTracks;
  readonly graveyard: Graveyard;
  readonly techTracks: TechTracks;
  readonly blueprints: Readonly<Record<ShipType, BlueprintState>>;
  readonly reputationTrack: readonly ReputationSlot[];
  readonly ambassadorsGiven: readonly { readonly playerId: PlayerId; readonly cubeTrack: ResourceType }[];
  readonly ambassadorsReceived: readonly { readonly playerId: PlayerId; readonly cubeTrack: ResourceType }[];
  readonly colonyShips: ColonyShipState;
  readonly discoveryTilesKeptForVP: readonly string[];
  readonly savedShipParts: readonly string[];
  readonly hasPassed: boolean;
  readonly hasTraitor: boolean;
  readonly eliminated: boolean;
  readonly shipSupply: Readonly<Record<ShipType, number>>;
}

export interface InfluenceDiscState {
  readonly total: number;
  readonly onTrack: number;
  readonly onActions: number;
  readonly onReactions: number;
  readonly onSectors: number;
}

export interface PopulationTracks {
  readonly materials: readonly boolean[]; // true = cube present
  readonly science: readonly boolean[];
  readonly money: readonly boolean[];
}

export interface Graveyard {
  readonly materials: number;
  readonly science: number;
  readonly money: number;
}

export interface TechTracks {
  readonly military: readonly string[];
  readonly grid: readonly string[];
  readonly nano: readonly string[];
}

export interface BlueprintState {
  readonly shipType: ShipType;
  readonly grid: readonly (readonly (string | null)[])[]; // 2D grid of part IDs
  readonly fixedParts: readonly string[];
  readonly computed: ComputedBlueprintStats;
}

export interface ComputedBlueprintStats {
  readonly initiative: number;
  readonly movement: number;
  readonly hullValue: number;
  readonly shieldValue: number;
  readonly computerValue: number;
  readonly energyProduction: number;
  readonly energyConsumption: number;
  readonly energyBalance: number;
  readonly weapons: readonly WeaponSummary[];
  readonly missiles: readonly WeaponSummary[];
}

export interface WeaponSummary {
  readonly dieColor: DieColor;
  readonly dieCount: number;
  readonly damage: number;
}

export interface ReputationTileContents {
  readonly value: number;
  readonly fromAmbassador: boolean;
}

export interface ReputationSlot {
  readonly slotType: ReputationSlotType;
  readonly tile: ReputationTileContents | null;
}

export interface ColonyShipState {
  readonly total: number;
  readonly available: number; // faceup
}

// Board
export interface BoardState {
  readonly sectors: Readonly<Record<SectorKey, PlacedSector>>;
  readonly emptyZones: readonly HexCoord[];
}

export interface PlacedSector {
  readonly sectorId: string;
  readonly position: HexCoord;
  readonly rotation: number; // 0-5
  readonly influenceDisc: PlayerId | null;
  readonly populations: readonly PlacedPopulation[];
  readonly ships: readonly ShipOnBoard[];
  readonly structures: SectorStructures;
  readonly discoveryTile: string | null;
  readonly ancients: number;
  readonly hasWarpPortal: boolean;
}

export interface PlacedPopulation {
  readonly slotIndex: number;
  readonly sourceTrack: ResourceType;
}

export interface ShipOnBoard {
  readonly id: ShipId;
  readonly type: ShipType;
  readonly owner: PlayerId | NpcType;
  readonly damage: number;
  readonly isRetreating: boolean;
  readonly retreatTarget: HexCoord | null;
  readonly entryOrder: number;
}

export interface SectorStructures {
  readonly hasOrbital: boolean;
  readonly orbitalPopulation: { readonly track: ResourceType } | null;
  readonly hasMonolith: boolean;
}

// Tech tray
export interface TechTraySlot {
  readonly techId: string;
  readonly count: number;
}

export interface TechTrayState {
  readonly military: readonly TechTraySlot[];
  readonly grid: readonly TechTraySlot[];
  readonly nano: readonly TechTraySlot[];
  readonly rare: readonly TechTraySlot[];
}

// Sector stacks
export interface SectorStacks {
  readonly inner: readonly string[];
  readonly middle: readonly string[];
  readonly outer: readonly string[];
}

// Events
export type GameEvent =
  | {
      readonly type: 'GAME_CREATED';
      readonly config: GameConfig;
      readonly timestamp: number;
    }
  | {
      readonly type: 'ACTION_TAKEN';
      readonly playerId: PlayerId;
      readonly action: GameAction;
      readonly turnNumber: number;
    }
  | {
      readonly type: 'SECTOR_EXPLORED';
      readonly playerId: PlayerId;
      readonly sectorId: string;
      readonly position: HexCoord;
      readonly placed: boolean;
    }
  | {
      readonly type: 'TECH_RESEARCHED';
      readonly playerId: PlayerId;
      readonly techId: string;
      readonly cost: number;
    }
  | {
      readonly type: 'SHIP_BUILT';
      readonly playerId: PlayerId;
      readonly shipType: ShipType;
      readonly sector: HexCoord;
    }
  | {
      readonly type: 'SHIP_MOVED';
      readonly playerId: PlayerId;
      readonly shipId: string;
      readonly from: HexCoord;
      readonly to: HexCoord;
    }
  | {
      readonly type: 'SHIP_DESTROYED';
      readonly shipId: string;
      readonly owner: PlayerId | NpcType;
      readonly destroyedBy: PlayerId;
    }
  | {
      readonly type: 'BATTLE_STARTED';
      readonly sector: HexCoord;
      readonly participants: readonly (PlayerId | NpcType)[];
    }
  | {
      readonly type: 'DICE_ROLLED';
      readonly roller: PlayerId | NpcType;
      readonly shipType: ShipType;
      readonly dice: readonly DiceResult[];
      readonly purpose: string;
    }
  | {
      readonly type: 'DAMAGE_DEALT';
      readonly targetShipId: string;
      readonly damage: number;
      readonly source: string;
    }
  | {
      readonly type: 'RETREAT';
      readonly playerId: PlayerId;
      readonly shipType: ShipType;
      readonly from: HexCoord;
      readonly to: HexCoord;
    }
  | {
      readonly type: 'REPUTATION_DRAWN';
      readonly playerId: PlayerId;
      readonly drawn: readonly number[];
      readonly kept: number | null;
    }
  | {
      readonly type: 'POPULATION_DESTROYED';
      readonly sector: HexCoord;
      readonly track: ResourceType;
      readonly destroyedBy: PlayerId;
    }
  | {
      readonly type: 'INFLUENCE_PLACED';
      readonly playerId: PlayerId;
      readonly sector: HexCoord;
    }
  | {
      readonly type: 'INFLUENCE_REMOVED';
      readonly playerId: PlayerId;
      readonly sector: HexCoord;
    }
  | {
      readonly type: 'DISCOVERY_CLAIMED';
      readonly playerId: PlayerId;
      readonly tileId: string;
      readonly decision: 'USE_REWARD' | 'KEEP_VP';
    }
  | {
      readonly type: 'DIPLOMACY_PROPOSED';
      readonly initiator: PlayerId;
      readonly target: PlayerId;
    }
  | {
      readonly type: 'DIPLOMACY_FORMED';
      readonly player1: PlayerId;
      readonly player2: PlayerId;
    }
  | {
      readonly type: 'DIPLOMACY_DECLINED';
      readonly initiator: PlayerId;
      readonly target: PlayerId;
    }
  | {
      readonly type: 'DIPLOMACY_BROKEN';
      readonly aggressor: PlayerId;
      readonly victim: PlayerId;
    }
  | {
      readonly type: 'PLAYER_PASSED';
      readonly playerId: PlayerId;
      readonly isFirst: boolean;
    }
  | {
      readonly type: 'PHASE_CHANGED';
      readonly from: PhaseType;
      readonly to: PhaseType;
      readonly round: number;
    }
  | { readonly type: 'PLAYER_ELIMINATED'; readonly playerId: PlayerId }
  | { readonly type: 'GAME_ENDED'; readonly scores: readonly unknown[] }
  | {
      readonly type: 'UPKEEP_PAID';
      readonly playerId: PlayerId;
      readonly income: number;
      readonly upkeep: number;
      readonly net: number;
    }
  | {
      readonly type: 'PRODUCTION';
      readonly playerId: PlayerId;
      readonly materials: number;
      readonly science: number;
    }
  | {
      readonly type: 'COLONY_SHIP_USED';
      readonly playerId: PlayerId;
      readonly sector: HexCoord;
      readonly track: ResourceType;
    }
  | {
      readonly type: 'BLUEPRINT_UPGRADED';
      readonly playerId: PlayerId;
      readonly shipType: ShipType;
      readonly added: string | null;
      readonly removed: readonly string[];
    }
  | {
      readonly type: 'INSTANT_EFFECT';
      readonly playerId: PlayerId;
      readonly techId: string;
      readonly effectType: string;
      readonly description: string;
    }
  | {
      readonly type: 'BANKRUPTCY_TRADE';
      readonly playerId: PlayerId;
      readonly fromResource: ResourceType;
      readonly amount: number;
      readonly moneyGained: number;
    };

export interface DiceResult {
  readonly color: DieColor;
  readonly face: number;
  readonly isHit: boolean;
}

// ── Action Activation Types ──

export interface ExploreActivation {
  readonly targetPosition: HexCoord;
  readonly decision: 'PLACE' | 'DISCARD';
  readonly rotation?: number; // 0-5, required if PLACE
  readonly takeInfluence?: boolean;
}

export interface ResearchActivation {
  readonly techId: string;
  readonly trackChoice?: 'military' | 'grid' | 'nano'; // required for rare techs
}

export interface UpgradeActivation {
  readonly shipType: ShipType;
  readonly slotIndex: number; // index in grid row
  readonly partId: string | null; // null = remove only
}

export interface BuildActivation {
  readonly buildType: ShipType | 'ORBITAL' | 'MONOLITH';
  readonly sectorPosition: HexCoord;
}

export interface MoveActivation {
  readonly shipId: ShipId;
  readonly path: readonly HexCoord[];
}

export interface ReturnTrackOverride {
  readonly slotIndex: number; // -1 for orbital
  readonly track: ResourceType;
}

export interface InfluenceActivation {
  readonly from: 'INFLUENCE_TRACK' | HexCoord;
  readonly to: 'INFLUENCE_TRACK' | HexCoord;
  readonly returnTrackOverrides?: readonly ReturnTrackOverride[];
}

export interface ColonyShipUsage {
  readonly sourceTrack: ResourceType;
  readonly targetSector: HexCoord;
  readonly targetSlotIndex: number;
}

// ── Action Interfaces ──

export type GameAction =
  | ExploreAction
  | ExploreChoiceAction
  | ResearchAction
  | UpgradeAction
  | BuildAction
  | MoveAction
  | InfluenceAction
  | PassAction
  | ReactionAction
  | ColonyShipAction
  | DiplomacyAction
  | TradeAction
  | CombatStepAction
  | DiscoveryDecisionAction
  | MoveFinishAction
  | InfluenceSectorChoiceAction
  | BankruptcyResolutionAction
  | DiplomacyResponseAction
  | BombardmentChoiceAction
  | WarpPortalChoiceAction
  | ArtifactResourceChoiceAction
  | RetreatDecisionAction
  | PopulationGraveyardChoiceAction
  | ReputationSelectionAction
  | DamageAssignmentAction;

export interface ExploreAction {
  readonly type: 'EXPLORE';
  readonly activations: readonly ExploreActivation[];
}

export interface ExploreChoiceAction {
  readonly type: 'EXPLORE_CHOICE';
  readonly chosenTileIndex: 0 | 1;
  readonly decision: 'PLACE' | 'DISCARD';
  readonly rotation?: number;
  readonly takeInfluence?: boolean;
}

export interface ResearchAction {
  readonly type: 'RESEARCH';
  readonly activations: readonly ResearchActivation[];
}

export interface UpgradeAction {
  readonly type: 'UPGRADE';
  readonly activations: readonly UpgradeActivation[];
}

export interface BuildAction {
  readonly type: 'BUILD';
  readonly activations: readonly BuildActivation[];
}

export interface MoveAction {
  readonly type: 'MOVE';
  readonly activations: readonly MoveActivation[];
}

export interface InfluenceAction {
  readonly type: 'INFLUENCE';
  readonly activations: readonly InfluenceActivation[];
  readonly colonyShipFlips: number;
}

export interface PassAction {
  readonly type: 'PASS';
}

export interface ReactionAction {
  readonly type: 'REACTION';
  readonly reactionType: 'UPGRADE' | 'BUILD' | 'MOVE';
  readonly activation: UpgradeActivation | BuildActivation | MoveActivation;
}

export interface ColonyShipAction {
  readonly type: 'COLONY_SHIP';
  readonly usages: readonly ColonyShipUsage[];
}

export interface DiplomacyAction {
  readonly type: 'DIPLOMACY';
  readonly targetPlayerId: PlayerId;
  readonly sourceTrack: ResourceType;
}

export interface DiplomacyResponseAction {
  readonly type: 'DIPLOMACY_RESPONSE';
  readonly accept: boolean;
  readonly sourceTrack?: ResourceType; // required when accept=true
}

export interface TradeAction {
  readonly type: 'TRADE';
  readonly fromResource: ResourceType;
  readonly toResource: ResourceType;
  readonly amount: number;
}

export interface CombatStepAction {
  readonly type: 'COMBAT_STEP';
}

export interface DiscoveryDecisionAction {
  readonly type: 'DISCOVERY_DECISION';
  readonly decision: 'USE_REWARD' | 'KEEP_VP';
  readonly techId?: string;           // AncientTech
  readonly targetShipType?: ShipType;  // AncientShipPart: which ship
  readonly slotIndex?: number;         // AncientShipPart: which slot (omitted for muon_source)
  readonly saveForLater?: boolean;     // AncientShipPart: save for future upgrade
}

export interface MoveFinishAction {
  readonly type: 'MOVE_FINISH';
}

export interface InfluenceSectorChoiceAction {
  readonly type: 'INFLUENCE_SECTOR_CHOICE';
  readonly sectorKeys: readonly string[]; // subset of eligible sectors to claim
}

export interface BankruptcyResolutionAction {
  readonly type: 'BANKRUPTCY_RESOLUTION';
  readonly abandonedSectors: readonly string[]; // sector keys to abandon
  readonly returnTrackOverrides?: Readonly<Record<string, readonly ReturnTrackOverride[]>>;
  readonly trades?: readonly { readonly fromResource: ResourceType; readonly amount: number }[];
}

export interface BombardmentChoiceAction {
  readonly type: 'BOMBARDMENT_CHOICE';
  readonly cubesToDestroy: readonly ResourceType[];
  readonly destroyOrbital: boolean;
}

export interface WarpPortalChoiceAction {
  readonly type: 'WARP_PORTAL_CHOICE';
  readonly sectorKey: string;
}

export interface ArtifactResourceChoiceAction {
  readonly type: 'ARTIFACT_RESOURCE_CHOICE';
  readonly money: number;
  readonly materials: number;
  readonly science: number;
}

export interface RetreatDecisionAction {
  readonly type: 'RETREAT_DECISION';
  readonly retreatingShipIds: readonly string[];  // empty = continue fighting
  readonly retreatTarget: HexCoord | null;        // required when shipIds non-empty
}

export interface PopulationGraveyardChoiceAction {
  readonly type: 'POPULATION_GRAVEYARD_CHOICE';
  readonly assignments: readonly ResourceType[];  // one per choice, matched by index
}

export interface ReputationSelectionAction {
  readonly type: 'REPUTATION_SELECTION';
  readonly keptIndex: number | null;        // index into drawn[], null = decline all
  readonly targetSlotIndex: number | null;  // slot to place tile into (allows swap)
}

export interface DamageAssignmentAction {
  readonly type: 'DAMAGE_ASSIGNMENT';
  readonly assignments: readonly {
    readonly targetShipId: string;
    readonly hitIndices: readonly number[];
  }[];
}

// ── Combat State ──

export interface CombatState {
  readonly battles: readonly CombatBattleSetup[];
  readonly currentBattleIndex: number;
  readonly step: CombatStepPhase;
  readonly pairs: readonly CombatPair[];
  readonly currentPairIndex: number;
  readonly engagementRound: number;
  readonly unitIndex: number;
  readonly pendingMissileAssignments: readonly PendingMissileAssignment[];
  readonly initialAttackerShipIds: readonly string[];
  readonly initialDefenderShipIds: readonly string[];
  readonly initialAttackerShips: readonly ShipOnBoard[];
  readonly initialDefenderShips: readonly ShipOnBoard[];
  // Actor info: describes who fires next (set when entering firing states, null for AWAITING_START/POST_BATTLE)
  readonly currentActorOwner: string | null;
  readonly currentActorShipType: string | null;
  readonly currentTargetOwner: string | null;
  readonly bombardmentDone: boolean;
  readonly retreatDecisionOfferedTo: readonly string[];  // playerIds offered this round
  readonly retreatDeclaredInRound: number | null;         // engagement round when retreat was declared (null = no retreat)
  readonly retreatedPlayerIds: readonly PlayerId[];       // players who retreated ALL remaining ships (lose participation draw)
  readonly reputationProcessedPlayers: readonly PlayerId[];
}

export interface CombatBattleSetup {
  readonly sectorKey: string;
  readonly participants: readonly (PlayerId | NpcType)[];
}

export interface CombatPair {
  readonly attacker: PlayerId | NpcType;
  readonly defender: PlayerId | NpcType;
}

export interface PendingMissileAssignment {
  readonly owner: PlayerId | NpcType;
  readonly assignments: readonly {
    readonly targetShipId: string;
    readonly totalDamage: number;
  }[];
}

export type CombatStepPhase =
  | 'AWAITING_START'
  | 'MISSILE_FIRE'
  | 'ENGAGEMENT_FIRE'
  | 'BATTLE_RESULT'
  | 'POST_BATTLE'
  | 'ALL_COMPLETE';

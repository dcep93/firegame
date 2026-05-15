// Protocol types
export type { ClientMessage, ServerMessage, ErrorCode, RoomListEntry } from './protocol';

// Filtered state types
export type {
  FilteredGameState,
  FilteredPlayerState,
  FilteredBoardState,
  FilteredPlacedSector,
} from './filtered-state';

// Room types
export type { RoomPlayer, RoomConfig, RoomStatus } from './room-types';
export { DEFAULT_ROOM_CONFIG } from './room-types';

// Constants
export {
  HEARTBEAT_INTERVAL_MS,
  HEARTBEAT_TIMEOUT_MS,
  RECONNECT_WINDOW_MS,
  MAX_NICKNAME_LENGTH,
  MAX_CHAT_LENGTH,
  ROOM_CODE_LENGTH,
  ROOM_CODE_CHARS,
  SESSION_TOKEN_LENGTH,
  URL_TOKEN_LENGTH,
  SNAPSHOT_INTERVAL_TURNS,
  TIMER_BROADCAST_INTERVAL_MS,
  MAX_RECONNECTS_PER_MINUTE,
  SESSION_TTL_MS,
  RECONNECT_BACKOFF_BASE_MS,
  RECONNECT_BACKOFF_MAX_MS,
  LOBBY_TTL_MS,
  GAME_INACTIVITY_TTL_MS,
} from './constants';

// Runtime validation
export { parseClientMessage } from './validation';

// Re-export engine types needed by the web client
// (so web never imports @eclipse/engine directly)
export type {
  GameAction,
  GameEvent,
  GameConfig,
  PlayerId,
  LegalActions,
  ScoreBreakdown,
  PlayerState,
  ExploreAction,
  ExploreActivation,
  ExploreChoiceAction,
  ResearchAction,
  ResearchActivation,
  UpgradeActivation,
  BuildActivation,
  MoveActivation,
  InfluenceActivation,
  ReturnTrackOverride,
  ColonyShipAction,
  ColonyShipUsage,
  HexCoord,
  PhaseType,
  SubPhase,
} from '@eclipse/engine';

// Re-export enums as values (not just types) for UI components
export { SpeciesId, ReputationSlotType, ResourceType, ShipType } from '@eclipse/engine';

// Tech definitions for tech tray UI
export type { TechDefinition } from '@eclipse/engine';
export type { TechTrayState, TechTraySlot } from '@eclipse/engine';
export { TechCategory, TECHS_BY_ID, MILITARY_TECHS, GRID_TECHS, NANO_TECHS, RARE_TECHS } from '@eclipse/engine';

// NPC definitions for blueprint display UI
export type { NpcDefinition, NpcBlueprintVariant, NpcWeapon } from '@eclipse/engine';
export { NpcType, DieColor, NPC_DEFINITIONS } from '@eclipse/engine';

// Sector definitions for board tile rendering
export type { SectorDefinition, PopulationSquare, WormholeConfig } from '@eclipse/engine';
export { WormholeEdge, PopulationSquareType, SECTORS_BY_ID } from '@eclipse/engine';

// Production / upkeep track constants for economy display
export {
  MATERIALS_PRODUCTION_TRACK,
  SCIENCE_PRODUCTION_TRACK,
  MONEY_PRODUCTION_TRACK,
  INFLUENCE_UPKEEP_TRACK,
} from '@eclipse/engine';

// Species definitions for player board identity
export type { SpeciesDefinition } from '@eclipse/engine';
export { SPECIES } from '@eclipse/engine';

// Ship part definitions for blueprint display
export type { ShipPartDefinition, WeaponProfile } from '@eclipse/engine';
export { ShipPartCategory, ShipPartSlotType, SHIP_PARTS_BY_ID, SHIP_LIMITS } from '@eclipse/engine';

// Blueprint state types for player board
export type { BlueprintState, ComputedBlueprintStats, WeaponSummary } from '@eclipse/engine';

// Blueprint computation for client-side upgrade simulation
export type { BlueprintDefinition } from '@eclipse/engine';
export { computeBlueprintStats, DEFAULT_BLUEPRINTS } from '@eclipse/engine';

// Upgrade action type for legal actions grouping
export type { UpgradeAction } from '@eclipse/engine';

// Build action type for legal actions grouping
export type { BuildAction } from '@eclipse/engine';

// Move action type for legal actions grouping
export type { MoveAction, MoveFinishAction } from '@eclipse/engine';

// Diplomacy action types for ally button UI
export type { DiplomacyAction, DiplomacyResponseAction } from '@eclipse/engine';

// Reputation slot types for reputation track UI
export type { ReputationSlot, ReputationTileContents, ReputationSelectionAction } from '@eclipse/engine';

// Dice result type for combat replay UI
export type { DiceResult } from '@eclipse/engine';

// Combat state types for interactive combat UI
export type {
  CombatState,
  CombatBattleSetup,
  CombatPair,
  CombatStepPhase,
  CombatStepAction,
} from '@eclipse/engine';

// Ship types for battlefield display
export type { ShipOnBoard } from '@eclipse/engine';
export { DICE_DAMAGE } from '@eclipse/engine';

// Hex/wormhole utilities for client-side move computation
export { positionToKey, getWormholeNeighbors } from '@eclipse/engine';

// Influence sector choice action type for post-combat UI
export type { InfluenceSectorChoiceAction } from '@eclipse/engine';

// Warp portal choice action type for tech instant effect UI
export type { WarpPortalChoiceAction } from '@eclipse/engine';

// Artifact resource choice action type for tech instant effect UI
export type { ArtifactResourceChoiceAction } from '@eclipse/engine';

// Retreat decision action type for combat retreat UI
export type { RetreatDecisionAction } from '@eclipse/engine';

// Population graveyard choice action type for wild/orbital pop destruction UI
export type { PopulationGraveyardChoiceAction } from '@eclipse/engine';

// Discovery tile definitions for decision UI
export type { DiscoveryTileDefinition } from '@eclipse/engine';
export type { DiscoveryDecisionAction } from '@eclipse/engine';
export { DiscoveryType, DISCOVERY_TILES_BY_ID } from '@eclipse/engine';

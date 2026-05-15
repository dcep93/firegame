// Game lifecycle
export { createGame } from './state/create-game';

// Action dispatch
export { validateAction, executeAction } from './dispatch';

// Legal actions
export { getLegalActions } from './legal-actions/index';
export type { LegalActions } from './legal-actions/index';

// Scoring
export { calculateScores, getWinner, isGameOver } from './scoring/index';
export type { ScoreBreakdown } from './scoring/index';

// Replay
export { replayGame, replayToTurn, getEventLog } from './replay';

// Phases
export {
  processActionPhaseStep,
  isActionPhaseComplete,
  endActionPhase,
} from './phases/action-phase';
export { processCombatPhase, postBattleCleanup, finishPostBattleCleanup, collectEligibleInfluences, endCombatPhase } from './phases/combat-phase';
export { processUpkeepPhase } from './phases/upkeep-phase';
export { processCleanupPhase } from './phases/cleanup-phase';

// Query helpers
export {
  getProduction,
  getUpkeepCost,
  getNetIncome,
  getControlledSectors,
  getPlayerShips,
  getShipsInSector,
  getSectorOwner,
  playerHasTech,
  getPlayerTechs,
  getTechDiscount,
  getCurrentPlayer,
  isPlayerTurn,
} from './state/state-queries';

// State helpers
export {
  updatePlayer,
  updateBlueprint,
  adjustResources,
  moveDiscToAction,
  moveDiscToSector,
  returnDiscFromSector,
  returnActionDiscs,
  addShipToSector,
  removeShipFromSector,
  moveShip,
  placeSector,
  updateSector,
  addTechToPlayer,
  removeTechFromTray,
  removeCubeFromTrack,
  returnCubeToTrack,
  moveCubeToGraveyard,
  sendBoardCubeToGraveyard,
} from './state/state-helpers';

// Blueprint helpers
export { computeBlueprintStats } from './state/blueprint-helpers';

// Hex utilities
export {
  hexDistance,
  hexNeighbors,
  hexNeighborAtEdge,
  hexRingPositions,
  hexRingType,
  positionToKey,
  keyToPosition,
  getOppositeEdge,
} from './hex/hex-math';

export {
  getRotatedWormholes,
  hasWormholeConnection,
  getWormholeNeighbors,
} from './hex/wormhole';

// RNG utilities
export { nextInt } from './utils/rng';

// Discovery tile lookup
export { DISCOVERY_TILES_BY_ID } from '../data/definitions/discovery-tiles';

// Types (re-export all engine types)
export * from './types';

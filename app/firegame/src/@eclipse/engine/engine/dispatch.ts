import type { GameState, PlayerId, GameAction } from './types';
import {
  validateExplore,
  executeExplore,
  validateExploreChoice,
  executeExploreChoice,
  validateResearch,
  executeResearch,
  validateUpgrade,
  executeUpgrade,
  validateBuild,
  executeBuild,
  validateMove,
  executeMove,
  validateMoveFinish,
  executeMoveFinish,
  validateInfluence,
  executeInfluence,
  validatePass,
  executePass,
  validateTrade,
  executeTrade,
  validateReaction,
  executeReaction,
  validateColonyShip,
  executeColonyShip,
  validateDiplomacy,
  executeDiplomacy,
  validateDiplomacyResponse,
  executeDiplomacyResponse,
  validateCombatStep,
  executeCombatStep,
  validateDiscoveryDecision,
  executeDiscoveryDecision,
  validateInfluenceSectorChoice,
  executeInfluenceSectorChoice,
  validateBankruptcyResolution,
  executeBankruptcyResolution,
  validateBombardmentChoice,
  executeBombardmentChoice,
  validateWarpPortalChoice,
  executeWarpPortalChoice,
  validateArtifactResourceChoice,
  executeArtifactResourceChoice,
  validateRetreatDecision,
  executeRetreatDecision,
  validatePopulationGraveyardChoice,
  executePopulationGraveyardChoice,
  validateReputationSelection,
  executeReputationSelection,
  validateDamageAssignmentAction,
  executeDamageAssignment,
} from './actions/index';
import { advanceColonyShipPlacement } from './phases/combat-phase';
import { appendEvent, createEvent } from './utils/events';

/**
 * Validate any action — routes to the correct handler's validator.
 * Returns null if valid, or an error string describing the issue.
 */
export function validateAction(
  state: GameState,
  playerId: PlayerId,
  action: GameAction,
): string | null {
  // PASS during COLONY_SHIP_PLACEMENT: skip normal pass validation
  if (action.type === 'PASS' && state.subPhase?.type === 'COLONY_SHIP_PLACEMENT') {
    return state.subPhase.playerId === playerId ? null : 'Not your colony ship placement turn.';
  }

  switch (action.type) {
    case 'EXPLORE':
      return validateExplore(state, playerId, action);
    case 'EXPLORE_CHOICE':
      return validateExploreChoice(state, playerId, action);
    case 'RESEARCH':
      return validateResearch(state, playerId, action);
    case 'UPGRADE':
      return validateUpgrade(state, playerId, action);
    case 'BUILD':
      return validateBuild(state, playerId, action);
    case 'MOVE':
      return validateMove(state, playerId, action);
    case 'INFLUENCE':
      return validateInfluence(state, playerId, action);
    case 'PASS':
      return validatePass(state, playerId, action);
    case 'REACTION':
      return validateReaction(state, playerId, action);
    case 'COLONY_SHIP':
      return validateColonyShip(state, playerId, action);
    case 'DIPLOMACY':
      return validateDiplomacy(state, playerId, action);
    case 'TRADE':
      return validateTrade(state, playerId, action);
    case 'COMBAT_STEP':
      return validateCombatStep(state, playerId);
    case 'DISCOVERY_DECISION':
      return validateDiscoveryDecision(state, playerId, action);
    case 'MOVE_FINISH':
      return validateMoveFinish(state, playerId);
    case 'INFLUENCE_SECTOR_CHOICE':
      return validateInfluenceSectorChoice(state, playerId, action);
    case 'BANKRUPTCY_RESOLUTION':
      return validateBankruptcyResolution(state, playerId, action);
    case 'DIPLOMACY_RESPONSE':
      return validateDiplomacyResponse(state, playerId, action);
    case 'BOMBARDMENT_CHOICE':
      return validateBombardmentChoice(state, playerId, action);
    case 'WARP_PORTAL_CHOICE':
      return validateWarpPortalChoice(state, playerId, action);
    case 'ARTIFACT_RESOURCE_CHOICE':
      return validateArtifactResourceChoice(state, playerId, action);
    case 'RETREAT_DECISION':
      return validateRetreatDecision(state, playerId, action);
    case 'POPULATION_GRAVEYARD_CHOICE':
      return validatePopulationGraveyardChoice(state, playerId, action);
    case 'REPUTATION_SELECTION':
      return validateReputationSelection(state, playerId, action);
    case 'DAMAGE_ASSIGNMENT':
      return validateDamageAssignmentAction(state, playerId, action);
    default:
      return `Unknown action type: ${(action as { type: string }).type}`;
  }
}

/**
 * Execute any action — validates first, then routes to the correct handler.
 * Throws if the action is invalid.
 * Appends an ACTION_TAKEN event and increments turnNumber.
 */
export function executeAction(
  state: GameState,
  playerId: PlayerId,
  action: GameAction,
): GameState {
  const error = validateAction(state, playerId, action);
  if (error !== null) {
    throw new Error(`Invalid action: ${error}`);
  }

  // Capture whether this is a continuation MOVE before execution (subPhase changes during execute)
  const isMoveContinuation = action.type === 'MOVE' &&
    state.subPhase?.type === 'MOVE_CONTINUATION';
  const isColonyShipPlacement = state.subPhase?.type === 'COLONY_SHIP_PLACEMENT';

  // PASS during COLONY_SHIP_PLACEMENT: skip normal pass, advance to next player or end combat
  if (action.type === 'PASS' && isColonyShipPlacement) {
    return advanceColonyShipPlacement(state, true);
  }

  let result: GameState;
  switch (action.type) {
    case 'EXPLORE':
      result = executeExplore(state, playerId, action);
      break;
    case 'EXPLORE_CHOICE':
      result = executeExploreChoice(state, playerId, action);
      break;
    case 'RESEARCH':
      result = executeResearch(state, playerId, action);
      break;
    case 'UPGRADE':
      result = executeUpgrade(state, playerId, action);
      break;
    case 'BUILD':
      result = executeBuild(state, playerId, action);
      break;
    case 'MOVE':
      result = executeMove(state, playerId, action);
      break;
    case 'INFLUENCE':
      result = executeInfluence(state, playerId, action);
      break;
    case 'PASS':
      result = executePass(state, playerId, action);
      break;
    case 'REACTION':
      result = executeReaction(state, playerId, action);
      break;
    case 'COLONY_SHIP':
      result = executeColonyShip(state, playerId, action);
      if (isColonyShipPlacement) {
        result = advanceColonyShipPlacement(result, false);
      }
      break;
    case 'DIPLOMACY':
      result = executeDiplomacy(state, playerId, action);
      break;
    case 'TRADE':
      result = executeTrade(state, playerId, action);
      break;
    case 'COMBAT_STEP':
      result = executeCombatStep(state, playerId);
      break;
    case 'DISCOVERY_DECISION':
      result = executeDiscoveryDecision(state, playerId, action);
      break;
    case 'MOVE_FINISH':
      result = executeMoveFinish(state, playerId);
      break;
    case 'INFLUENCE_SECTOR_CHOICE':
      result = executeInfluenceSectorChoice(state, playerId, action);
      break;
    case 'BANKRUPTCY_RESOLUTION':
      result = executeBankruptcyResolution(state, playerId, action);
      break;
    case 'DIPLOMACY_RESPONSE':
      result = executeDiplomacyResponse(state, playerId, action);
      break;
    case 'BOMBARDMENT_CHOICE':
      result = executeBombardmentChoice(state, playerId, action);
      break;
    case 'WARP_PORTAL_CHOICE':
      result = executeWarpPortalChoice(state, playerId, action);
      break;
    case 'ARTIFACT_RESOURCE_CHOICE':
      result = executeArtifactResourceChoice(state, playerId, action);
      break;
    case 'RETREAT_DECISION':
      result = executeRetreatDecision(state, playerId, action);
      break;
    case 'POPULATION_GRAVEYARD_CHOICE':
      result = executePopulationGraveyardChoice(state, playerId, action);
      break;
    case 'REPUTATION_SELECTION':
      result = executeReputationSelection(state, playerId, action);
      break;
    case 'DAMAGE_ASSIGNMENT':
      result = executeDamageAssignment(state, playerId, action);
      break;
  }

  // Sub-phase actions skip ACTION_TAKEN event and turnNumber increment
  if (action.type === 'COMBAT_STEP' || action.type === 'DISCOVERY_DECISION' ||
      action.type === 'MOVE_FINISH' || action.type === 'EXPLORE_CHOICE' ||
      action.type === 'INFLUENCE_SECTOR_CHOICE' ||
      action.type === 'BANKRUPTCY_RESOLUTION' ||
      action.type === 'DIPLOMACY' || action.type === 'DIPLOMACY_RESPONSE' ||
      action.type === 'BOMBARDMENT_CHOICE' ||
      action.type === 'WARP_PORTAL_CHOICE' ||
      action.type === 'ARTIFACT_RESOURCE_CHOICE' ||
      action.type === 'RETREAT_DECISION' ||
      action.type === 'POPULATION_GRAVEYARD_CHOICE' ||
      action.type === 'REPUTATION_SELECTION' ||
      action.type === 'DAMAGE_ASSIGNMENT' ||
      isMoveContinuation ||
      (action.type === 'COLONY_SHIP' && isColonyShipPlacement)) {
    return result;
  }

  // Append ACTION_TAKEN event
  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('ACTION_TAKEN', {
        playerId,
        action,
        turnNumber: result.turnNumber,
      }),
    ),
  };

  return { ...result, turnNumber: result.turnNumber + 1 };
}

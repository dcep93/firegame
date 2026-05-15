import { PhaseType } from '@data/enums';
import type { GameState, GameAction, PlayerId } from '../types';
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
} from '../actions/index';
import { appendEvent, createEvent } from '../utils/events';

const FREE_ACTIONS = new Set(['COLONY_SHIP', 'DIPLOMACY', 'TRADE']);

export function processActionPhaseStep(
  state: GameState,
  playerId: PlayerId,
  action: GameAction,
): GameState {
  if (state.phase !== PhaseType.Action) {
    throw new Error('Can only process actions during the Action phase.');
  }

  // Determine if this is a continuation MOVE or MOVE_FINISH (exempt from turn check)
  const isMoveContinuation = action.type === 'MOVE' &&
    state.subPhase?.type === 'MOVE_CONTINUATION' &&
    state.subPhase.playerId === playerId;
  const isMoveFinish = action.type === 'MOVE_FINISH' &&
    state.subPhase?.type === 'MOVE_CONTINUATION' &&
    state.subPhase.playerId === playerId;

  // Sub-phase actions are exempt from turn check — they validate against subPhase.playerId
  const SUB_PHASE_ACTIONS = new Set([
    'DISCOVERY_DECISION', 'EXPLORE_CHOICE', 'INFLUENCE_SECTOR_CHOICE',
    'BANKRUPTCY_RESOLUTION', 'DIPLOMACY_RESPONSE',
    'BOMBARDMENT_CHOICE', 'WARP_PORTAL_CHOICE', 'ARTIFACT_RESOURCE_CHOICE',
  ]);

  // For non-free actions, verify it's the player's turn.
  // Sub-phase actions, continuation MOVE, and MOVE_FINISH are exempt.
  if (!FREE_ACTIONS.has(action.type) &&
      !SUB_PHASE_ACTIONS.has(action.type) &&
      !isMoveContinuation && !isMoveFinish) {
    const currentPlayer = state.turnOrder[state.currentPlayerIndex];
    if (currentPlayer !== playerId) {
      throw new Error("Not this player's turn.");
    }
  }

  // Validate and execute the action
  let result: GameState;
  switch (action.type) {
    case 'EXPLORE': {
      const err = validateExplore(state, playerId, action);
      if (err) throw new Error(err);
      result = executeExplore(state, playerId, action);
      break;
    }
    case 'RESEARCH': {
      const err = validateResearch(state, playerId, action);
      if (err) throw new Error(err);
      result = executeResearch(state, playerId, action);
      break;
    }
    case 'UPGRADE': {
      const err = validateUpgrade(state, playerId, action);
      if (err) throw new Error(err);
      result = executeUpgrade(state, playerId, action);
      break;
    }
    case 'BUILD': {
      const err = validateBuild(state, playerId, action);
      if (err) throw new Error(err);
      result = executeBuild(state, playerId, action);
      break;
    }
    case 'MOVE': {
      const err = validateMove(state, playerId, action);
      if (err) throw new Error(err);
      result = executeMove(state, playerId, action);
      // Continuation move: don't log ACTION_TAKEN or advance turn
      if (isMoveContinuation) {
        return result;
      }
      break;
    }
    case 'INFLUENCE': {
      const err = validateInfluence(state, playerId, action);
      if (err) throw new Error(err);
      result = executeInfluence(state, playerId, action);
      break;
    }
    case 'PASS': {
      const err = validatePass(state, playerId, action);
      if (err) throw new Error(err);
      result = executePass(state, playerId, action);
      // Pass already advances turn internally — do NOT advance again
      break;
    }
    case 'REACTION': {
      const err = validateReaction(state, playerId, action);
      if (err) throw new Error(err);
      result = executeReaction(state, playerId, action);
      break;
    }
    case 'COLONY_SHIP': {
      const err = validateColonyShip(state, playerId, action);
      if (err) throw new Error(err);
      result = executeColonyShip(state, playerId, action);
      break;
    }
    case 'DIPLOMACY': {
      const err = validateDiplomacy(state, playerId, action);
      if (err) throw new Error(err);
      // Diplomacy proposal is a free sub-phase setup — no ACTION_TAKEN, no turn advance
      return executeDiplomacy(state, playerId, action);
    }
    case 'DIPLOMACY_RESPONSE': {
      const err = validateDiplomacyResponse(state, playerId, action);
      if (err) throw new Error(err);
      return executeDiplomacyResponse(state, playerId, action);
    }
    case 'TRADE': {
      const err = validateTrade(state, playerId, action);
      if (err) throw new Error(err);
      result = executeTrade(state, playerId, action);
      break;
    }
    case 'DISCOVERY_DECISION': {
      const err = validateDiscoveryDecision(state, playerId, action);
      if (err) throw new Error(err);
      return executeDiscoveryDecision(state, playerId, action);
    }
    case 'EXPLORE_CHOICE': {
      const err = validateExploreChoice(state, playerId, action);
      if (err) throw new Error(err);
      return executeExploreChoice(state, playerId, action);
    }
    case 'INFLUENCE_SECTOR_CHOICE': {
      const err = validateInfluenceSectorChoice(state, playerId, action);
      if (err) throw new Error(err);
      return executeInfluenceSectorChoice(state, playerId, action);
    }
    case 'BANKRUPTCY_RESOLUTION': {
      const err = validateBankruptcyResolution(state, playerId, action);
      if (err) throw new Error(err);
      return executeBankruptcyResolution(state, playerId, action);
    }
    case 'MOVE_FINISH': {
      const err = validateMoveFinish(state, playerId);
      if (err) throw new Error(err);
      return executeMoveFinish(state, playerId);
    }
    case 'BOMBARDMENT_CHOICE': {
      const err = validateBombardmentChoice(state, playerId, action);
      if (err) throw new Error(err);
      return executeBombardmentChoice(state, playerId, action);
    }
    case 'WARP_PORTAL_CHOICE': {
      const err = validateWarpPortalChoice(state, playerId, action);
      if (err) throw new Error(err);
      return executeWarpPortalChoice(state, playerId, action);
    }
    case 'ARTIFACT_RESOURCE_CHOICE': {
      const err = validateArtifactResourceChoice(state, playerId, action);
      if (err) throw new Error(err);
      return executeArtifactResourceChoice(state, playerId, action);
    }
    default:
      throw new Error(`Unsupported action type in action phase: ${(action as { type: string }).type}`);
  }

  // Log ACTION_TAKEN event
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

  // Advance turn for standard actions and reactions (not free actions, not pass)
  if (
    !FREE_ACTIONS.has(action.type) &&
    action.type !== 'PASS'
  ) {
    result = advanceToNextPlayer(result);
  }

  return result;
}

function advanceToNextPlayer(state: GameState): GameState {
  if (state.actionPhaseComplete) return state;

  const { turnOrder } = state;
  let idx = (state.currentPlayerIndex + 1) % turnOrder.length;

  // Include passed players in turn order — they get reaction windows.
  // Only skip eliminated players.
  for (let i = 0; i < turnOrder.length; i++) {
    const pid = turnOrder[idx]!;
    const player = state.players[pid]!;
    if (!player.eliminated) {
      return { ...state, currentPlayerIndex: idx };
    }
    idx = (idx + 1) % turnOrder.length;
  }

  return state;
}

export function isActionPhaseComplete(state: GameState): boolean {
  return state.actionPhaseComplete;
}

export function endActionPhase(state: GameState): GameState {
  const event = createEvent('PHASE_CHANGED', {
    from: PhaseType.Action,
    to: PhaseType.Combat,
    round: state.round,
  });

  return {
    ...state,
    phase: PhaseType.Combat,
    actionPhaseComplete: false,
    eventLog: appendEvent(state.eventLog, event),
  };
}

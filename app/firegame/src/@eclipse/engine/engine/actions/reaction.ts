import type {
  GameState,
  ReactionAction,
  PlayerId,
} from '../types';
import { updatePlayer } from '../state/state-helpers';
import { validateUpgrade, executeUpgrade } from './upgrade';
import { validateBuild, executeBuild } from './build';
import { validateMove, executeMove } from './move';

export function validateReaction(
  state: GameState,
  playerId: PlayerId,
  action: ReactionAction,
): string | null {
  const player = state.players[playerId];
  if (!player) return 'Player not found.';
  if (!player.hasPassed) return 'Can only react after passing.';
  if (player.influenceDiscs.onTrack <= 0) return 'No influence discs available for reaction.';

  // Validate the single activation using the appropriate handler
  // We need to construct a full action with exactly 1 activation
  switch (action.reactionType) {
    case 'UPGRADE': {
      // Override validation: skip turn/passed checks since reactions have their own rules
      // But we need the activation to be valid
      const fakeAction = {
        type: 'UPGRADE' as const,
        activations: [action.activation],
      };
      // We need to bypass the standard phase/turn/passed checks
      // Validate the activation content directly
      return validateReactionUpgrade(state, playerId, fakeAction);
    }
    case 'BUILD': {
      const fakeAction = {
        type: 'BUILD' as const,
        activations: [action.activation],
      };
      return validateReactionBuild(state, playerId, fakeAction);
    }
    case 'MOVE': {
      const fakeAction = {
        type: 'MOVE' as const,
        activations: [action.activation],
      };
      return validateReactionMove(state, playerId, fakeAction);
    }
    default:
      return `Unknown reaction type.`;
  }
}

/**
 * Validate a reaction upgrade — same as regular upgrade but:
 * - Player must have passed (checked above)
 * - Only 1 activation (no tech bonuses)
 * - Skip phase/turn/passed checks
 */
function validateReactionUpgrade(
  state: GameState,
  playerId: PlayerId,
  action: { type: 'UPGRADE'; activations: readonly any[] },
): string | null {
  // We can use the regular validateUpgrade but need to temporarily
  // adjust state to bypass phase/turn checks
  const tempState = {
    ...state,
    phase: 'action' as any, // Bypass phase check
    currentPlayerIndex: state.turnOrder.indexOf(playerId), // Bypass turn check
  };
  const tempPlayer = { ...state.players[playerId]!, hasPassed: false }; // Bypass passed check
  const tempStateWithPlayer = {
    ...tempState,
    players: { ...tempState.players, [playerId]: tempPlayer },
  };
  return validateUpgrade(tempStateWithPlayer, playerId, action as any);
}

function validateReactionBuild(
  state: GameState,
  playerId: PlayerId,
  action: { type: 'BUILD'; activations: readonly any[] },
): string | null {
  const tempState = {
    ...state,
    phase: 'action' as any,
    currentPlayerIndex: state.turnOrder.indexOf(playerId),
  };
  const tempPlayer = { ...state.players[playerId]!, hasPassed: false };
  const tempStateWithPlayer = {
    ...tempState,
    players: { ...tempState.players, [playerId]: tempPlayer },
  };
  return validateBuild(tempStateWithPlayer, playerId, action as any);
}

function validateReactionMove(
  state: GameState,
  playerId: PlayerId,
  action: { type: 'MOVE'; activations: readonly any[] },
): string | null {
  const tempState = {
    ...state,
    phase: 'action' as any,
    currentPlayerIndex: state.turnOrder.indexOf(playerId),
  };
  const tempPlayer = { ...state.players[playerId]!, hasPassed: false };
  const tempStateWithPlayer = {
    ...tempState,
    players: { ...tempState.players, [playerId]: tempPlayer },
  };
  return validateMove(tempStateWithPlayer, playerId, action as any);
}

export function executeReaction(
  state: GameState,
  playerId: PlayerId,
  action: ReactionAction,
): GameState {
  let result = state;

  // Move disc to reaction track
  const player = result.players[playerId]!;
  result = updatePlayer(result, playerId, {
    influenceDiscs: {
      ...player.influenceDiscs,
      onTrack: player.influenceDiscs.onTrack - 1,
      onReactions: player.influenceDiscs.onReactions + 1,
    },
  });

  // Execute the activation using the same temporary state trick
  const tempState = {
    ...result,
    phase: 'action' as any,
    currentPlayerIndex: result.turnOrder.indexOf(playerId),
  };
  const tempPlayer = { ...tempState.players[playerId]!, hasPassed: false };
  const execState = {
    ...tempState,
    players: { ...tempState.players, [playerId]: tempPlayer },
  };

  let afterExec: GameState;
  switch (action.reactionType) {
    case 'UPGRADE':
      afterExec = executeUpgrade(execState, playerId, {
        type: 'UPGRADE',
        activations: [action.activation as any],
      });
      break;
    case 'BUILD':
      afterExec = executeBuild(execState, playerId, {
        type: 'BUILD',
        activations: [action.activation as any],
      });
      break;
    case 'MOVE':
      afterExec = executeMove(execState, playerId, {
        type: 'MOVE',
        activations: [action.activation as any],
      });
      break;
  }

  // Restore the real phase, subPhase, and player passed state
  result = {
    ...afterExec,
    phase: state.phase,
    currentPlayerIndex: state.currentPlayerIndex,
    subPhase: state.subPhase,
  };

  // The underlying execute function (executeUpgrade/Build/Move) called
  // moveDiscToAction which moved a disc from onTrack to onActions.
  // For reactions, the only disc cost is the one already moved to onReactions.
  // Undo the action disc: onTrack +1, onActions -1.
  const afterPlayer = result.players[playerId]!;
  result = updatePlayer(result, playerId, {
    hasPassed: true, // Restore passed state
    influenceDiscs: {
      ...afterPlayer.influenceDiscs,
      onTrack: afterPlayer.influenceDiscs.onTrack + 1,
      onActions: afterPlayer.influenceDiscs.onActions - 1,
    },
  });

  return result;
}

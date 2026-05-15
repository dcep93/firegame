import type {
  GameState,
  PlayerId,
  ArtifactResourceChoiceAction,
} from '../types';
import { adjustResources } from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';

export function validateArtifactResourceChoice(
  state: GameState,
  playerId: PlayerId,
  action: ArtifactResourceChoiceAction,
): string | null {
  if (state.subPhase?.type !== 'ARTIFACT_RESOURCE_CHOICE') {
    return 'No ARTIFACT_RESOURCE_CHOICE sub-phase active';
  }

  if (state.subPhase.playerId !== playerId) {
    return 'Not your artifact resource choice';
  }

  const { totalResources, increment } = state.subPhase;
  const { money, materials, science } = action;

  if (money < 0 || materials < 0 || science < 0) {
    return 'Resource values must be non-negative';
  }

  if (money % increment !== 0 || materials % increment !== 0 || science % increment !== 0) {
    return `Resource values must be multiples of ${increment}`;
  }

  if (money + materials + science !== totalResources) {
    return `Total must equal ${totalResources}, got ${money + materials + science}`;
  }

  return null;
}

export function executeArtifactResourceChoice(
  state: GameState,
  playerId: PlayerId,
  action: ArtifactResourceChoiceAction,
): GameState {
  const { money, materials, science } = action;

  let result = adjustResources(state, playerId, { money, materials, science });

  const evt = createEvent('INSTANT_EFFECT', {
    playerId,
    techId: 'artifact_key',
    effectType: 'instant_artifact_resources',
    description: `Distributed resources: ${money} money, ${materials} materials, ${science} science`,
  });
  result = { ...result, eventLog: appendEvent(result.eventLog, evt) };

  // Clear sub-phase
  result = { ...result, subPhase: null };

  return result;
}

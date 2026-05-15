import { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';

/**
 * Multi-step action flow state machine.
 * Tracks which action the user is building and the current step.
 */

export type ActionFlowStep =
  | { type: 'IDLE' }
  | { type: 'EXPLORE_PICK_HEX' }
  | { type: 'EXPLORE_REVIEW_TILE'; tileId: string; position: { q: number; r: number } }
  | { type: 'EXPLORE_PICK_ROTATION'; tileId: string; position: { q: number; r: number } }
  | { type: 'RESEARCH_PICK_TECH' }
  | { type: 'UPGRADE_PICK_SHIP' }
  | { type: 'UPGRADE_PICK_PART'; shipType: string }
  | { type: 'BUILD_PICK_TYPE' }
  | { type: 'BUILD_PICK_SECTOR'; buildType: string }
  | { type: 'MOVE_PICK_SHIP' }
  | { type: 'MOVE_PICK_PATH'; shipId: string }
  | { type: 'INFLUENCE_PICK_SOURCE' }
  | { type: 'INFLUENCE_PICK_DESTINATION'; from: string }
  | { type: 'CONFIRM_PASS' };

const IDLE: ActionFlowStep = { type: 'IDLE' };

export function useActionFlow() {
  const [step, setStep] = useState<ActionFlowStep>(IDLE);
  const [reactionMode, setReactionMode] = useState(false);
  const { sendAction } = useGame();

  const startAction = useCallback((actionType: string) => {
    switch (actionType) {
      case 'EXPLORE': setStep({ type: 'EXPLORE_PICK_HEX' }); break;
      case 'RESEARCH': setStep({ type: 'RESEARCH_PICK_TECH' }); break;
      case 'UPGRADE': setStep({ type: 'UPGRADE_PICK_SHIP' }); break;
      case 'BUILD': setStep({ type: 'BUILD_PICK_TYPE' }); break;
      case 'MOVE': setStep({ type: 'MOVE_PICK_SHIP' }); break;
      case 'INFLUENCE': setStep({ type: 'INFLUENCE_PICK_SOURCE' }); break;
      case 'PASS': setStep({ type: 'CONFIRM_PASS' }); break;
      case 'REACTION_UPGRADE':
        setReactionMode(true);
        setStep({ type: 'UPGRADE_PICK_SHIP' });
        break;
      case 'REACTION_BUILD':
        setReactionMode(true);
        setStep({ type: 'BUILD_PICK_TYPE' });
        break;
      case 'REACTION_MOVE':
        setReactionMode(true);
        setStep({ type: 'MOVE_PICK_SHIP' });
        break;
      default: break;
    }
  }, []);

  const advanceStep = useCallback((nextStep: ActionFlowStep) => {
    setStep(nextStep);
  }, []);

  const submitAction = useCallback((action: unknown) => {
    const act = action as { type: string; activations?: unknown[] };
    if (reactionMode) {
      // Transform standard action into REACTION wrapper
      const reactionType = act.type as 'UPGRADE' | 'BUILD' | 'MOVE';
      const activation = act.activations?.[0];
      sendAction({
        type: 'REACTION',
        reactionType,
        activation,
      });
      setReactionMode(false);
    } else {
      sendAction(action);
    }
    setStep(IDLE);
  }, [sendAction, reactionMode]);

  const cancelAction = useCallback(() => {
    setReactionMode(false);
    setStep(IDLE);
  }, []);

  return {
    step,
    isActive: step.type !== 'IDLE',
    reactionMode,
    startAction,
    advanceStep,
    submitAction,
    cancelAction,
  };
}

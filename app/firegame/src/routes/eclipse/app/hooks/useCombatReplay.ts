import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import {
  hasBattleEvents,
  parseBattleEvents,
  type BattleReplay,
  type BattleStep,
} from '../services/battle-parser';

const STEP_DELAYS: Record<BattleStep['type'], number> = {
  dice_rolled: 1500,
  ship_destroyed: 1200,
  reputation_drawn: 1000,
  population_destroyed: 800,
  influence_placed: 800,
  discovery_claimed: 800,
};

export interface CombatReplayState {
  active: boolean;
  battles: BattleReplay[];
  battleIndex: number;
  stepIndex: number;
  autoAdvance: boolean;
  currentBattle: BattleReplay | null;
  allSteps: BattleStep[];
  currentStep: BattleStep | null;
  currentPhaseLabel: string;
  isComplete: boolean;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipBattle: () => void;
  skipAll: () => void;
  toggleAutoAdvance: () => void;
  dismiss: () => void;
}

export function useCombatReplay(): CombatReplayState {
  const { state } = useGame();
  const [active, setActive] = useState(false);
  const [battles, setBattles] = useState<BattleReplay[]>([]);
  const [battleIndex, setBattleIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Track last-seen events to avoid re-triggering
  const lastEventsRef = useRef<readonly unknown[]>([]);

  // Detect new battles from recentEvents
  useEffect(() => {
    const events = state.recentEvents;
    if (events === lastEventsRef.current) return;
    lastEventsRef.current = events;

    if (events.length > 0 && hasBattleEvents(events)) {
      const parsed = parseBattleEvents(events);
      if (parsed.length > 0) {
        setBattles(parsed);
        setBattleIndex(0);
        setStepIndex(0);
        setAutoAdvance(true);
        setActive(true);
      }
    }
  }, [state.recentEvents]);

  const currentBattle = battles[battleIndex] ?? null;

  // Flatten all steps from current battle's phases
  const allSteps = useMemo(() => {
    if (!currentBattle) return [];
    return currentBattle.phases.flatMap(p => p.steps);
  }, [currentBattle]);

  const currentStep = allSteps[stepIndex] ?? null;
  const totalSteps = allSteps.length;

  // Find which phase the current step belongs to
  const currentPhaseLabel = useMemo(() => {
    if (!currentBattle) return '';
    let count = 0;
    for (const phase of currentBattle.phases) {
      count += phase.steps.length;
      if (stepIndex < count) return phase.label;
    }
    return currentBattle.phases[currentBattle.phases.length - 1]?.label ?? '';
  }, [currentBattle, stepIndex]);

  const isLastStep = stepIndex >= totalSteps - 1;
  const isLastBattle = battleIndex >= battles.length - 1;
  const isComplete = isLastStep && isLastBattle;

  // Auto-advance timer
  useEffect(() => {
    if (!active || !autoAdvance || !currentStep) return;
    if (isComplete) return;

    const delay = STEP_DELAYS[currentStep.type] ?? 800;
    const timer = setTimeout(() => {
      if (isLastStep && !isLastBattle) {
        setBattleIndex(i => i + 1);
        setStepIndex(0);
      } else if (!isLastStep) {
        setStepIndex(i => i + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [active, autoAdvance, currentStep, stepIndex, battleIndex, isComplete, isLastStep, isLastBattle]);

  const nextStep = useCallback(() => {
    if (isLastStep && !isLastBattle) {
      setBattleIndex(i => i + 1);
      setStepIndex(0);
    } else if (!isLastStep) {
      setStepIndex(i => i + 1);
    }
  }, [isLastStep, isLastBattle]);

  const prevStep = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(i => i - 1);
    } else if (battleIndex > 0) {
      setBattleIndex(i => i - 1);
      // Go to last step of previous battle
      const prevBattle = battles[battleIndex - 1];
      if (prevBattle) {
        const prevSteps = prevBattle.phases.flatMap(p => p.steps);
        setStepIndex(Math.max(0, prevSteps.length - 1));
      }
    }
  }, [stepIndex, battleIndex, battles]);

  const skipBattle = useCallback(() => {
    if (!isLastBattle) {
      setBattleIndex(i => i + 1);
      setStepIndex(0);
    } else {
      setActive(false);
    }
  }, [isLastBattle]);

  const skipAll = useCallback(() => {
    setActive(false);
  }, []);

  const toggleAutoAdvance = useCallback(() => {
    setAutoAdvance(a => !a);
  }, []);

  const dismiss = useCallback(() => {
    setActive(false);
  }, []);

  return {
    active,
    battles,
    battleIndex,
    stepIndex,
    autoAdvance,
    currentBattle,
    allSteps,
    currentStep,
    currentPhaseLabel,
    isComplete,
    totalSteps,
    nextStep,
    prevStep,
    skipBattle,
    skipAll,
    toggleAutoAdvance,
    dismiss,
  };
}

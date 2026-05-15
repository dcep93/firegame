import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { eventToStep } from '../services/battle-parser';
import type { BattleStep } from '../services/battle-parser';
import type { CombatState, CombatBattleSetup, CombatStepPhase, HexCoord } from '@eclipse/shared';

export interface CombatFlowState {
  active: boolean;
  battle: CombatBattleSetup | null;
  battleIndex: number;
  totalBattles: number;
  step: CombatStepPhase | null;
  phaseLabel: string;
  actorOwner: string | null;
  actorShipType: string | null;
  targetOwner: string | null;
  isNpcTurn: boolean;
  recentSteps: BattleStep[];
  buttonLabel: string;
  canAdvance: boolean;
  advance: () => void;
  sectorPosition: HexCoord | null;
  sectorId: string | null;
}

const NPC_OWNERS = new Set(['ancient', 'guardian', 'gcds']);

export function useCombatFlow(): CombatFlowState {
  const { state, sendAction } = useGame();
  const filteredState = state.filteredState;
  const legalActions = state.legalActions;

  const combatState: CombatState | null = filteredState?.combatState ?? null;
  const active = combatState !== null;

  const battle = useMemo(() => {
    if (!combatState) return null;
    return combatState.battles[combatState.currentBattleIndex] ?? null;
  }, [combatState]);

  const sectorPosition = useMemo(() => {
    if (!battle || !filteredState) return null;
    const sector = filteredState.board.sectors[battle.sectorKey];
    return sector?.position ?? null;
  }, [battle, filteredState]);

  const sectorId = useMemo(() => {
    if (!battle || !filteredState) return null;
    const sector = filteredState.board.sectors[battle.sectorKey];
    return sector?.sectorId ?? null;
  }, [battle, filteredState]);

  const battleIndex = combatState?.currentBattleIndex ?? 0;
  const totalBattles = combatState?.battles.length ?? 0;
  const step = combatState?.step ?? null;

  // Actor info from engine
  const actorOwner = combatState?.currentActorOwner ?? null;
  const actorShipType = combatState?.currentActorShipType ?? null;
  const targetOwner = combatState?.currentTargetOwner ?? null;
  const isNpcTurn = actorOwner !== null && NPC_OWNERS.has(actorOwner);

  const phaseLabel = useMemo(() => {
    if (!combatState) return '';
    switch (combatState.step) {
      case 'AWAITING_START':
        return 'Ready to Begin';
      case 'MISSILE_FIRE':
        return 'Missile Phase';
      case 'ENGAGEMENT_FIRE':
        return `Engagement Round ${combatState.engagementRound}`;
      case 'BATTLE_RESULT':
        return 'Battle Complete';
      case 'POST_BATTLE':
        return 'Post-Battle Cleanup';
      case 'ALL_COMPLETE':
        return 'Combat Complete';
      default:
        return '';
    }
  }, [combatState]);

  // Parse recent events into BattleStep objects for rich display
  const recentSteps = useMemo(() => {
    if (!state.recentEvents || state.recentEvents.length === 0) return [];
    const steps: BattleStep[] = [];
    for (const event of state.recentEvents) {
      const s = eventToStep(event);
      if (s) steps.push(s);
    }
    return steps;
  }, [state.recentEvents]);

  // Dynamic button label
  const buttonLabel = useMemo(() => {
    if (!combatState) return 'Continue';
    switch (combatState.step) {
      case 'AWAITING_START':
        return 'Begin Battle';
      case 'MISSILE_FIRE':
      case 'ENGAGEMENT_FIRE':
        if (actorOwner && NPC_OWNERS.has(actorOwner)) {
          const name = actorOwner === 'ancient' ? 'Ancient'
            : actorOwner === 'guardian' ? 'Guardian'
            : 'GCDS';
          return `Let ${name} Fire`;
        }
        return 'Roll Dice';
      case 'BATTLE_RESULT':
      case 'POST_BATTLE':
        return 'Continue';
      default:
        return 'Continue';
    }
  }, [combatState, actorOwner]);

  const canAdvance = legalActions?.canAdvanceCombat ?? false;

  const advance = useCallback(() => {
    if (!canAdvance) return;
    sendAction({ type: 'COMBAT_STEP' });
  }, [canAdvance, sendAction]);

  // Auto-advance NPC turns after a delay so players can see the action
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (!canAdvance || !isNpcTurn) return;

    // Wait long enough for the previous animation to finish (~2.6s)
    // plus a brief pause so the "Let Ancient Fire" label is visible
    autoAdvanceTimerRef.current = setTimeout(() => {
      autoAdvanceTimerRef.current = null;
      sendAction({ type: 'COMBAT_STEP' });
    }, 2800);

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [canAdvance, isNpcTurn, sendAction]);

  return {
    active,
    battle,
    battleIndex,
    totalBattles,
    step,
    phaseLabel,
    actorOwner,
    actorShipType,
    targetOwner,
    isNpcTurn,
    recentSteps,
    buttonLabel,
    canAdvance,
    advance,
    sectorPosition,
    sectorId,
  };
}

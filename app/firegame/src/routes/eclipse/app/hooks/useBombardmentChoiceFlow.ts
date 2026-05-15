import { useState, useCallback, useEffect } from 'react';
import { useGameState } from './useGameState';
import type { ResourceType } from '@eclipse/shared';

interface DieRoll {
  dieColor: string;
  faceValue: number;
  isHit: boolean;
}

interface BombardmentChoiceFlowResult {
  active: boolean;
  sectorKey: string | null;
  totalDamage: number;
  populations: readonly { slotIndex: number; sourceTrack: ResourceType; isWild: boolean }[];
  rolls: readonly DieRoll[];
  selectedIndices: Set<number>;
  toggleCube: (index: number) => void;
  confirm: () => void;
  canConfirm: boolean;
  requiredCount: number;
  hasOrbitalPop: boolean;
  orbitalTrack: ResourceType | null;
  destroyOrbital: boolean;
  toggleOrbital: () => void;
}

export function useBombardmentChoiceFlow(
  sendAction: (action: unknown) => void,
): BombardmentChoiceFlowResult {
  const { filteredState, playerId, legalActions } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'BOMBARDMENT_CHOICE' &&
    subPhase.playerId === playerId;

  const bombardmentData = legalActions?.bombardmentChoice ?? null;

  const sectorKey = active ? bombardmentData?.sectorKey ?? null : null;
  const totalDamage = active ? bombardmentData?.totalDamage ?? 0 : 0;
  const populations = active ? bombardmentData?.populations ?? [] : [];
  const rolls: readonly DieRoll[] = active ? (bombardmentData?.rolls as readonly DieRoll[] ?? []) : [];
  const hasOrbitalPop = active ? bombardmentData?.hasOrbitalPop ?? false : false;
  const orbitalTrack = active ? bombardmentData?.orbitalTrack ?? null : null;

  const orbitalCount = hasOrbitalPop ? 1 : 0;
  const totalTargets = populations.length + orbitalCount;
  const requiredCount = Math.min(totalDamage, totalTargets);

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [destroyOrbital, setDestroyOrbital] = useState(false);

  // Reset selection when sub-phase changes
  const fingerprint = active ? `${sectorKey}:${totalDamage}:${hasOrbitalPop}` : '';
  useEffect(() => {
    // Auto-select: if overkill, select all normal + orbital
    const initial = new Set<number>();
    let autoSelected = 0;
    for (let i = 0; i < populations.length && autoSelected < requiredCount; i++) {
      initial.add(i);
      autoSelected++;
    }
    setSelectedIndices(initial);
    // Auto-include orbital if still room in required count
    setDestroyOrbital(hasOrbitalPop && autoSelected < requiredCount);
  }, [fingerprint]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentSelectionCount = selectedIndices.size + (destroyOrbital ? 1 : 0);

  const toggleCube = useCallback((index: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        const currentCount = prev.size + (destroyOrbital ? 1 : 0);
        if (currentCount < requiredCount) {
          next.add(index);
        }
      }
      return next;
    });
  }, [requiredCount, destroyOrbital]);

  const toggleOrbital = useCallback(() => {
    if (!hasOrbitalPop) return;
    setDestroyOrbital(prev => {
      if (prev) return false;
      const currentCount = selectedIndices.size;
      return currentCount < requiredCount;
    });
  }, [hasOrbitalPop, selectedIndices.size, requiredCount]);

  const canConfirm = currentSelectionCount === requiredCount;

  const confirm = useCallback(() => {
    if (!canConfirm) return;
    // Build cubesToDestroy: the sourceTrack for each selected population
    const cubesToDestroy: ResourceType[] = [];
    for (const idx of Array.from(selectedIndices).sort((a, b) => a - b)) {
      const pop = populations[idx];
      if (pop) cubesToDestroy.push(pop.sourceTrack);
    }
    sendAction({
      type: 'BOMBARDMENT_CHOICE',
      cubesToDestroy,
      destroyOrbital,
    });
  }, [canConfirm, selectedIndices, populations, destroyOrbital, sendAction]);

  return {
    active,
    sectorKey,
    totalDamage,
    populations,
    rolls,
    selectedIndices,
    toggleCube,
    confirm,
    canConfirm,
    requiredCount,
    hasOrbitalPop,
    orbitalTrack,
    destroyOrbital,
    toggleOrbital,
  };
}

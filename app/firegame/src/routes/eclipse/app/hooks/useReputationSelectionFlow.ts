import { useState, useCallback, useEffect } from 'react';
import { useGameState } from './useGameState';

interface SlotInfo {
  readonly slotType: string;
  readonly tile: { readonly value: number; readonly fromAmbassador: boolean } | null;
}

export interface ReputationSelectionFlowResult {
  active: boolean;
  drawn: readonly number[];
  currentTrack: readonly SlotInfo[];
  eligibleSlotIndices: readonly number[];
  selectedDrawnIndex: number | null;
  selectedSlotIndex: number | null;
  bestDrawnIndex: number;
  selectDrawn: (index: number | null) => void;
  selectSlot: (index: number) => void;
  confirm: () => void;
  decline: () => void;
  canConfirm: boolean;
}

export function useReputationSelectionFlow(
  sendAction: (action: unknown) => void,
): ReputationSelectionFlowResult {
  const { filteredState, playerId, legalActions } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'REPUTATION_SELECTION' &&
    subPhase.playerId === playerId;

  const repData = legalActions?.reputationSelection ?? null;
  const drawn = active ? repData?.drawn ?? [] : [];
  const currentTrack = active ? repData?.currentTrack ?? [] : [];
  const eligibleSlotIndices = active ? repData?.eligibleSlotIndices ?? [] : [];

  // Find best (highest value) drawn tile index
  const bestDrawnIndex = drawn.length > 0
    ? drawn.reduce((bestIdx, val, idx) => val > drawn[bestIdx]! ? idx : bestIdx, 0)
    : 0;

  const [selectedDrawnIndex, setSelectedDrawnIndex] = useState<number | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // Auto-select best tile and first empty eligible slot when sub-phase activates
  const fingerprint = active ? `${drawn.join(',')}:${eligibleSlotIndices.join(',')}` : '';
  useEffect(() => {
    if (!active || drawn.length === 0) {
      setSelectedDrawnIndex(null);
      setSelectedSlotIndex(null);
      return;
    }

    // Auto-highlight highest drawn tile
    setSelectedDrawnIndex(bestDrawnIndex);

    // Auto-pick first empty eligible slot, or lowest-value occupied slot if all full
    const firstEmptyEligible = eligibleSlotIndices.find(i => currentTrack[i]?.tile === null);
    if (firstEmptyEligible !== undefined) {
      setSelectedSlotIndex(firstEmptyEligible);
    } else if (eligibleSlotIndices.length > 0) {
      // All eligible slots occupied — pick lowest-value non-ambassador slot
      let lowestIdx = eligibleSlotIndices[0]!;
      let lowestVal = currentTrack[lowestIdx]?.tile?.value ?? Infinity;
      for (const idx of eligibleSlotIndices) {
        const tile = currentTrack[idx]?.tile;
        if (tile && !tile.fromAmbassador && tile.value < lowestVal) {
          lowestIdx = idx;
          lowestVal = tile.value;
        }
      }
      setSelectedSlotIndex(lowestIdx);
    } else {
      setSelectedSlotIndex(null);
    }
  }, [fingerprint]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectDrawn = useCallback((index: number | null) => {
    setSelectedDrawnIndex(index);
  }, []);

  const selectSlot = useCallback((index: number) => {
    setSelectedSlotIndex(index);
  }, []);

  const canConfirm = selectedDrawnIndex !== null && selectedSlotIndex !== null;

  const confirm = useCallback(() => {
    if (!canConfirm) return;
    sendAction({
      type: 'REPUTATION_SELECTION',
      keptIndex: selectedDrawnIndex,
      targetSlotIndex: selectedSlotIndex,
    });
  }, [canConfirm, selectedDrawnIndex, selectedSlotIndex, sendAction]);

  const decline = useCallback(() => {
    sendAction({
      type: 'REPUTATION_SELECTION',
      keptIndex: null,
      targetSlotIndex: null,
    });
  }, [sendAction]);

  return {
    active,
    drawn,
    currentTrack,
    eligibleSlotIndices,
    selectedDrawnIndex,
    selectedSlotIndex,
    bestDrawnIndex,
    selectDrawn,
    selectSlot,
    confirm,
    decline,
    canConfirm,
  };
}

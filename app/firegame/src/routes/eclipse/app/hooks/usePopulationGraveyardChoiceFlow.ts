import { useState, useCallback, useEffect } from 'react';
import { useGameState } from './useGameState';

interface GraveyardChoice {
  source: 'orbital' | 'wild';
  validTracks: readonly string[];
}

interface PopulationGraveyardChoiceFlowResult {
  active: boolean;
  sectorKey: string | null;
  choices: GraveyardChoice[];
  assignments: (string | null)[];
  setAssignment: (index: number, track: string) => void;
  canConfirm: boolean;
  confirm: () => void;
}

export function usePopulationGraveyardChoiceFlow(
  sendAction: (action: unknown) => void,
): PopulationGraveyardChoiceFlowResult {
  const { filteredState, playerId } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'POPULATION_GRAVEYARD_CHOICE' &&
    subPhase.playerId === playerId;

  const sectorKey = active && subPhase?.type === 'POPULATION_GRAVEYARD_CHOICE'
    ? subPhase.sectorKey
    : null;

  // Read choices directly from the sub-phase (always available when active)
  const choices: GraveyardChoice[] =
    subPhase?.type === 'POPULATION_GRAVEYARD_CHOICE'
      ? subPhase.choices as unknown as GraveyardChoice[]
      : [];

  const [assignments, setAssignments] = useState<(string | null)[]>([]);

  // Reset when sub-phase changes
  useEffect(() => {
    if (active && choices.length > 0) {
      // Default: first valid track for each choice
      setAssignments(choices.map(c => c.validTracks[0] ?? null));
    } else {
      setAssignments([]);
    }
  }, [active, choices.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAssignment = useCallback((index: number, track: string) => {
    setAssignments(prev => {
      const next = [...prev];
      next[index] = track;
      return next;
    });
  }, []);

  const canConfirm = active && assignments.length === choices.length && assignments.every(a => a !== null);

  const confirm = useCallback(() => {
    if (!canConfirm) return;
    sendAction({
      type: 'POPULATION_GRAVEYARD_CHOICE',
      assignments,
    });
  }, [canConfirm, assignments, sendAction]);

  return {
    active,
    sectorKey,
    choices,
    assignments,
    setAssignment,
    canConfirm,
    confirm,
  };
}

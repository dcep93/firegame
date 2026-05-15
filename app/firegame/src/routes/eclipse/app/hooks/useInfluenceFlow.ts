import { useState, useCallback, useMemo } from 'react';
import { SPECIES, SECTORS_BY_ID, PopulationSquareType, ResourceType } from '@eclipse/shared';
import type { InfluenceActivation, HexCoord, ReturnTrackOverride } from '@eclipse/shared';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';
import type { ActionFlowStep } from './useActionFlow';

export interface TrackChoiceEntry {
  readonly slotIndex: number; // -1 for orbital
  readonly label: string; // e.g. "Gray cube" or "Orbital cube"
  readonly defaultTrack: ResourceType;
  readonly selectedTrack: ResourceType;
  readonly allowedTracks: readonly ResourceType[];
}

export interface PendingTrackChoice {
  readonly sectorPos: HexCoord;
  readonly entries: TrackChoiceEntry[];
}

export interface InfluenceFlowResult {
  queue: InfluenceActivation[];
  maxActivations: number;
  discsOnTrack: number;
  colonyShipFlips: number;
  facedownColonyShips: number;
  placeableSectors: HexCoord[];
  removableSectors: HexCoord[];
  selectedSource: 'INFLUENCE_TRACK' | null;
  validDestinations: HexCoord[];
  pendingTrackChoice: PendingTrackChoice | null;
  selectPlace: () => void;
  selectRemove: (pos: HexCoord) => void;
  selectDestination: (pos: HexCoord) => void;
  setColonyShipFlips: (n: number) => void;
  removeFromQueue: (index: number) => void;
  updateTrackChoice: (slotIndex: number, track: ResourceType) => void;
  confirmTrackChoice: () => void;
  cancelTrackChoice: () => void;
  confirm: () => void;
  cancel: () => void;
}

const ALL_RESOURCE_TRACKS: readonly ResourceType[] = [ResourceType.Money, ResourceType.Science, ResourceType.Materials];
const ORBITAL_TRACKS: readonly ResourceType[] = [ResourceType.Science, ResourceType.Money];

export function useInfluenceFlow(
  step: ActionFlowStep,
  advanceStep: (nextStep: ActionFlowStep) => void,
  submitAction: (action: unknown) => void,
  cancelAction: () => void,
): InfluenceFlowResult {
  const { filteredState } = useGameState();
  const { influenceOptions } = useLegalActions();

  const [queue, setQueue] = useState<InfluenceActivation[]>([]);
  const [selectedSource, setSelectedSource] = useState<'INFLUENCE_TRACK' | null>(null);
  const [colonyShipFlips, setColonyShipFlipsState] = useState(0);
  const [pendingTrackChoice, setPendingTrackChoice] = useState<PendingTrackChoice | null>(null);

  const isActive = step.type === 'INFLUENCE_PICK_SOURCE' || step.type === 'INFLUENCE_PICK_DESTINATION';

  const maxActivations = useMemo(() => {
    if (!filteredState) return 2;
    const speciesId = filteredState.you.speciesId;
    const species = SPECIES[speciesId];
    return species?.activationLimits?.influence ?? 2;
  }, [filteredState]);

  // Discs on track adjusted for queued operations
  const discsOnTrack = useMemo(() => {
    if (!filteredState) return 0;
    let discs = filteredState.you.influenceDiscs.onTrack;
    for (const act of queue) {
      if (act.from === 'INFLUENCE_TRACK') discs--;
      if (act.to === 'INFLUENCE_TRACK') discs++;
    }
    return discs;
  }, [filteredState, queue]);

  const facedownColonyShips = useMemo(() => {
    if (!filteredState) return 0;
    const { total, available } = filteredState.you.colonyShips;
    return total - available;
  }, [filteredState]);

  // Filter placeable sectors: remove already-queued targets
  const placeableSectors = useMemo(() => {
    if (!isActive) return [];
    const queuedTargets = new Set(
      queue
        .filter(a => a.from === 'INFLUENCE_TRACK' && a.to !== 'INFLUENCE_TRACK')
        .map(a => {
          const to = a.to as HexCoord;
          return `${to.q},${to.r}`;
        })
    );
    return influenceOptions.placeable.filter(p => !queuedTargets.has(`${p.q},${p.r}`));
  }, [isActive, queue, influenceOptions.placeable]);

  // Filter removable sectors: remove already-queued removals
  const removableSectors = useMemo(() => {
    if (!isActive) return [];
    const queuedRemovals = new Set(
      queue
        .filter(a => a.to === 'INFLUENCE_TRACK' && a.from !== 'INFLUENCE_TRACK')
        .map(a => {
          const from = a.from as HexCoord;
          return `${from.q},${from.r}`;
        })
    );
    return influenceOptions.removable.filter(p => !queuedRemovals.has(`${p.q},${p.r}`));
  }, [isActive, queue, influenceOptions.removable]);

  // Valid destinations when placing a disc (INFLUENCE_TRACK -> sector)
  const validDestinations = useMemo(() => {
    if (selectedSource !== 'INFLUENCE_TRACK') return [];
    return placeableSectors;
  }, [selectedSource, placeableSectors]);

  const addToQueue = useCallback((activation: InfluenceActivation) => {
    if (maxActivations === 1 && queue.length === 0) {
      // Single activation — submit immediately
      submitAction({
        type: 'INFLUENCE',
        activations: [activation],
        colonyShipFlips,
      });
      setQueue([]);
      setSelectedSource(null);
      setColonyShipFlipsState(0);
      return;
    }

    setQueue(prev => {
      if (prev.length >= maxActivations) return prev;
      return [...prev, activation];
    });
    setSelectedSource(null);
    advanceStep({ type: 'INFLUENCE_PICK_SOURCE' });
  }, [maxActivations, queue.length, submitAction, colonyShipFlips, advanceStep]);

  const selectPlace = useCallback(() => {
    if (discsOnTrack <= 0 || queue.length >= maxActivations) return;
    setSelectedSource('INFLUENCE_TRACK');
    advanceStep({ type: 'INFLUENCE_PICK_DESTINATION', from: 'INFLUENCE_TRACK' });
  }, [discsOnTrack, queue.length, maxActivations, advanceStep]);

  const selectRemove = useCallback((pos: HexCoord) => {
    if (!filteredState) return;

    // Check if the sector has gray/wild pops or orbital pop that need track choice
    const sectorKey = `${pos.q},${pos.r}`;
    const sector = filteredState.board.sectors[sectorKey];
    if (!sector) return;

    const sectorDef = SECTORS_BY_ID[sector.sectorId];
    const entries: TrackChoiceEntry[] = [];

    if (sectorDef) {
      for (const pop of sector.populations) {
        const square = sectorDef.populationSquares[pop.slotIndex];
        if (square && square.type === PopulationSquareType.Wild) {
          entries.push({
            slotIndex: pop.slotIndex,
            label: 'Gray cube',
            defaultTrack: pop.sourceTrack,
            selectedTrack: pop.sourceTrack,
            allowedTracks: ALL_RESOURCE_TRACKS,
          });
        }
      }
    }

    if (sector.structures.orbitalPopulation) {
      entries.push({
        slotIndex: -1,
        label: 'Orbital cube',
        defaultTrack: sector.structures.orbitalPopulation.track,
        selectedTrack: sector.structures.orbitalPopulation.track,
        allowedTracks: ORBITAL_TRACKS,
      });
    }

    if (entries.length > 0) {
      // Need track choice — show picker
      setPendingTrackChoice({ sectorPos: pos, entries });
    } else {
      // No choice needed — proceed directly
      addToQueue({ from: pos, to: 'INFLUENCE_TRACK' });
    }
  }, [filteredState, addToQueue]);

  const updateTrackChoice = useCallback((slotIndex: number, track: ResourceType) => {
    setPendingTrackChoice(prev => {
      if (!prev) return null;
      return {
        ...prev,
        entries: prev.entries.map(e =>
          e.slotIndex === slotIndex ? { ...e, selectedTrack: track } : e,
        ),
      };
    });
  }, []);

  const confirmTrackChoice = useCallback(() => {
    if (!pendingTrackChoice) return;
    const overrides: ReturnTrackOverride[] = pendingTrackChoice.entries
      .filter(e => e.selectedTrack !== e.defaultTrack)
      .map(e => ({ slotIndex: e.slotIndex, track: e.selectedTrack }));

    const activation: InfluenceActivation = {
      from: pendingTrackChoice.sectorPos,
      to: 'INFLUENCE_TRACK',
      ...(overrides.length > 0 ? { returnTrackOverrides: overrides } : {}),
    };
    setPendingTrackChoice(null);
    addToQueue(activation);
  }, [pendingTrackChoice, addToQueue]);

  const cancelTrackChoice = useCallback(() => {
    setPendingTrackChoice(null);
  }, []);

  const selectDestination = useCallback((pos: HexCoord) => {
    if (selectedSource !== 'INFLUENCE_TRACK') return;
    const activation: InfluenceActivation = {
      from: 'INFLUENCE_TRACK',
      to: pos,
    };
    addToQueue(activation);
  }, [selectedSource, addToQueue]);

  const setColonyShipFlips = useCallback((n: number) => {
    const max = Math.min(2, facedownColonyShips);
    setColonyShipFlipsState(Math.max(0, Math.min(n, max)));
  }, [facedownColonyShips]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const confirm = useCallback(() => {
    if (queue.length === 0 && colonyShipFlips === 0) return;
    submitAction({
      type: 'INFLUENCE',
      activations: queue,
      colonyShipFlips,
    });
    setQueue([]);
    setSelectedSource(null);
    setColonyShipFlipsState(0);
  }, [queue, colonyShipFlips, submitAction]);

  const cancel = useCallback(() => {
    setQueue([]);
    setSelectedSource(null);
    setColonyShipFlipsState(0);
    setPendingTrackChoice(null);
    cancelAction();
  }, [cancelAction]);

  return {
    queue,
    maxActivations,
    discsOnTrack,
    colonyShipFlips,
    facedownColonyShips,
    placeableSectors,
    removableSectors,
    selectedSource,
    validDestinations,
    pendingTrackChoice,
    selectPlace,
    selectRemove,
    selectDestination,
    setColonyShipFlips,
    removeFromQueue,
    updateTrackChoice,
    confirmTrackChoice,
    cancelTrackChoice,
    confirm,
    cancel,
  };
}

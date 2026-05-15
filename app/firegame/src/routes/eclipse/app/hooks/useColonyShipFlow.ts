import { useState, useCallback, useMemo } from 'react';
import type { ColonyShipUsage, HexCoord, ResourceType } from '@eclipse/shared';
import { SECTORS_BY_ID, PopulationSquareType } from '@eclipse/shared';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';
import { buildColonyShipAction } from '../services/action-builder';

type TrackName = 'materials' | 'science' | 'money';

export interface QueuedPlacement {
  sourceTrack: TrackName;
  targetSector: HexCoord;
  targetSlotIndex: number;
  sectorName: string;
  slotType: string; // PopulationSquareType value
}

interface WildSlotPending {
  targetSector: HexCoord;
  targetSlotIndex: number;
  sectorName: string;
  validTracks: TrackName[];
}

export interface AvailableSlot {
  targetSector: HexCoord;
  targetSlotIndex: number;
  validTracks: TrackName[];
  slotType: string;
  sectorName: string;
  advanced: boolean;
}

export interface SectorGroup {
  sectorKey: string;
  sectorName: string;
  position: HexCoord;
  slots: AvailableSlot[];
}

interface ColonyShipFlowState {
  active: boolean;
  queue: QueuedPlacement[];
  wildSlotPending: WildSlotPending | null;
}

const INITIAL_STATE: ColonyShipFlowState = {
  active: false,
  queue: [],
  wildSlotPending: null,
};

export function useColonyShipFlow(sendAction: (action: unknown) => void) {
  const { filteredState } = useGameState();
  const { colonyShipActions } = useLegalActions();

  const [state, setState] = useState<ColonyShipFlowState>(INITIAL_STATE);

  // Count cubes available on each track (number of `true` slots)
  const baseCubes = useMemo(() => {
    if (!filteredState) return { materials: 0, science: 0, money: 0 };
    const tracks = filteredState.you.populationTracks;
    return {
      materials: tracks.materials.filter(Boolean).length,
      science: tracks.science.filter(Boolean).length,
      money: tracks.money.filter(Boolean).length,
    };
  }, [filteredState]);

  // Remaining ships after queued placements
  const remainingShips = useMemo(() => {
    if (!filteredState) return 0;
    return filteredState.you.colonyShips.available - state.queue.length;
  }, [filteredState, state.queue.length]);

  // Available cubes per track, minus queued removals
  const availableCubes = useMemo(() => {
    const cubes = { ...baseCubes };
    for (const placement of state.queue) {
      cubes[placement.sourceTrack] = Math.max(0, cubes[placement.sourceTrack] - 1);
    }
    return cubes;
  }, [baseCubes, state.queue]);

  // Group colony ship actions into available slots, filtering out queued ones
  const sectorGroups = useMemo(() => {
    if (!filteredState) return [];

    // Build a map of (sectorKey, slotIndex) → valid tracks
    const slotMap = new Map<string, {
      targetSector: HexCoord;
      targetSlotIndex: number;
      tracks: Set<TrackName>;
    }>();

    for (const action of colonyShipActions) {
      for (const usage of action.usages) {
        const key = `${usage.targetSector.q},${usage.targetSector.r}:${usage.targetSlotIndex}`;
        const existing = slotMap.get(key);
        if (existing) {
          existing.tracks.add(usage.sourceTrack as TrackName);
        } else {
          slotMap.set(key, {
            targetSector: usage.targetSector,
            targetSlotIndex: usage.targetSlotIndex,
            tracks: new Set([usage.sourceTrack as TrackName]),
          });
        }
      }
    }

    // Remove slots already queued
    const queuedKeys = new Set(
      state.queue.map(q => `${q.targetSector.q},${q.targetSector.r}:${q.targetSlotIndex}`),
    );

    // Group by sector
    const groupMap = new Map<string, SectorGroup>();

    for (const [key, slot] of Array.from(slotMap.entries())) {
      if (queuedKeys.has(key)) continue;

      // Filter tracks that still have cubes and ships
      const validTracks = [...slot.tracks].filter(t => availableCubes[t] > 0);
      if (validTracks.length === 0 || remainingShips <= 0) continue;

      const sectorKey = `${slot.targetSector.q},${slot.targetSector.r}`;
      const sectorData = filteredState.board.sectors[sectorKey];
      const sectorDef = sectorData ? SECTORS_BY_ID[sectorData.sectorId] : null;
      const sectorName = `Sector ${sectorData?.sectorId ?? sectorKey}`;

      const isOrbital = slot.targetSlotIndex === -1;
      const popSquare = isOrbital ? null : sectorDef?.populationSquares[slot.targetSlotIndex];
      const slotType = isOrbital ? 'orbital' : (popSquare?.type ?? 'wild');
      const advanced = isOrbital ? false : (popSquare?.advanced ?? false);

      const availableSlot: AvailableSlot = {
        targetSector: slot.targetSector,
        targetSlotIndex: slot.targetSlotIndex,
        validTracks: validTracks as TrackName[],
        slotType,
        sectorName,
        advanced,
      };

      const group = groupMap.get(sectorKey);
      if (group) {
        group.slots.push(availableSlot);
      } else {
        groupMap.set(sectorKey, {
          sectorKey,
          sectorName,
          position: slot.targetSector,
          slots: [availableSlot],
        });
      }
    }

    return Array.from(groupMap.values()).sort((a, b) => a.sectorName.localeCompare(b.sectorName));
  }, [colonyShipActions, filteredState, state.queue, availableCubes, remainingShips]);

  // Highlighted sectors for board overlay
  const highlightedSectors = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ q: number; r: number }> = [];
    for (const group of sectorGroups) {
      const key = `${group.position.q},${group.position.r}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(group.position);
      }
    }
    // Also include sectors with queued placements
    for (const placement of state.queue) {
      const key = `${placement.targetSector.q},${placement.targetSector.r}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(placement.targetSector);
      }
    }
    return result;
  }, [sectorGroups, state.queue]);

  const startFlow = useCallback(() => {
    setState({ active: true, queue: [], wildSlotPending: null });
  }, []);

  const cancelFlow = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const selectSlot = useCallback((slot: AvailableSlot) => {
    if (slot.validTracks.length === 1) {
      // Typed slot — auto-queue
      setState(prev => ({
        ...prev,
        wildSlotPending: null,
        queue: [...prev.queue, {
          sourceTrack: slot.validTracks[0]!,
          targetSector: slot.targetSector,
          targetSlotIndex: slot.targetSlotIndex,
          sectorName: slot.sectorName,
          slotType: slot.slotType,
        }],
      }));
    } else {
      // Wild slot — show track picker
      setState(prev => ({
        ...prev,
        wildSlotPending: {
          targetSector: slot.targetSector,
          targetSlotIndex: slot.targetSlotIndex,
          sectorName: slot.sectorName,
          validTracks: slot.validTracks,
        },
      }));
    }
  }, []);

  const confirmWildTrack = useCallback((track: TrackName) => {
    setState(prev => {
      if (!prev.wildSlotPending) return prev;
      return {
        ...prev,
        wildSlotPending: null,
        queue: [...prev.queue, {
          sourceTrack: track,
          targetSector: prev.wildSlotPending.targetSector,
          targetSlotIndex: prev.wildSlotPending.targetSlotIndex,
          sectorName: prev.wildSlotPending.sectorName,
          slotType: PopulationSquareType.Wild,
        }],
      };
    });
  }, []);

  const cancelWildPick = useCallback(() => {
    setState(prev => ({ ...prev, wildSlotPending: null }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index),
    }));
  }, []);

  const confirm = useCallback(() => {
    if (state.queue.length === 0) return;
    const usages: ColonyShipUsage[] = state.queue.map(q => ({
      sourceTrack: q.sourceTrack as ResourceType,
      targetSector: q.targetSector,
      targetSlotIndex: q.targetSlotIndex,
    }));
    sendAction(buildColonyShipAction(usages));
    setState(INITIAL_STATE);
  }, [state.queue, sendAction]);

  return {
    active: state.active,
    queue: state.queue,
    wildSlotPending: state.wildSlotPending,
    remainingShips,
    availableCubes,
    sectorGroups,
    highlightedSectors,
    startFlow,
    cancelFlow,
    selectSlot,
    confirmWildTrack,
    cancelWildPick,
    removeFromQueue,
    confirm,
  };
}

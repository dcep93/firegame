import { useState, useCallback, useMemo } from 'react';
import { TECHS_BY_ID, TechCategory, SPECIES } from '@eclipse/shared';
import type { TechDefinition, TechTraySlot } from '@eclipse/shared';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';
import type { ActionFlowStep } from './useActionFlow';

export interface EnrichedTech {
  techId: string;
  def: TechDefinition;
  computedCost: number;
  categoryColor: string;
  trayCount: number;
}

export type TrackKey = 'military' | 'grid' | 'nano';

export interface QueueEntry {
  techId: string;
  trackChoice?: TrackKey;
}

export const TECH_TRACK_CAPACITY = 7;

export interface RareTrackOption {
  track: TrackKey;
  trackLength: number;
  discount: number;
  cost: number;
  currentVP: number;
  vpAfter: number;
  isFull: boolean;
}

export interface ResearchFlowResult {
  queue: QueueEntry[];
  maxActivations: number;
  scienceAvailable: number;
  availableTechs: { category: string; color: string; discount: number; techs: EnrichedTech[] }[];
  selectTech: (techId: string) => void;
  removeFromQueue: (index: number) => void;
  confirm: () => void;
  cancel: () => void;
  // Rare tech track picker
  pendingRareTech: string | null;
  selectTrackForRare: (track: TrackKey) => void;
  cancelRarePicker: () => void;
  rareTrackOptions: RareTrackOption[] | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  military: 'var(--tech-military)',
  grid: 'var(--tech-grid)',
  nano: 'var(--tech-nano)',
  rare: 'var(--tech-rare)',
};

const CATEGORY_NAMES: Record<string, string> = {
  military: 'Military',
  grid: 'Grid',
  nano: 'Nano',
  rare: 'Rare',
};

function techTrackVP(trackLength: number): number {
  if (trackLength >= 7) return 5;
  if (trackLength === 6) return 3;
  if (trackLength === 5) return 2;
  if (trackLength === 4) return 1;
  return 0;
}

export function useResearchFlow(
  step: ActionFlowStep,
  submitAction: (action: unknown) => void,
  cancelAction: () => void,
): ResearchFlowResult {
  const { filteredState } = useGameState();
  const { researchTechIds } = useLegalActions();

  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [pendingRareTech, setPendingRareTech] = useState<string | null>(null);

  const isActive = step.type === 'RESEARCH_PICK_TECH';

  // Species activation limit for research
  const maxActivations = useMemo(() => {
    if (!filteredState) return 1;
    const speciesId = filteredState.you.speciesId;
    const species = SPECIES[speciesId];
    return species?.activationLimits?.research ?? 1;
  }, [filteredState]);

  // Count techs contributing to a track from queue entries before a given index
  const countQueuedOnTrack = useCallback((
    entries: QueueEntry[],
    track: TrackKey,
  ): number => {
    return entries.filter(e => {
      const d = TECHS_BY_ID[e.techId];
      if (!d) return false;
      if (d.category === TechCategory.Rare) return e.trackChoice === track;
      return d.category === track;
    }).length;
  }, []);

  // Compute cost of a tech given current tracks + queue
  const computeCost = useCallback((
    techDef: TechDefinition,
    playerTracks: { military: readonly string[]; grid: readonly string[]; nano: readonly string[] },
    currentQueue: QueueEntry[],
    trackOverride?: TrackKey,
  ): number => {
    if (techDef.category === TechCategory.Rare) {
      if (trackOverride) {
        // Specific track chosen
        const baseLen = playerTracks[trackOverride].length;
        const queuedOnTrack = countQueuedOnTrack(currentQueue, trackOverride);
        const discount = baseLen + queuedOnTrack;
        return Math.max(techDef.maxCost - discount, techDef.minCost);
      }
      // No track chosen: show min cost across all 3 tracks (best deal)
      const costs = (['military', 'grid', 'nano'] as const).map(track => {
        const baseLen = playerTracks[track].length;
        const queuedOnTrack = countQueuedOnTrack(currentQueue, track);
        const discount = baseLen + queuedOnTrack;
        return Math.max(techDef.maxCost - discount, techDef.minCost);
      });
      return Math.min(...costs);
    }

    // Non-rare: discount = track length for this category + queued contributing to same track
    const cat = techDef.category as TrackKey;
    const trackLen = playerTracks[cat]?.length ?? 0;
    const queuedInCategory = countQueuedOnTrack(currentQueue, cat);
    const discount = trackLen + queuedInCategory;
    return Math.max(techDef.maxCost - discount, techDef.minCost);
  }, [countQueuedOnTrack]);

  // Science available after queued tech costs
  const scienceAvailable = useMemo(() => {
    if (!filteredState) return 0;
    const baseSci = filteredState.you.resources.science;
    if (queue.length === 0) return baseSci;

    let spent = 0;
    for (let i = 0; i < queue.length; i++) {
      const entry = queue[i]!;
      const def = TECHS_BY_ID[entry.techId];
      if (!def) continue;
      spent += computeCost(def, filteredState.you.techTracks, queue.slice(0, i), entry.trackChoice);
    }
    return baseSci - spent;
  }, [filteredState, queue, computeCost]);

  // Available techs grouped by category
  const availableTechs = useMemo(() => {
    if (!filteredState || !isActive) return [];

    const categories = ['military', 'grid', 'nano', 'rare'] as const;
    const groups: { category: string; color: string; discount: number; techs: EnrichedTech[] }[] = [];

    for (const cat of categories) {
      const slots: readonly TechTraySlot[] = filteredState.techTray[cat];
      const techs: EnrichedTech[] = [];

      // Compute discount for display
      let discount: number;
      if (cat === 'rare') {
        // Show best available discount across all tracks
        const trackLens = [
          filteredState.you.techTracks.military.length + countQueuedOnTrack(queue, 'military'),
          filteredState.you.techTracks.grid.length + countQueuedOnTrack(queue, 'grid'),
          filteredState.you.techTracks.nano.length + countQueuedOnTrack(queue, 'nano'),
        ];
        discount = Math.max(...trackLens);
      } else {
        const trackLen = filteredState.you.techTracks[cat].length;
        const queuedOnTrack = countQueuedOnTrack(queue, cat);
        discount = trackLen + queuedOnTrack;
      }

      for (const slot of slots) {
        if (slot.count <= 0) continue;
        const def = TECHS_BY_ID[slot.techId];
        if (!def) continue;

        // Skip techs already in queue
        if (queue.some(e => e.techId === slot.techId)) continue;

        // Only show techs that are legally researchable (server-validated)
        // OR that would become affordable after queue adjustments
        if (!researchTechIds.has(slot.techId) && queue.length === 0) continue;

        const cost = computeCost(def, filteredState.you.techTracks, queue);

        techs.push({
          techId: slot.techId,
          def,
          computedCost: cost,
          categoryColor: CATEGORY_COLORS[cat] ?? 'var(--text-secondary)',
          trayCount: slot.count,
        });
      }

      groups.push({
        category: CATEGORY_NAMES[cat] ?? cat,
        color: CATEGORY_COLORS[cat] ?? 'var(--text-secondary)',
        discount,
        techs,
      });
    }

    return groups;
  }, [filteredState, isActive, queue, researchTechIds, computeCost, countQueuedOnTrack]);

  const selectTech = useCallback((techId: string) => {
    const def = TECHS_BY_ID[techId];
    if (!def) return;

    // Toggle off if already in queue
    if (queue.some(e => e.techId === techId)) {
      setQueue(prev => prev.filter(e => e.techId !== techId));
      return;
    }

    if (queue.length >= maxActivations) return;

    // If rare tech, open track picker instead of adding directly
    if (def.category === TechCategory.Rare) {
      setPendingRareTech(techId);
      return;
    }

    // Non-rare: add directly
    setQueue(prev => [...prev, { techId }]);
  }, [queue, maxActivations]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const selectTrackForRare = useCallback((track: TrackKey) => {
    if (!pendingRareTech) return;
    setQueue(prev => [...prev, { techId: pendingRareTech, trackChoice: track }]);
    setPendingRareTech(null);
  }, [pendingRareTech]);

  const cancelRarePicker = useCallback(() => {
    setPendingRareTech(null);
  }, []);

  // Compute per-track costs for the pending rare tech
  const rareTrackOptions = useMemo((): RareTrackOption[] | null => {
    if (!pendingRareTech || !filteredState) return null;
    const def = TECHS_BY_ID[pendingRareTech];
    if (!def) return null;

    return (['military', 'grid', 'nano'] as const).map(track => {
      const baseLen = filteredState.you.techTracks[track].length;
      const queuedOnTrack = countQueuedOnTrack(queue, track);
      const totalLen = baseLen + queuedOnTrack;
      const isFull = totalLen >= TECH_TRACK_CAPACITY;
      const discount = totalLen;
      const cost = Math.max(def.maxCost - discount, def.minCost);
      const currentVP = techTrackVP(totalLen);
      const vpAfter = techTrackVP(totalLen + 1);
      return { track, trackLength: totalLen, discount, cost, currentVP, vpAfter, isFull };
    });
  }, [pendingRareTech, filteredState, queue, countQueuedOnTrack]);

  const confirm = useCallback(() => {
    if (queue.length === 0) return;
    submitAction({
      type: 'RESEARCH',
      activations: queue.map(entry => {
        const activation: { techId: string; trackChoice?: TrackKey } = { techId: entry.techId };
        if (entry.trackChoice) activation.trackChoice = entry.trackChoice;
        return activation;
      }),
    });
    setQueue([]);
    setPendingRareTech(null);
  }, [queue, submitAction]);

  const cancel = useCallback(() => {
    setQueue([]);
    setPendingRareTech(null);
    cancelAction();
  }, [cancelAction]);

  return {
    queue,
    maxActivations,
    scienceAvailable,
    availableTechs,
    selectTech,
    removeFromQueue,
    confirm,
    cancel,
    pendingRareTech,
    selectTrackForRare,
    cancelRarePicker,
    rareTrackOptions,
  };
}

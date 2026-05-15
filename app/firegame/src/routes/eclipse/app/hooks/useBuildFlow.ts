import { useState, useCallback, useMemo } from 'react';
import { SPECIES } from '@eclipse/shared';
import type { BuildActivation, HexCoord } from '@eclipse/shared';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';
import type { ActionFlowStep } from './useActionFlow';

export interface BuildOption {
  buildType: string;
  label: string;
  cost: number;
  supplyRemaining: number | null; // null for structures
  canAfford: boolean;
  validSectors: HexCoord[];
}

export interface BuildFlowResult {
  queue: BuildActivation[];
  maxActivations: number;
  materialsAvailable: number;
  selectedBuildType: string | null;
  availableBuildTypes: { group: string; options: BuildOption[] }[];
  validSectorPositions: HexCoord[];
  selectBuildType: (type: string) => void;
  selectSector: (position: HexCoord) => void;
  removeFromQueue: (index: number) => void;
  confirm: () => void;
  cancel: () => void;
}

const BUILD_TYPE_LABELS: Record<string, string> = {
  interceptor: 'Interceptor',
  cruiser: 'Cruiser',
  dreadnought: 'Dreadnought',
  starbase: 'Starbase',
  ORBITAL: 'Orbital',
  MONOLITH: 'Monolith',
};

const SHIP_TYPES = ['interceptor', 'cruiser', 'dreadnought', 'starbase'] as const;
const STRUCTURE_TYPES = ['ORBITAL', 'MONOLITH'] as const;

function isShipType(t: string): t is 'interceptor' | 'cruiser' | 'dreadnought' | 'starbase' {
  return SHIP_TYPES.includes(t as typeof SHIP_TYPES[number]);
}

export function useBuildFlow(
  step: ActionFlowStep,
  advanceStep: (nextStep: ActionFlowStep) => void,
  submitAction: (action: unknown) => void,
  cancelAction: () => void,
  reactionMode?: boolean,
): BuildFlowResult {
  const { filteredState } = useGameState();
  const { buildOptions } = useLegalActions();

  const [queue, setQueue] = useState<BuildActivation[]>([]);
  const [selectedBuildType, setSelectedBuildType] = useState<string | null>(null);

  const isActive = step.type === 'BUILD_PICK_TYPE' || step.type === 'BUILD_PICK_SECTOR';

  // Species activation limit for build (+ 1 if nanorobots researched)
  // Reactions always allow exactly 1 activation
  const maxActivations = useMemo(() => {
    if (reactionMode) return 1;
    if (!filteredState) return 1;
    const speciesId = filteredState.you.speciesId;
    const species = SPECIES[speciesId];
    const base = species?.activationLimits?.build ?? 2;
    const hasNanorobots = filteredState.you.techTracks.nano.includes('nanorobots');
    return base + (hasNanorobots ? 1 : 0);
  }, [filteredState, reactionMode]);

  // Materials available after queued costs
  const materialsAvailable = useMemo(() => {
    if (!filteredState) return 0;
    const baseMat = filteredState.you.resources.materials;
    if (queue.length === 0) return baseMat;

    const species = SPECIES[filteredState.you.speciesId];
    if (!species) return baseMat;

    let spent = 0;
    const costs = species.buildingCosts;
    for (const act of queue) {
      const costKey = act.buildType === 'ORBITAL' ? 'orbital' as const
        : act.buildType === 'MONOLITH' ? 'monolith' as const
        : act.buildType;
      spent += costs[costKey as keyof typeof costs] ?? 0;
    }
    return baseMat - spent;
  }, [filteredState, queue]);

  // Available build types grouped into Ships and Structures
  const availableBuildTypes = useMemo(() => {
    if (!filteredState || !isActive) return [];

    const species = SPECIES[filteredState.you.speciesId];
    if (!species) return [];

    const queueFull = queue.length >= maxActivations;

    // Count queued per type for supply tracking
    const queuedCounts: Record<string, number> = {};
    const queuedPositions: Record<string, Set<string>> = {};
    for (const act of queue) {
      queuedCounts[act.buildType] = (queuedCounts[act.buildType] ?? 0) + 1;
      if (!queuedPositions[act.buildType]) {
        queuedPositions[act.buildType] = new Set();
      }
      queuedPositions[act.buildType]!.add(`${act.sectorPosition.q},${act.sectorPosition.r}`);
    }

    const buildOption = (buildType: string): BuildOption | null => {
      const serverPositions = buildOptions.get(buildType);
      if (!serverPositions || serverPositions.length === 0) return null;

      const costKey = buildType === 'ORBITAL' ? 'orbital' as const
        : buildType === 'MONOLITH' ? 'monolith' as const
        : buildType;
      const cost = species.buildingCosts[costKey as keyof typeof species.buildingCosts] ?? 0;

      let supplyRemaining: number | null = null;
      if (isShipType(buildType)) {
        const baseSupply = filteredState.you.shipSupply[buildType] ?? 0;
        supplyRemaining = baseSupply - (queuedCounts[buildType] ?? 0);
      }

      // Filter positions: only for structures, remove sectors already queued for same type
      // Ships CAN be built at the same sector multiple times
      const queuedPos = !isShipType(buildType) ? queuedPositions[buildType] : undefined;
      const validSectors = queuedPos
        ? serverPositions.filter(p => !queuedPos.has(`${p.q},${p.r}`))
        : serverPositions;

      // For structures (non-ships), supply is per-sector, so if all valid sectors used, none left
      if (!isShipType(buildType) && validSectors.length === 0) return null;
      if (isShipType(buildType) && (supplyRemaining !== null && supplyRemaining <= 0)) return null;

      const canAfford = cost <= materialsAvailable && !queueFull;

      return {
        buildType,
        label: BUILD_TYPE_LABELS[buildType] ?? buildType,
        cost,
        supplyRemaining,
        canAfford,
        validSectors,
      };
    };

    const ships: BuildOption[] = [];
    for (const t of SHIP_TYPES) {
      const opt = buildOption(t);
      if (opt) ships.push(opt);
    }

    const structures: BuildOption[] = [];
    for (const t of STRUCTURE_TYPES) {
      const opt = buildOption(t);
      if (opt) structures.push(opt);
    }

    const groups: { group: string; options: BuildOption[] }[] = [];
    if (ships.length > 0) groups.push({ group: 'Ships', options: ships });
    if (structures.length > 0) groups.push({ group: 'Structures', options: structures });

    return groups;
  }, [filteredState, isActive, queue, maxActivations, materialsAvailable, buildOptions]);

  // Valid sector positions for the selected build type
  const validSectorPositions = useMemo(() => {
    if (!selectedBuildType || !isActive) return [];

    for (const group of availableBuildTypes) {
      const opt = group.options.find(o => o.buildType === selectedBuildType);
      if (opt) return opt.validSectors;
    }
    return [];
  }, [selectedBuildType, isActive, availableBuildTypes]);

  const selectBuildType = useCallback((type: string) => {
    setSelectedBuildType(type);
    advanceStep({ type: 'BUILD_PICK_SECTOR', buildType: type });
  }, [advanceStep]);

  const selectSector = useCallback((position: HexCoord) => {
    if (!selectedBuildType) return;

    const activation: BuildActivation = {
      buildType: selectedBuildType as BuildActivation['buildType'],
      sectorPosition: position,
    };

    if (maxActivations === 1) {
      // Single activation — submit immediately
      submitAction({
        type: 'BUILD',
        activations: [activation],
      });
      setQueue([]);
      setSelectedBuildType(null);
      return;
    }

    // Multi-activation — add to queue
    setQueue(prev => {
      if (prev.length >= maxActivations) return prev;
      return [...prev, activation];
    });
    setSelectedBuildType(null);
    advanceStep({ type: 'BUILD_PICK_TYPE' });
  }, [selectedBuildType, maxActivations, submitAction, advanceStep]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const confirm = useCallback(() => {
    if (queue.length === 0) return;
    submitAction({
      type: 'BUILD',
      activations: queue,
    });
    setQueue([]);
    setSelectedBuildType(null);
  }, [queue, submitAction]);

  const cancel = useCallback(() => {
    setQueue([]);
    setSelectedBuildType(null);
    cancelAction();
  }, [cancelAction]);

  return {
    queue,
    maxActivations,
    materialsAvailable,
    selectedBuildType,
    availableBuildTypes,
    validSectorPositions,
    selectBuildType,
    selectSector,
    removeFromQueue,
    confirm,
    cancel,
  };
}

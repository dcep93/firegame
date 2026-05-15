import { useState, useCallback, useMemo } from 'react';
import {
  SPECIES,
  SpeciesId,
  SHIP_PARTS_BY_ID,
  DEFAULT_BLUEPRINTS,
  ShipPartCategory,
  computeBlueprintStats,
} from '@eclipse/shared';
import type {
  ShipType,
  UpgradeActivation,
  BlueprintState,
  ComputedBlueprintStats,
  BlueprintDefinition,
  ShipPartDefinition,
} from '@eclipse/shared';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';
import type { ActionFlowStep } from './useActionFlow';

export interface UpgradeFlowResult {
  queue: UpgradeActivation[];
  maxActivations: number;
  placementCount: number;
  selectedShip: ShipType | null;
  selectedSlot: number | null;
  previewBlueprints: Readonly<Record<string, BlueprintState>> | null;
  availableShipTypes: ShipType[];
  availableSlots: Map<number, { currentPart: string | null; isFixed: boolean; hasOptions: boolean }>;
  availableParts: { partId: string | null; def: ShipPartDefinition | null; category: string }[];
  previewStats: ComputedBlueprintStats | null;
  canConfirm: boolean;
  selectShip: (shipType: ShipType) => void;
  selectSlot: (slotIndex: number) => void;
  selectPart: (partId: string | null) => void;
  removeFromQueue: (index: number) => void;
  confirm: () => void;
  cancel: () => void;
}

/**
 * Apply queued upgrade activations to blueprints to get a preview state.
 */
function applyQueueToBlueprints(
  blueprints: Readonly<Record<string, BlueprintState>>,
  queue: UpgradeActivation[],
  speciesId: string,
): Readonly<Record<string, BlueprintState>> {
  if (queue.length === 0) return blueprints;

  const result: Record<string, BlueprintState> = {};
  for (const [key, bp] of Object.entries(blueprints)) {
    result[key] = bp;
  }

  for (const act of queue) {
    const bp = result[act.shipType]!;
    const newRow = [...bp.grid[0]!];
    newRow[act.slotIndex] = act.partId;
    const newGrid: readonly (readonly (string | null)[])[] = [newRow];

    const species = SPECIES[speciesId as SpeciesId];
    const overrides = species?.blueprintOverrides[act.shipType as ShipType];
    const baseDef = DEFAULT_BLUEPRINTS[act.shipType as ShipType];

    const computed = computeBlueprintStats(
      newGrid,
      bp.fixedParts,
      baseDef,
      overrides as Partial<BlueprintDefinition> | undefined,
      SHIP_PARTS_BY_ID,
    );

    result[act.shipType] = {
      ...bp,
      grid: newGrid,
      computed,
    };
  }

  return result;
}

/**
 * Check if the final blueprint state is valid (energy >= 0, movement > 0 for non-starbases).
 */
function isBlueprintValid(bp: BlueprintState): boolean {
  if (bp.computed.energyBalance < 0) return false;
  if (bp.shipType !== 'starbase' && bp.computed.movement <= 0) return false;
  return true;
}

export function useUpgradeFlow(
  step: ActionFlowStep,
  submitAction: (action: unknown) => void,
  cancelAction: () => void,
  reactionMode?: boolean,
): UpgradeFlowResult {
  const { filteredState } = useGameState();
  const { upgradePartOptions } = useLegalActions();

  const [queue, setQueue] = useState<UpgradeActivation[]>([]);
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const isActive = step.type === 'UPGRADE_PICK_SHIP' || step.type === 'UPGRADE_PICK_PART';

  // Species activation limit for upgrade (only placements count; removals are free)
  // Reactions always allow exactly 1 activation
  const maxActivations = useMemo(() => {
    if (reactionMode) return 1;
    if (!filteredState) return 1;
    const speciesId = filteredState.you.speciesId;
    const species = SPECIES[speciesId];
    return species?.activationLimits?.upgrade ?? 2;
  }, [filteredState, reactionMode]);

  // Only placements (non-null partId) count toward activation limit
  const placementCount = useMemo(
    () => queue.filter(a => a.partId !== null).length,
    [queue],
  );

  // Which ship types have upgrade options (use all tech-valid parts, not just energy-valid)
  const availableShipTypes = useMemo(() => {
    if (!isActive) return [];
    return Array.from(upgradePartOptions.keys());
  }, [isActive, upgradePartOptions]);

  // Preview blueprints after applying queued activations
  const previewBlueprints = useMemo(() => {
    if (!filteredState || !isActive) return null;
    return applyQueueToBlueprints(
      filteredState.you.blueprints,
      queue,
      filteredState.you.speciesId,
    );
  }, [filteredState, isActive, queue]);

  // Available slots for the selected ship (considering queue)
  const availableSlots = useMemo(() => {
    const slots = new Map<number, { currentPart: string | null; isFixed: boolean; hasOptions: boolean }>();
    if (!selectedShip || !previewBlueprints) return slots;

    const bp = previewBlueprints[selectedShip];
    if (!bp) return slots;

    const gridRow = bp.grid[0]!;
    const fixedSet = new Set(bp.fixedParts);

    // Slots that are already queued for this ship
    const queuedSlots = new Set(
      queue.filter(a => a.shipType === selectedShip).map(a => a.slotIndex)
    );

    for (let i = 0; i < gridRow.length; i++) {
      const partId = gridRow[i] ?? null;
      const isFixed = partId !== null && fixedSet.has(partId);

      // Check if this slot has any swappable options (energy checked at confirm time)
      let hasOptions = false;
      if (!isFixed && !queuedSlots.has(i)) {
        const slotParts = upgradePartOptions.get(selectedShip)?.get(i);
        if (slotParts && slotParts.length > 0) {
          hasOptions = slotParts.some(p => p !== partId);
        }
        // Removal is always an option if slot has a non-fixed part
        if (!hasOptions && partId !== null) {
          hasOptions = true;
        }
      }

      slots.set(i, { currentPart: partId, isFixed, hasOptions });
    }

    return slots;
  }, [selectedShip, previewBlueprints, queue, upgradePartOptions]);

  // Available parts for the selected slot — uses upgradePartOptions (all tech-valid parts,
  // energy/movement validated at confirm time, not per-part)
  const availableParts = useMemo(() => {
    const parts: { partId: string | null; def: ShipPartDefinition | null; category: string }[] = [];
    if (!selectedShip || selectedSlot === null || !previewBlueprints || !filteredState) return parts;

    const bp = previewBlueprints[selectedShip];
    if (!bp) return parts;

    const currentPart = bp.grid[0]![selectedSlot] ?? null;

    // Get all tech-valid parts for this slot from server
    const slotParts = upgradePartOptions.get(selectedShip)?.get(selectedSlot);
    if (!slotParts) return parts;

    // Track saved parts consumed by earlier queue entries
    const remainingSaved = [...(filteredState.you.savedShipParts ?? [])];
    for (const q of queue) {
      if (q.partId !== null) {
        const idx = remainingSaved.indexOf(q.partId);
        if (idx >= 0) remainingSaved.splice(idx, 1);
      }
    }

    for (const partId of slotParts) {
      if (partId === currentPart) continue;

      // Skip consumed discovery-only parts
      const def = SHIP_PARTS_BY_ID[partId];
      if (def?.isDiscoveryOnly && !remainingSaved.includes(partId)) continue;

      parts.push({
        partId,
        def: def ?? null,
        category: def?.category ?? 'remove',
      });
    }

    // Add removal option if slot has a non-fixed part
    if (currentPart !== null) {
      parts.push({ partId: null, def: null, category: 'remove' });
    }

    // Sort: weapons first, then energy, drives, computers, shields, hulls, remove last
    const categoryOrder: Record<string, number> = {
      [ShipPartCategory.Weapon]: 0,
      [ShipPartCategory.Energy]: 1,
      [ShipPartCategory.Drive]: 2,
      [ShipPartCategory.Computer]: 3,
      [ShipPartCategory.Shield]: 4,
      [ShipPartCategory.Hull]: 5,
      remove: 6,
    };
    parts.sort((a, b) => (categoryOrder[a.category] ?? 9) - (categoryOrder[b.category] ?? 9));

    return parts;
  }, [selectedShip, selectedSlot, previewBlueprints, upgradePartOptions, queue, filteredState]);

  // Preview stats for the selected slot + part hover
  const previewStats = useMemo(() => {
    if (!selectedShip || !previewBlueprints) return null;
    const bp = previewBlueprints[selectedShip];
    return bp?.computed ?? null;
  }, [selectedShip, previewBlueprints]);

  const selectShip = useCallback((shipType: ShipType) => {
    setSelectedShip(shipType);
    setSelectedSlot(null);
  }, []);

  const selectSlot = useCallback((slotIndex: number) => {
    setSelectedSlot(slotIndex);
  }, []);

  const selectPart = useCallback((partId: string | null) => {
    if (!selectedShip || selectedSlot === null) return;

    const activation: UpgradeActivation = {
      shipType: selectedShip,
      slotIndex: selectedSlot,
      partId,
    };

    const isPlacement = partId !== null;

    if (maxActivations === 1 && isPlacement) {
      // Single activation species placing a part — submit immediately
      submitAction({
        type: 'UPGRADE',
        activations: [activation],
      });
      setQueue([]);
      setSelectedShip(null);
      setSelectedSlot(null);
      return;
    }

    // Add to queue (removals are always free; only block if placements are maxed)
    setQueue(prev => {
      const currentPlacements = prev.filter(a => a.partId !== null).length;
      if (isPlacement && currentPlacements >= maxActivations) return prev;
      return [...prev, activation];
    });
    setSelectedSlot(null);
  }, [selectedShip, selectedSlot, maxActivations, submitAction]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    setSelectedSlot(null);
  }, []);

  // Check if all modified blueprints have valid energy/movement
  const canConfirm = useMemo(() => {
    if (queue.length === 0) return false;
    if (!previewBlueprints) return false;
    // Only check blueprints that were actually modified
    const modifiedShips = new Set(queue.map(a => a.shipType));
    for (const shipType of Array.from(modifiedShips)) {
      const bp = previewBlueprints[shipType];
      if (!bp || !isBlueprintValid(bp)) return false;
    }
    return true;
  }, [queue, previewBlueprints]);

  const confirm = useCallback(() => {
    if (!canConfirm) return;
    submitAction({
      type: 'UPGRADE',
      activations: queue,
    });
    setQueue([]);
    setSelectedShip(null);
    setSelectedSlot(null);
  }, [canConfirm, queue, submitAction]);

  const cancel = useCallback(() => {
    setQueue([]);
    setSelectedShip(null);
    setSelectedSlot(null);
    cancelAction();
  }, [cancelAction]);

  return {
    queue,
    maxActivations,
    placementCount,
    selectedShip,
    selectedSlot,
    previewBlueprints,
    availableShipTypes,
    availableSlots,
    availableParts,
    previewStats,
    canConfirm,
    selectShip,
    selectSlot,
    selectPart,
    removeFromQueue,
    confirm,
    cancel,
  };
}

import { useState, useCallback, useMemo, useEffect } from 'react';
import { SECTORS_BY_ID, SPECIES } from '@eclipse/shared';
import type { SectorDefinition } from '@eclipse/shared';
import { useGame } from '../context/GameContext';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';
import type { ActionFlowStep } from './useActionFlow';

interface ExploreActivationData {
  targetPosition: { q: number; r: number };
  decision: 'PLACE' | 'DISCARD';
  rotation?: number;
  takeInfluence?: boolean;
  sectorId?: string; // stored locally for ghost tile rendering
}

interface ExploreFlowState {
  selectedPosition: { q: number; r: number } | null;
  sectorDef: SectorDefinition | null;
  rotation: number;
  takeInfluence: boolean;
  completedActivations: ExploreActivationData[];
}

const INITIAL_FLOW: ExploreFlowState = {
  selectedPosition: null,
  sectorDef: null,
  rotation: 0,
  takeInfluence: true,
  completedActivations: [],
};

export function useExploreFlow(
  step: ActionFlowStep,
  advanceStep: (step: ActionFlowStep) => void,
  submitAction: (action: unknown) => void,
  cancelAction: () => void,
) {
  const { explorePeek, clearExplorePeek } = useGame();
  const { filteredState, explorePeekResult } = useGameState();
  const { explorePositions } = useLegalActions();

  const [flow, setFlow] = useState<ExploreFlowState>(INITIAL_FLOW);

  // Species activation limit
  const maxActivations = useMemo(() => {
    if (!filteredState) return 1;
    const speciesId = filteredState.you.speciesId;
    const species = SPECIES[speciesId];
    return species?.activationLimits?.explore ?? 1;
  }, [filteredState]);

  // Draco: can place influence disc on ancient sectors
  const isDraco = filteredState?.you.speciesId === 'descendants_of_draco';

  // Draco draws 2 tiles — skip peek/review and submit immediately
  const isDracoDoubleExplore = useMemo(() => {
    if (!filteredState) return false;
    const species = SPECIES[filteredState.you.speciesId];
    return species?.specialAbilities?.some(
      (a: { effectType: string }) => a.effectType === 'explore_draw_extra',
    ) ?? false;
  }, [filteredState]);

  const currentActivation = flow.completedActivations.length + 1;

  // Compute merged explore positions: server positions + new positions from placed ghost tiles
  const mergedExplorePositions = useMemo(() => {
    if (!filteredState) return explorePositions;
    if (flow.completedActivations.length === 0) return explorePositions;

    const boardSectors = filteredState.board.sectors;
    // Set of keys already occupied (board + completed placements, NOT discards)
    const occupiedKeys = new Set(Object.keys(boardSectors));
    const placedKeys = new Set<string>();
    for (const act of flow.completedActivations) {
      if (act.decision === 'PLACE') {
        const key = `${act.targetPosition.q},${act.targetPosition.r}`;
        placedKeys.add(key);
        occupiedKeys.add(key);
      }
    }

    // Start with server positions, minus ones already used
    const resultKeys = new Set<string>();
    const resultMap = new Map<string, { q: number; r: number }>();
    for (const pos of explorePositions) {
      const key = `${pos.q},${pos.r}`;
      if (!occupiedKeys.has(key)) {
        resultKeys.add(key);
        resultMap.set(key, pos);
      }
    }

    // For each completed PLACE activation, compute new valid neighbors
    const DIRS = [
      { q: 1, r: 0 },
      { q: 1, r: -1 },
      { q: 0, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: 0, r: 1 },
    ];

    for (const act of flow.completedActivations) {
      if (act.decision !== 'PLACE' || !act.sectorId) continue;
      const def = SECTORS_BY_ID[act.sectorId];
      if (!def) continue;

      const rotatedEdges = def.wormholes.edges.map(e => (e + (act.rotation ?? 0)) % 6);

      for (let edgeIdx = 0; edgeIdx < 6; edgeIdx++) {
        if (!rotatedEdges.includes(edgeIdx)) continue;
        const dir = DIRS[edgeIdx]!;
        const neighborPos = {
          q: act.targetPosition.q + dir.q,
          r: act.targetPosition.r + dir.r,
        };
        const neighborKey = `${neighborPos.q},${neighborPos.r}`;

        // Must be empty and not already in results
        if (occupiedKeys.has(neighborKey) || resultKeys.has(neighborKey)) continue;

        // Can't explore galactic center (distance 0 from origin)
        const dist = Math.max(
          Math.abs(neighborPos.q),
          Math.abs(neighborPos.r),
          Math.abs(-neighborPos.q - neighborPos.r),
        );
        if (dist === 0) continue;

        resultKeys.add(neighborKey);
        resultMap.set(neighborKey, neighborPos);
      }
    }

    return [...resultMap.values()];
  }, [explorePositions, flow.completedActivations, filteredState]);

  // When peek result arrives, advance to review step
  useEffect(() => {
    if (
      explorePeekResult &&
      step.type === 'EXPLORE_PICK_HEX' &&
      flow.selectedPosition &&
      explorePeekResult.position.q === flow.selectedPosition.q &&
      explorePeekResult.position.r === flow.selectedPosition.r
    ) {
      const def = SECTORS_BY_ID[explorePeekResult.sectorId];
      if (def) {
        setFlow(prev => ({ ...prev, sectorDef: def, rotation: 0, takeInfluence: true }));
        advanceStep({
          type: 'EXPLORE_REVIEW_TILE',
          tileId: explorePeekResult.sectorId,
          position: flow.selectedPosition,
        });
      }
    }
  }, [explorePeekResult, step.type, flow.selectedPosition, advanceStep]);

  // Build a merged sectors map that includes ghost-placed tiles from prior activations
  const sectorsWithGhosts = useMemo(() => {
    if (!filteredState) return {};
    if (flow.completedActivations.length === 0) return filteredState.board.sectors;

    const merged = { ...filteredState.board.sectors };
    for (const act of flow.completedActivations) {
      if (act.decision !== 'PLACE' || !act.sectorId) continue;
      const key = `${act.targetPosition.q},${act.targetPosition.r}`;
      merged[key] = {
        sectorId: act.sectorId,
        position: act.targetPosition,
        rotation: act.rotation ?? 0,
        influenceDisc: act.takeInfluence ? filteredState.you.id : null,
        ships: [],
        populations: [],
        structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
        discoveryTile: null,
        hasUnclaimedDiscovery: false,
        ancients: 0,
        hasWarpPortal: false,
      };
    }
    return merged;
  }, [filteredState, flow.completedActivations]);

  // Compute valid rotations for the current tile at the current position
  const validRotations = useMemo(() => {
    if (!flow.sectorDef || !flow.selectedPosition || !filteredState) return new Set<number>();
    const valid = new Set<number>();

    for (let rot = 0; rot < 6; rot++) {
      if (isValidRotation(
        flow.sectorDef,
        flow.selectedPosition,
        rot,
        sectorsWithGhosts,
        filteredState.you.id,
        false,
      )) {
        valid.add(rot);
      }
    }

    return valid;
  }, [flow.sectorDef, flow.selectedPosition, filteredState, sectorsWithGhosts]);

  // Compute best rotation: the valid rotation with the most wormhole connections
  // to adjacent occupied sectors (including NPCs/guardians, not just player-controlled)
  const bestRotation = useMemo(() => {
    if (!flow.sectorDef || !flow.selectedPosition || validRotations.size === 0) return null;
    let best = validRotations.values().next().value!;
    let bestScore = -1;

    for (const rot of Array.from(validRotations)) {
      const score = countConnections(
        flow.sectorDef,
        flow.selectedPosition,
        rot,
        sectorsWithGhosts,
      );
      if (score > bestScore) {
        bestScore = score;
        best = rot;
      }
    }
    return best;
  }, [flow.sectorDef, flow.selectedPosition, validRotations, sectorsWithGhosts]);

  // Auto-select best valid rotation when tile is revealed
  useEffect(() => {
    if (step.type === 'EXPLORE_REVIEW_TILE' && bestRotation !== null && !validRotations.has(flow.rotation)) {
      setFlow(prev => ({ ...prev, rotation: bestRotation }));
    }
  }, [step.type, bestRotation, validRotations, flow.rotation]);

  const selectHex = useCallback((position: { q: number; r: number }) => {
    // Draco double-explore: skip peek, submit immediately → engine sets EXPLORE_TILE_CHOICE sub-phase
    if (isDracoDoubleExplore && flow.completedActivations.length === 0) {
      submitAction({
        type: 'EXPLORE',
        activations: [{ targetPosition: position, decision: 'DISCARD' }],
      });
      setFlow(INITIAL_FLOW);
      clearExplorePeek();
      cancelAction();
      return;
    }
    setFlow(prev => ({ ...prev, selectedPosition: position }));
    explorePeek(position, flow.completedActivations.length > 0 ? flow.completedActivations : undefined);
  }, [explorePeek, flow.completedActivations, isDracoDoubleExplore, submitAction, clearExplorePeek, cancelAction]);

  const setRotation = useCallback((rot: number) => {
    setFlow(prev => ({ ...prev, rotation: rot }));
  }, []);

  const setTakeInfluence = useCallback((val: boolean) => {
    setFlow(prev => ({ ...prev, takeInfluence: val }));
  }, []);

  const confirmPlace = useCallback(() => {
    if (!flow.selectedPosition || !flow.sectorDef) return;

    const activation: ExploreActivationData = {
      targetPosition: flow.selectedPosition,
      decision: 'PLACE',
      rotation: flow.rotation,
      takeInfluence: flow.takeInfluence && (isDraco || (!flow.sectorDef.hasAncient && !(flow.sectorDef.ancientCount && flow.sectorDef.ancientCount > 0))),
      sectorId: flow.sectorDef.id,
    };

    const allActivations = [...flow.completedActivations, activation];

    if (allActivations.length < maxActivations) {
      // More activations available — loop back to pick hex
      setFlow({
        selectedPosition: null,
        sectorDef: null,
        rotation: 0,
        takeInfluence: true,
        completedActivations: allActivations,
      });
      clearExplorePeek();
      advanceStep({ type: 'EXPLORE_PICK_HEX' });
    } else {
      // All activations done — submit
      submitAction({
        type: 'EXPLORE',
        activations: allActivations,
      });
      setFlow(INITIAL_FLOW);
      clearExplorePeek();
    }
  }, [flow, maxActivations, advanceStep, submitAction, clearExplorePeek]);

  const confirmDiscard = useCallback(() => {
    if (!flow.selectedPosition) return;

    const activation: ExploreActivationData = {
      targetPosition: flow.selectedPosition,
      decision: 'DISCARD',
    };

    const allActivations = [...flow.completedActivations, activation];

    if (allActivations.length < maxActivations) {
      // More activations available — loop back
      setFlow({
        selectedPosition: null,
        sectorDef: null,
        rotation: 0,
        takeInfluence: true,
        completedActivations: allActivations,
      });
      clearExplorePeek();
      advanceStep({ type: 'EXPLORE_PICK_HEX' });
    } else {
      // Submit with all activations
      submitAction({
        type: 'EXPLORE',
        activations: allActivations,
      });
      setFlow(INITIAL_FLOW);
      clearExplorePeek();
    }
  }, [flow, maxActivations, advanceStep, submitAction, clearExplorePeek]);

  const cancel = useCallback(() => {
    setFlow(INITIAL_FLOW);
    clearExplorePeek();
    cancelAction();
  }, [clearExplorePeek, cancelAction]);

  // Ghost tile data for rendering on the board (current activation being reviewed)
  const ghostTile = useMemo(() => {
    if (!flow.sectorDef || !flow.selectedPosition) return null;
    if (step.type !== 'EXPLORE_REVIEW_TILE' && step.type !== 'EXPLORE_PICK_ROTATION') return null;
    return {
      sectorDef: flow.sectorDef,
      position: flow.selectedPosition,
      rotation: flow.rotation,
    };
  }, [flow.sectorDef, flow.selectedPosition, flow.rotation, step.type]);

  // Ghost tiles for previously completed PLACE activations (multi-activation, e.g. Planta)
  const completedGhostTiles = useMemo(() => {
    return flow.completedActivations
      .filter(a => a.decision === 'PLACE' && a.sectorId)
      .map(a => {
        const def = SECTORS_BY_ID[a.sectorId!];
        if (!def) return null;
        return {
          sectorDef: def,
          position: a.targetPosition,
          rotation: a.rotation ?? 0,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  }, [flow.completedActivations]);

  return {
    selectHex,
    setRotation,
    setTakeInfluence,
    confirmPlace,
    confirmDiscard,
    cancel,
    // State
    selectedPosition: flow.selectedPosition,
    sectorDef: flow.sectorDef,
    rotation: flow.rotation,
    takeInfluence: flow.takeInfluence,
    validRotations,
    ghostTile,
    completedGhostTiles,
    currentActivation,
    maxActivations,
    explorePositions: mergedExplorePositions,
    isPeeking: step.type === 'EXPLORE_PICK_HEX' && flow.selectedPosition !== null && !flow.sectorDef,
  };
}

/**
 * Check if a rotation creates a valid wormhole connection to an adjacent
 * player-controlled sector. This is a client-side check using filtered state.
 */
function isValidRotation(
  sectorDef: SectorDefinition,
  targetPos: { q: number; r: number },
  rotation: number,
  sectors: Record<string, { sectorId: string; position: { q: number; r: number }; rotation: number; influenceDisc: string | null; ships: readonly { owner: string }[] }>,
  playerId: string,
  hasWormholeGen: boolean,
): boolean {
  const rotatedEdges = sectorDef.wormholes.edges.map(e => (e + rotation) % 6);

  const DIRS = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  for (let edgeIdx = 0; edgeIdx < 6; edgeIdx++) {
    const dir = DIRS[edgeIdx]!;
    const neighborPos = { q: targetPos.q + dir.q, r: targetPos.r + dir.r };
    const neighborKey = `${neighborPos.q},${neighborPos.r}`;
    const neighbor = sectors[neighborKey];
    if (!neighbor) continue;

    // Must be player-controlled or have player ships
    const playerControls = neighbor.influenceDisc === playerId;
    const playerHasShips = neighbor.ships.some(s => s.owner === playerId);
    if (!playerControls && !playerHasShips) continue;

    const neighborDef = SECTORS_BY_ID[neighbor.sectorId];
    if (!neighborDef) continue;

    const newHasWormhole = rotatedEdges.includes(edgeIdx);
    const oppositeEdge = (edgeIdx + 3) % 6;
    const neighborRotatedEdges = neighborDef.wormholes.edges.map(
      (e: number) => (e + neighbor.rotation) % 6,
    );
    const neighborHasWormhole = neighborRotatedEdges.includes(oppositeEdge);

    if (hasWormholeGen) {
      if (newHasWormhole || neighborHasWormhole) return true;
    } else {
      if (newHasWormhole && neighborHasWormhole) return true;
    }
  }

  return false;
}

/**
 * Count how many adjacent occupied sectors this rotation creates full wormhole
 * connections to (both sides have matching wormholes). Counts ALL sectors,
 * not just player-controlled, so guardians/NPCs are included.
 */
function countConnections(
  sectorDef: SectorDefinition,
  targetPos: { q: number; r: number },
  rotation: number,
  sectors: Record<string, { sectorId: string; rotation: number }>,
): number {
  const rotatedEdges = sectorDef.wormholes.edges.map(e => (e + rotation) % 6);

  const DIRS = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  let count = 0;
  for (let edgeIdx = 0; edgeIdx < 6; edgeIdx++) {
    if (!rotatedEdges.includes(edgeIdx)) continue;

    const dir = DIRS[edgeIdx]!;
    const neighborPos = { q: targetPos.q + dir.q, r: targetPos.r + dir.r };
    const neighborKey = `${neighborPos.q},${neighborPos.r}`;
    const neighbor = sectors[neighborKey];
    if (!neighbor) continue;

    const neighborDef = SECTORS_BY_ID[neighbor.sectorId];
    if (!neighborDef) continue;

    const oppositeEdge = (edgeIdx + 3) % 6;
    const neighborRotatedEdges = neighborDef.wormholes.edges.map(
      (e: number) => (e + neighbor.rotation) % 6,
    );
    if (neighborRotatedEdges.includes(oppositeEdge)) {
      count++;
    }
  }

  return count;
}

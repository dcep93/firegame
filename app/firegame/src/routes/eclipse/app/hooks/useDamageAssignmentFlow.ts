import { useState, useCallback, useEffect, useMemo } from 'react';
import { useGameState } from './useGameState';

interface HitInfo {
  dieColor: string;
  damage: number;
  isBurst: boolean;
}

interface ShipInfo {
  shipId: string;
  shipType: string;
  damage: number;
  hullValue: number;
}

export interface DamageAssignmentFlowResult {
  /** True when damage assignment sub-phase is active for this player */
  active: boolean;
  sectorKey: string | null;
  hits: readonly HitInfo[];
  targetShips: readonly ShipInfo[];
  isMissile: boolean;
  /** Map of shipId → assigned hit indices */
  assignments: ReadonlyMap<string, readonly number[]>;
  /** Hit indices not yet assigned to any ship */
  unassignedHits: readonly number[];
  /** Currently selected (clicked) hit index, pending ship assignment */
  selectedHitIndex: number | null;
  selectHit: (hitIndex: number) => void;
  assignHitToShip: (hitIndex: number, shipId: string) => void;
  unassignHit: (hitIndex: number) => void;
  autoAssign: () => void;
  confirmAssignment: () => void;
  canConfirm: boolean;
}

export function useDamageAssignmentFlow(
  sendAction: (action: unknown) => void,
): DamageAssignmentFlowResult {
  const { legalActions } = useGameState();

  const damageData = legalActions?.damageAssignment ?? null;
  const active = damageData !== null;

  const sectorKey = active ? damageData.sectorKey : null;
  const hits: readonly HitInfo[] = active ? damageData.hits : [];
  const targetShips: readonly ShipInfo[] = active ? damageData.targetShips : [];
  const isMissile = active ? damageData.isMissile : false;

  const [assignments, setAssignments] = useState<Map<string, number[]>>(new Map());
  const [selectedHitIndex, setSelectedHitIndex] = useState<number | null>(null);

  // Reset when data changes
  const fingerprint = active
    ? `${sectorKey}:${hits.length}:${targetShips.map(s => s.shipId).join(',')}`
    : '';
  useEffect(() => {
    setAssignments(new Map());
    setSelectedHitIndex(null);
  }, [fingerprint]);

  const unassignedHits = useMemo(() => {
    const assigned = new Set<number>();
    for (const indices of Array.from(assignments.values())) {
      for (const idx of indices) assigned.add(idx);
    }
    const result: number[] = [];
    for (let i = 0; i < hits.length; i++) {
      if (!assigned.has(i)) result.push(i);
    }
    return result;
  }, [assignments, hits.length]);

  const selectHit = useCallback((hitIndex: number) => {
    setSelectedHitIndex(prev => prev === hitIndex ? null : hitIndex);
  }, []);

  const assignHitToShip = useCallback((hitIndex: number, shipId: string) => {
    setAssignments(prev => {
      const next = new Map(prev);
      // Remove from any current assignment
      for (const [key, indices] of Array.from(next.entries())) {
        const filtered = indices.filter(i => i !== hitIndex);
        if (filtered.length !== indices.length) {
          if (filtered.length === 0) {
            next.delete(key);
          } else {
            next.set(key, filtered);
          }
        }
      }
      // Add to target ship
      const existing = next.get(shipId) ?? [];
      next.set(shipId, [...existing, hitIndex]);
      return next;
    });
    setSelectedHitIndex(null);
  }, []);

  const unassignHit = useCallback((hitIndex: number) => {
    setAssignments(prev => {
      const next = new Map(prev);
      for (const [key, indices] of Array.from(next.entries())) {
        const filtered = indices.filter(i => i !== hitIndex);
        if (filtered.length !== indices.length) {
          if (filtered.length === 0) {
            next.delete(key);
          } else {
            next.set(key, filtered);
          }
        }
      }
      return next;
    });
  }, []);

  const autoAssign = useCallback(() => {
    if (!active || targetShips.length === 0) return;
    // Simple auto-assign: put all hits on the first ship
    const allIndices = hits.map((_, i) => i);
    setAssignments(new Map([[targetShips[0]!.shipId, allIndices]]));
    setSelectedHitIndex(null);
  }, [active, hits, targetShips]);

  const canConfirm = active && unassignedHits.length === 0;

  const confirmAssignment = useCallback(() => {
    if (!canConfirm) return;
    const actionAssignments: { targetShipId: string; hitIndices: number[] }[] = [];
    for (const [shipId, indices] of Array.from(assignments.entries())) {
      if (indices.length > 0) {
        actionAssignments.push({ targetShipId: shipId, hitIndices: indices });
      }
    }
    sendAction({
      type: 'DAMAGE_ASSIGNMENT',
      assignments: actionAssignments,
    });
  }, [canConfirm, assignments, sendAction]);

  return {
    active,
    sectorKey,
    hits,
    targetShips,
    isMissile,
    assignments,
    unassignedHits,
    selectedHitIndex,
    selectHit,
    assignHitToShip,
    unassignHit,
    autoAssign,
    confirmAssignment,
    canConfirm,
  };
}

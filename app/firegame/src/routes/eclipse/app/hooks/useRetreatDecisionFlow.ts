import { useState, useCallback, useEffect, useMemo } from 'react';
import { useGameState } from './useGameState';
import type { HexCoord } from '@eclipse/shared';

interface ShipInfo {
  shipId: string;
  shipType: string;
  damage: number;
  hullValue: number;
}

export interface RetreatDecisionFlowResult {
  /** True when retreat sub-phase is active for this player */
  active: boolean;
  sectorKey: string | null;
  validTargets: readonly HexCoord[];
  playerShips: readonly ShipInfo[];
  selectedShipIds: Set<string>;
  selectedTarget: HexCoord | null;
  toggleShip: (id: string) => void;
  selectAllShips: () => void;
  deselectAllShips: () => void;
  selectTarget: (hex: HexCoord) => void;
  confirmRetreat: () => void;
  continueFighting: () => void;
  canConfirmRetreat: boolean;
}

export function useRetreatDecisionFlow(
  sendAction: (action: unknown) => void,
): RetreatDecisionFlowResult {
  const { legalActions } = useGameState();

  const retreatData = legalActions?.retreatDecision ?? null;
  const active = retreatData !== null;

  const sectorKey = active ? retreatData.sectorKey : null;
  const validTargets: readonly HexCoord[] = useMemo(
    () => (active ? retreatData.validTargets : []),
    [active, retreatData],
  );
  const playerShips: readonly ShipInfo[] = useMemo(
    () => (active ? retreatData.playerShips : []),
    [active, retreatData],
  );

  const [selectedShipIds, setSelectedShipIds] = useState<Set<string>>(new Set());
  const [selectedTarget, setSelectedTarget] = useState<HexCoord | null>(null);

  // Reset selection when retreat data changes
  const fingerprint = active ? `${sectorKey}:${playerShips.map(s => s.shipId).join(',')}` : '';
  useEffect(() => {
    setSelectedShipIds(new Set());
    if (validTargets.length === 1) {
      setSelectedTarget(validTargets[0]!);
    } else {
      setSelectedTarget(null);
    }
  }, [fingerprint]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleShip = useCallback((id: string) => {
    setSelectedShipIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAllShips = useCallback(() => {
    setSelectedShipIds(new Set(playerShips.map(s => s.shipId)));
  }, [playerShips]);

  const deselectAllShips = useCallback(() => {
    setSelectedShipIds(new Set());
  }, []);

  const selectTarget = useCallback((hex: HexCoord) => {
    setSelectedTarget(hex);
  }, []);

  const canConfirmRetreat = active && selectedShipIds.size > 0 && selectedTarget !== null;

  const confirmRetreat = useCallback(() => {
    if (!canConfirmRetreat) return;
    sendAction({
      type: 'RETREAT_DECISION',
      retreatingShipIds: Array.from(selectedShipIds),
      retreatTarget: selectedTarget,
    });
  }, [canConfirmRetreat, selectedShipIds, selectedTarget, sendAction]);

  const continueFighting = useCallback(() => {
    if (!active) return;
    sendAction({
      type: 'RETREAT_DECISION',
      retreatingShipIds: [],
      retreatTarget: null,
    });
  }, [active, sendAction]);

  return {
    active,
    sectorKey,
    validTargets,
    playerShips,
    selectedShipIds,
    selectedTarget,
    toggleShip,
    selectAllShips,
    deselectAllShips,
    selectTarget,
    confirmRetreat,
    continueFighting,
    canConfirmRetreat,
  };
}

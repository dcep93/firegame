import { useState, useCallback, useMemo, useEffect } from 'react';
import { SECTORS_BY_ID } from '@eclipse/shared';
import { useGameState } from './useGameState';

interface InfluenceSectorChoiceFlowResult {
  active: boolean;
  eligibleSectors: Array<{ key: string; label: string; position: { q: number; r: number } }>;
  selectedKeys: Set<string>;
  highlightedSectors: Array<{ q: number; r: number }>;
  toggleSector: (key: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  confirm: () => void;
  decline: () => void;
}

export function useInfluenceSectorChoiceFlow(
  sendAction: (action: unknown) => void,
): InfluenceSectorChoiceFlowResult {
  const { filteredState, playerId } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'INFLUENCE_SECTOR_CHOICE' &&
    subPhase.playerId === playerId;

  const eligibleKeys: readonly string[] = active
    ? (subPhase as { eligibleSectors: readonly string[] }).eligibleSectors
    : [];

  // Build rich sector info
  const eligibleSectors = useMemo(() => {
    if (!filteredState || eligibleKeys.length === 0) return [];
    return eligibleKeys.map(key => {
      const sector = filteredState.board.sectors[key];
      const def = sector ? SECTORS_BY_ID[sector.sectorId] : null;
      const id = sector?.sectorId ?? key;
      const position = sector?.position ?? { q: 0, r: 0 };
      return { key, label: `Sector ${id}`, position };
    });
  }, [filteredState, eligibleKeys]);

  // Track selection — start with all eligible selected
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Reset selection when sub-phase changes (new set of eligible sectors)
  const eligibleFingerprint = eligibleKeys.join(',');
  useEffect(() => {
    setSelectedKeys(new Set(eligibleKeys));
  }, [eligibleFingerprint]); // eslint-disable-line react-hooks/exhaustive-deps

  const highlightedSectors = useMemo(() => {
    return eligibleSectors.map(s => s.position);
  }, [eligibleSectors]);

  const toggleSector = useCallback((key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedKeys(new Set(eligibleKeys));
  }, [eligibleKeys]);

  const deselectAll = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  const confirm = useCallback(() => {
    sendAction({
      type: 'INFLUENCE_SECTOR_CHOICE',
      sectorKeys: Array.from(selectedKeys),
    });
  }, [selectedKeys, sendAction]);

  const decline = useCallback(() => {
    sendAction({
      type: 'INFLUENCE_SECTOR_CHOICE',
      sectorKeys: [],
    });
  }, [sendAction]);

  return {
    active,
    eligibleSectors,
    selectedKeys,
    highlightedSectors,
    toggleSector,
    selectAll,
    deselectAll,
    confirm,
    decline,
  };
}

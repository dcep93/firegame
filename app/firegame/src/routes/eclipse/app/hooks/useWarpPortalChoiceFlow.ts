import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGameState } from './useGameState';

interface WarpPortalChoiceFlowResult {
  active: boolean;
  eligibleSectors: Array<{ key: string; label: string; position: { q: number; r: number } }>;
  selectedKey: string | null;
  highlightedSectors: Array<{ q: number; r: number }>;
  selectSector: (key: string) => void;
  confirm: () => void;
}

export function useWarpPortalChoiceFlow(
  sendAction: (action: unknown) => void,
): WarpPortalChoiceFlowResult {
  const { filteredState, playerId } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'WARP_PORTAL_CHOICE' &&
    subPhase.playerId === playerId;

  const eligibleKeys: readonly string[] = useMemo(
    () => active
      ? (subPhase as { eligibleSectors: readonly string[] }).eligibleSectors
      : [],
    [active, subPhase],
  );

  const eligibleSectors = useMemo(() => {
    if (!filteredState || eligibleKeys.length === 0) return [];
    return eligibleKeys.map(key => {
      const sector = filteredState.board.sectors[key];
      const id = sector?.sectorId ?? key;
      const position = sector?.position ?? { q: 0, r: 0 };
      return { key, label: `Sector ${id}`, position };
    });
  }, [filteredState, eligibleKeys]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Reset selection when sub-phase changes
  const eligibleFingerprint = eligibleKeys.join(',');
  useEffect(() => {
    setSelectedKey(null);
  }, [eligibleFingerprint]);

  const highlightedSectors = useMemo(() => {
    return eligibleSectors.map(s => s.position);
  }, [eligibleSectors]);

  const selectSector = useCallback((key: string) => {
    if (eligibleKeys.includes(key)) {
      setSelectedKey(prev => prev === key ? null : key);
    }
  }, [eligibleKeys]);

  const confirm = useCallback(() => {
    if (selectedKey) {
      sendAction({
        type: 'WARP_PORTAL_CHOICE',
        sectorKey: selectedKey,
      });
    }
  }, [selectedKey, sendAction]);

  return {
    active,
    eligibleSectors,
    selectedKey,
    highlightedSectors,
    selectSector,
    confirm,
  };
}

import { useState, useCallback, useMemo, useEffect } from 'react';
import { SECTORS_BY_ID, PopulationSquareType, INFLUENCE_UPKEEP_TRACK, MONEY_PRODUCTION_TRACK, ResourceType } from '@eclipse/shared';
import type { ReturnTrackOverride } from '@eclipse/shared';
import { useGameState } from './useGameState';

interface SectorInfo {
  key: string;
  label: string;
  position: { q: number; r: number };
  populations: readonly { slotIndex: number; sourceTrack: string; isWild: boolean }[];
  hasOrbitalPop: boolean;
  orbitalTrack: ResourceType | null;
}

export interface BankruptcyTrackChoiceEntry {
  readonly slotIndex: number; // -1 for orbital
  readonly label: string;
  readonly defaultTrack: ResourceType;
  readonly selectedTrack: ResourceType;
  readonly allowedTracks: readonly ResourceType[];
}

export interface BankruptcyTradeState {
  readonly resource: ResourceType;
  readonly amount: number;
}

interface BankruptcyFlowResult {
  active: boolean;
  deficit: number;
  controlledSectors: SectorInfo[];
  selectedKeys: Set<string>;
  /** Inline track choices per sector (only for sectors with wild/orbital cubes) */
  sectorTrackChoices: Map<string, BankruptcyTrackChoiceEntry[]>;
  toggleSector: (key: string) => void;
  updateTrackChoice: (sectorKey: string, slotIndex: number, track: ResourceType) => void;
  confirm: () => void;
  // Trade support
  trades: Map<ResourceType, number>;
  setTrade: (resource: ResourceType, amount: number) => void;
  tradeRate: number;
  moneyFromTrades: number;
  availableResources: readonly { resource: ResourceType; available: number }[];
  // Projected balance
  upkeepSavings: number;
  productionLoss: number;
  /** Remaining capacity per track after accounting for all returning cubes */
  trackCapacity: Readonly<Record<ResourceType, number>>;
  /** Sectors that can't be selected because a non-wild cube's track is full */
  disabledSectorKeys: Set<string>;
  projectedBalance: number;
  isResolutionValid: boolean;
}

const ALL_RESOURCE_TRACKS: readonly ResourceType[] = [ResourceType.Money, ResourceType.Science, ResourceType.Materials];
const ORBITAL_TRACKS: readonly ResourceType[] = [ResourceType.Science, ResourceType.Money];

export function useBankruptcyFlow(
  sendAction: (action: unknown) => void,
): BankruptcyFlowResult {
  const { filteredState, legalActions, playerId } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'BANKRUPTCY_RESOLUTION' &&
    subPhase.playerId === playerId;

  const deficit = active
    ? Math.abs(Math.min(filteredState?.you.resources.money ?? 0, 0))
    : 0;

  const tradeInfo = legalActions?.bankruptcyTradeInfo ?? null;
  const tradeRate = tradeInfo?.tradeRate ?? 3;
  const availableResources = tradeInfo?.availableResources ?? [];

  // Build list of controlled sectors
  const controlledSectors = useMemo(() => {
    if (!filteredState || !active) return [];
    const sectors: SectorInfo[] = [];
    for (const [key, sector] of Object.entries(filteredState.board.sectors)) {
      if (sector.influenceDisc !== playerId) continue;
      const sectorDef = SECTORS_BY_ID[sector.sectorId];
      sectors.push({
        key,
        label: `Sector ${sector.sectorId}`,
        position: sector.position,
        populations: sector.populations.map(pop => ({
          slotIndex: pop.slotIndex,
          sourceTrack: pop.sourceTrack,
          isWild: sectorDef?.populationSquares[pop.slotIndex]?.type === PopulationSquareType.Wild,
        })),
        hasOrbitalPop: !!sector.structures.orbitalPopulation,
        orbitalTrack: sector.structures.orbitalPopulation?.track ?? null,
      });
    }
    return sectors;
  }, [filteredState, active, playerId]);

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [sectorTrackChoices, setSectorTrackChoices] = useState<Map<string, BankruptcyTrackChoiceEntry[]>>(new Map());
  const [trades, setTrades] = useState<Map<ResourceType, number>>(new Map());

  // Reset selection when sub-phase appears
  const fingerprint = active ? `bankruptcy:${playerId}` : '';
  useEffect(() => {
    setSelectedKeys(new Set());
    setSectorTrackChoices(new Map());
    setTrades(new Map());
  }, [fingerprint]);

  const moneyFromTrades = useMemo(() => {
    let total = 0;
    for (const [, amount] of Array.from(trades.entries())) {
      total += Math.floor(amount / tradeRate);
    }
    return total;
  }, [trades, tradeRate]);

  // Compute upkeep savings from abandoning selected sectors.
  // Mirrors engine's getUpkeepCost which indexes by discsPlaced directly.
  const upkeepSavings = useMemo(() => {
    if (!active || !filteredState || selectedKeys.size === 0) return 0;
    const discs = filteredState.you.influenceDiscs;
    const discsPlaced = discs.onSectors + discs.onActions + discs.onReactions;
    const newDiscsPlaced = discsPlaced - selectedKeys.size;
    const oldUpkeep =
      INFLUENCE_UPKEEP_TRACK[discsPlaced] ??
      INFLUENCE_UPKEEP_TRACK[INFLUENCE_UPKEEP_TRACK.length - 1]!;
    const newUpkeep =
      INFLUENCE_UPKEEP_TRACK[Math.max(0, newDiscsPlaced)] ??
      INFLUENCE_UPKEEP_TRACK[0]!;
    return newUpkeep - oldUpkeep; // positive value (less negative upkeep)
  }, [active, filteredState, selectedKeys.size]);

  // Compute money production loss from returning cubes to the money track.
  // Uses sectorTrackChoices for wild/orbital cubes to reflect user's actual choice.
  // Count cubes returning to the money track for a given sector,
  // using track choices for wild/orbital cubes.
  const countMoneyCubes = useCallback((sector: SectorInfo, choices: BankruptcyTrackChoiceEntry[] | undefined) => {
    let count = 0;
    // Track which slotIndices have explicit choices (wild pops + orbital)
    const choiceBySlot = new Map<number, BankruptcyTrackChoiceEntry>();
    if (choices) {
      for (const c of choices) {
        choiceBySlot.set(c.slotIndex, c);
      }
    }
    // Regular + wild pops
    for (const pop of sector.populations) {
      const choice = choiceBySlot.get(pop.slotIndex);
      const returnTrack = choice ? choice.selectedTrack : pop.sourceTrack;
      if (returnTrack === 'money') count++;
    }
    // Orbital pop (slotIndex -1 by convention)
    const orbitalChoice = choiceBySlot.get(-1);
    if (orbitalChoice) {
      // Has an explicit track choice entry → use selectedTrack
      if (orbitalChoice.selectedTrack === 'money') count++;
    } else if (sector.hasOrbitalPop && sector.orbitalTrack === 'money') {
      // No choice entry but orbital exists and defaults to money
      count++;
    }
    return count;
  }, []);

  // Compute remaining capacity per track after all returning cubes.
  // Used to disable track choice buttons when a track is full.
  const trackCapacity = useMemo<Readonly<Record<ResourceType, number>>>(() => {
    const cap: Record<ResourceType, number> = { money: 0, science: 0, materials: 0 };
    if (!active || !filteredState || selectedKeys.size === 0) return cap;
    // Count empty slots per track
    for (const track of ALL_RESOURCE_TRACKS) {
      for (const present of filteredState.you.populationTracks[track]) {
        if (!present) cap[track]++;
      }
    }
    // Subtract all cubes returning to each track
    for (const key of Array.from(selectedKeys)) {
      const sector = controlledSectors.find(s => s.key === key);
      if (!sector) continue;
      const choices = sectorTrackChoices.get(key);
      const choiceBySlot = new Map<number, BankruptcyTrackChoiceEntry>();
      if (choices) for (const c of choices) choiceBySlot.set(c.slotIndex, c);
      for (const pop of sector.populations) {
        const choice = choiceBySlot.get(pop.slotIndex);
        const t = (choice ? choice.selectedTrack : pop.sourceTrack) as ResourceType;
        cap[t]--;
      }
      const orbChoice = choiceBySlot.get(-1);
      if (orbChoice) {
        cap[orbChoice.selectedTrack]--;
      } else if (sector.hasOrbitalPop && sector.orbitalTrack) {
        cap[sector.orbitalTrack]--;
      }
    }
    return cap;
  }, [active, filteredState, selectedKeys, controlledSectors, sectorTrackChoices]);

  // Sectors that can't be selected: they have non-wild cubes whose track is full.
  // Wild/orbital cubes are exempt since they can be redirected.
  const disabledSectorKeys = useMemo<Set<string>>(() => {
    const disabled = new Set<string>();
    if (!active || selectedKeys.size === 0) return disabled;
    for (const sector of controlledSectors) {
      if (selectedKeys.has(sector.key)) continue;
      // Count non-wild cubes per track
      const needed: Record<ResourceType, number> = { money: 0, science: 0, materials: 0 };
      for (const pop of sector.populations) {
        if (!pop.isWild) {
          needed[pop.sourceTrack as ResourceType]++;
        }
      }
      // If any non-wild track needs more slots than available, block the sector
      for (const track of ALL_RESOURCE_TRACKS) {
        if (needed[track] > 0 && trackCapacity[track] < needed[track]) {
          disabled.add(sector.key);
          break;
        }
      }
    }
    return disabled;
  }, [active, selectedKeys, controlledSectors, trackCapacity]);

  const productionLoss = useMemo(() => {
    if (!active || !filteredState || selectedKeys.size === 0) return 0;
    const moneyTrack = filteredState.you.populationTracks.money;
    let removedCount = 0;
    for (const present of moneyTrack) {
      if (!present) removedCount++;
    }
    let cubesReturning = 0;
    for (const key of Array.from(selectedKeys)) {
      const sector = controlledSectors.find(s => s.key === key);
      if (!sector) continue;
      cubesReturning += countMoneyCubes(sector, sectorTrackChoices.get(key));
    }
    if (cubesReturning === 0) return 0;
    const oldProduction = MONEY_PRODUCTION_TRACK[removedCount] ?? 0;
    const newProduction = MONEY_PRODUCTION_TRACK[Math.max(0, removedCount - cubesReturning)] ?? 0;
    return oldProduction - newProduction;
  }, [active, filteredState, selectedKeys, controlledSectors, sectorTrackChoices, countMoneyCubes]);

  const currentMoney = active ? (filteredState?.you.resources.money ?? 0) : 0;
  const projectedBalance = currentMoney + moneyFromTrades + upkeepSavings - productionLoss;
  const isResolutionValid =
    projectedBalance >= 0 ||
    selectedKeys.size === controlledSectors.length; // abandoning everything → elimination

  const setTrade = useCallback((resource: ResourceType, amount: number) => {
    setTrades(prev => {
      const next = new Map(prev);
      if (amount <= 0) {
        next.delete(resource);
      } else {
        next.set(resource, amount);
      }
      return next;
    });
  }, []);

  // Build track choice entries for a sector (only if it has wild/orbital cubes)
  const buildChoicesForSector = useCallback((sector: SectorInfo): BankruptcyTrackChoiceEntry[] | null => {
    const entries: BankruptcyTrackChoiceEntry[] = [];
    for (const pop of sector.populations) {
      if (pop.isWild) {
        entries.push({
          slotIndex: pop.slotIndex,
          label: 'Wild cube',
          defaultTrack: pop.sourceTrack as ResourceType,
          selectedTrack: pop.sourceTrack as ResourceType,
          allowedTracks: ALL_RESOURCE_TRACKS,
        });
      }
    }
    if (sector.hasOrbitalPop && sector.orbitalTrack) {
      entries.push({
        slotIndex: -1,
        label: 'Orbital cube',
        defaultTrack: sector.orbitalTrack,
        selectedTrack: sector.orbitalTrack,
        allowedTracks: ORBITAL_TRACKS,
      });
    }
    return entries.length > 0 ? entries : null;
  }, []);

  const toggleSector = useCallback((key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        // Remove inline track choices when deselecting
        setSectorTrackChoices(prevChoices => {
          if (!prevChoices.has(key)) return prevChoices;
          const nextChoices = new Map(prevChoices);
          nextChoices.delete(key);
          return nextChoices;
        });
      } else {
        next.add(key);
        // Auto-populate track choices for sectors with wild/orbital cubes
        const sector = controlledSectors.find(s => s.key === key);
        if (sector) {
          const entries = buildChoicesForSector(sector);
          if (entries) {
            setSectorTrackChoices(prevChoices => {
              const nextChoices = new Map(prevChoices);
              nextChoices.set(key, entries);
              return nextChoices;
            });
          }
        }
      }
      return next;
    });
  }, [controlledSectors, buildChoicesForSector]);

  const updateTrackChoice = useCallback((sectorKey: string, slotIndex: number, track: ResourceType) => {
    setSectorTrackChoices(prev => {
      const entries = prev.get(sectorKey);
      if (!entries) return prev;
      const next = new Map(prev);
      next.set(sectorKey, entries.map(e =>
        e.slotIndex === slotIndex ? { ...e, selectedTrack: track } : e,
      ));
      return next;
    });
  }, []);

  const buildTradesPayload = useCallback(() => {
    const tradesList: { fromResource: ResourceType; amount: number }[] = [];
    for (const [resource, amount] of Array.from(trades.entries())) {
      if (amount > 0) {
        tradesList.push({ fromResource: resource, amount });
      }
    }
    return tradesList.length > 0 ? tradesList : undefined;
  }, [trades]);

  // Submit with inline track choices
  const confirm = useCallback(() => {
    const overrides: Record<string, ReturnTrackOverride[]> = {};
    for (const [sectorKey, entries] of Array.from(sectorTrackChoices.entries())) {
      const sectorOverrides = entries
        .filter(e => e.selectedTrack !== e.defaultTrack)
        .map(e => ({ slotIndex: e.slotIndex, track: e.selectedTrack }));
      if (sectorOverrides.length > 0) {
        overrides[sectorKey] = sectorOverrides;
      }
    }
    sendAction({
      type: 'BANKRUPTCY_RESOLUTION',
      abandonedSectors: Array.from(selectedKeys),
      ...(Object.keys(overrides).length > 0 ? { returnTrackOverrides: overrides } : {}),
      trades: buildTradesPayload(),
    });
  }, [selectedKeys, sectorTrackChoices, sendAction, buildTradesPayload]);

  return {
    active,
    deficit,
    controlledSectors,
    selectedKeys,
    sectorTrackChoices,
    toggleSector,
    updateTrackChoice,
    confirm,
    trades,
    setTrade,
    tradeRate,
    moneyFromTrades,
    availableResources,
    upkeepSavings,
    productionLoss,
    trackCapacity,
    disabledSectorKeys,
    projectedBalance,
    isResolutionValid,
  };
}

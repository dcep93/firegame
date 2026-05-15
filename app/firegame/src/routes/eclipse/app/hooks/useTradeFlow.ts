import { useState, useCallback, useMemo } from 'react';
import { SPECIES } from '@eclipse/shared';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';

export type TradeResource = 'materials' | 'science' | 'money';

export interface TradeFlowResult {
  active: boolean;
  selectedFromResource: TradeResource | null;
  selectedToResource: TradeResource | null;
  amount: number;
  maxAmount: number;
  tradeRate: number;
  gained: number;
  availableFromResources: { resource: TradeResource; available: number }[];
  availableToResources: TradeResource[];
  startFlow: () => void;
  selectFromResource: (resource: TradeResource) => void;
  selectToResource: (resource: TradeResource) => void;
  setAmount: (amount: number) => void;
  confirm: () => void;
  cancelFlow: () => void;
}

export function useTradeFlow(
  sendAction: (action: unknown) => void,
): TradeFlowResult {
  const { filteredState } = useGameState();
  const { canTrade } = useLegalActions();

  const [active, setActive] = useState(false);
  const [selectedFromResource, setSelectedFromResource] = useState<TradeResource | null>(null);
  const [selectedToResource, setSelectedToResource] = useState<TradeResource | null>(null);
  const [amount, setAmountState] = useState(1);

  const tradeRate = useMemo(() => {
    if (!filteredState) return 3;
    const species = SPECIES[filteredState.you.speciesId];
    return species?.tradeRate ?? 3;
  }, [filteredState]);

  const availableFromResources = useMemo(() => {
    if (!filteredState || !active) return [];
    const res: { resource: TradeResource; available: number }[] = [];
    if (filteredState.you.resources.materials >= 1) {
      res.push({ resource: 'materials', available: filteredState.you.resources.materials });
    }
    if (filteredState.you.resources.science >= 1) {
      res.push({ resource: 'science', available: filteredState.you.resources.science });
    }
    if (filteredState.you.resources.money >= 1) {
      res.push({ resource: 'money', available: filteredState.you.resources.money });
    }
    return res;
  }, [filteredState, active]);

  const availableToResources = useMemo(() => {
    if (!selectedFromResource) return [];
    const all: TradeResource[] = ['materials', 'science', 'money'];
    return all.filter(r => r !== selectedFromResource);
  }, [selectedFromResource]);

  const maxAmount = useMemo(() => {
    if (!filteredState || !selectedFromResource) return 0;
    return filteredState.you.resources[selectedFromResource];
  }, [filteredState, selectedFromResource]);

  const gained = useMemo(() => {
    return Math.floor(amount / tradeRate);
  }, [amount, tradeRate]);

  const startFlow = useCallback(() => {
    if (!canTrade) return;
    setActive(true);
    setSelectedFromResource(null);
    setSelectedToResource(null);
    setAmountState(1);
  }, [canTrade]);

  const selectFromResource = useCallback((resource: TradeResource) => {
    setSelectedFromResource(resource);
    setSelectedToResource(null);
    setAmountState(prev => Math.min(prev, filteredState?.you.resources[resource] ?? 1));
  }, [filteredState]);

  const selectToResource = useCallback((resource: TradeResource) => {
    setSelectedToResource(resource);
  }, []);

  const setAmount = useCallback((val: number) => {
    const clamped = Math.max(1, Math.min(val, maxAmount));
    setAmountState(clamped);
  }, [maxAmount]);

  const confirm = useCallback(() => {
    if (!selectedFromResource || !selectedToResource || amount < 1) return;
    sendAction({
      type: 'TRADE',
      fromResource: selectedFromResource,
      toResource: selectedToResource,
      amount,
    });
    setActive(false);
    setSelectedFromResource(null);
    setSelectedToResource(null);
    setAmountState(1);
  }, [selectedFromResource, selectedToResource, amount, sendAction]);

  const cancelFlow = useCallback(() => {
    setActive(false);
    setSelectedFromResource(null);
    setSelectedToResource(null);
    setAmountState(1);
  }, []);

  return {
    active,
    selectedFromResource,
    selectedToResource,
    amount,
    maxAmount,
    tradeRate,
    gained,
    availableFromResources,
    availableToResources,
    startFlow,
    selectFromResource,
    selectToResource,
    setAmount,
    confirm,
    cancelFlow,
  };
}

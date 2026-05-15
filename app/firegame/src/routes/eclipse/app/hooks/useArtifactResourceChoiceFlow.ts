import { useState, useCallback, useEffect } from 'react';
import { useGameState } from './useGameState';

interface ArtifactResourceChoiceFlowResult {
  active: boolean;
  totalResources: number;
  increment: number;
  money: number;
  materials: number;
  science: number;
  remaining: number;
  canConfirm: boolean;
  setResource: (type: 'money' | 'materials' | 'science', value: number) => void;
  confirm: () => void;
}

export function useArtifactResourceChoiceFlow(
  sendAction: (action: unknown) => void,
): ArtifactResourceChoiceFlowResult {
  const { filteredState, legalActions, playerId } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'ARTIFACT_RESOURCE_CHOICE' &&
    subPhase.playerId === playerId;

  const choiceInfo = (legalActions as Record<string, unknown> | null)?.artifactResourceChoice as {
    totalResources: number;
    increment: number;
  } | null;

  const totalResources = choiceInfo?.totalResources ?? 0;
  const increment = choiceInfo?.increment ?? 5;

  const [money, setMoney] = useState(0);
  const [materials, setMaterials] = useState(0);
  const [science, setScience] = useState(0);

  // Reset when sub-phase activates/changes
  useEffect(() => {
    setMoney(0);
    setMaterials(0);
    setScience(0);
  }, [active, totalResources]);

  const remaining = totalResources - money - materials - science;
  const canConfirm = remaining === 0 && active;

  const setResource = useCallback((type: 'money' | 'materials' | 'science', value: number) => {
    // Clamp to non-negative multiples of increment
    const clamped = Math.max(0, Math.round(value / increment) * increment);

    if (type === 'money') {
      const maxForThis = totalResources - materials - science;
      setMoney(Math.min(clamped, maxForThis));
    } else if (type === 'materials') {
      const maxForThis = totalResources - money - science;
      setMaterials(Math.min(clamped, maxForThis));
    } else {
      const maxForThis = totalResources - money - materials;
      setScience(Math.min(clamped, maxForThis));
    }
  }, [increment, totalResources, money, materials, science]);

  const confirm = useCallback(() => {
    if (canConfirm) {
      sendAction({
        type: 'ARTIFACT_RESOURCE_CHOICE',
        money,
        materials,
        science,
      });
    }
  }, [canConfirm, money, materials, science, sendAction]);

  return {
    active,
    totalResources,
    increment,
    money,
    materials,
    science,
    remaining,
    canConfirm,
    setResource,
    confirm,
  };
}

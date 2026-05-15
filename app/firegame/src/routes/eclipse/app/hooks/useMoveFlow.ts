import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { SPECIES } from '@eclipse/shared';
import type { HexCoord } from '@eclipse/shared';
import { useGameState } from './useGameState';
import { useLegalActions } from './useLegalActions';
import { useGame } from '../context/GameContext';
import type { ActionFlowStep } from './useActionFlow';

export interface MovableShip {
  shipId: string;
  shipType: string;
  owner: string;
  position: HexCoord;
  positionKey: string;
}

export interface MoveFlowResult {
  maxActivations: number;
  activationsUsed: number;
  isContinuation: boolean;
  selectedShipId: string | null;
  movableShips: { sectorKey: string; position: HexCoord; ships: MovableShip[] }[];
  validDestinations: HexCoord[];
  selectShip: (shipId: string) => void;
  selectDestination: (position: HexCoord) => void;
  finishMove: () => void;
  cancel: () => void;
  canFinishMove: boolean;
  pendingAggressionMove: { allyId: string } | null;
  confirmAggression: () => void;
  cancelAggression: () => void;
}

export function useMoveFlow(
  step: ActionFlowStep,
  advanceStep: (nextStep: ActionFlowStep) => void,
  submitAction: (action: unknown) => void,
  cancelAction: () => void,
  reactionMode?: boolean,
): MoveFlowResult {
  const { filteredState } = useGameState();
  const { moveOptions, moveContinuation, canFinishMove } = useLegalActions();
  const { sendAction } = useGame();

  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [pendingAggressionMove, setPendingAggressionMove] = useState<{
    action: unknown;
    allyId: string;
    multi: boolean;
  } | null>(null);
  const wasInContinuationRef = useRef(false);

  const isActive = step.type === 'MOVE_PICK_SHIP' || step.type === 'MOVE_PICK_PATH';
  const isContinuation = canFinishMove;

  // Species activation limit for move (+ 1 if improved_logistics researched)
  // Reactions always allow exactly 1 activation
  const maxActivations = useMemo(() => {
    if (reactionMode) return 1;
    if (moveContinuation) return moveContinuation.maxActivations;
    if (!filteredState) return 1;
    const speciesId = filteredState.you.speciesId;
    const species = SPECIES[speciesId];
    const base = species?.activationLimits?.move ?? 2;
    const hasImprovedLogistics = filteredState.you.techTracks.grid.includes('improved_logistics');
    return base + (hasImprovedLogistics ? 1 : 0);
  }, [filteredState, moveContinuation, reactionMode]);

  const activationsUsed = moveContinuation?.activationsUsed ?? 0;

  // Auto-enter continuation mode when server sends moveContinuation
  useEffect(() => {
    if (canFinishMove && step.type === 'IDLE') {
      wasInContinuationRef.current = true;
      advanceStep({ type: 'MOVE_PICK_SHIP' });
    }
  }, [canFinishMove, step.type, advanceStep]);

  // Auto-exit: server cleared subPhase after all activations used —
  // we were in continuation but it's now gone, so exit the move flow
  useEffect(() => {
    if (isActive && wasInContinuationRef.current && !canFinishMove) {
      wasInContinuationRef.current = false;
      cancelAction();
    }
  }, [isActive, canFinishMove, cancelAction]);

  // Build movable ships list grouped by sector — ships are at their real positions
  const movableShips = useMemo(() => {
    if (!filteredState || !isActive) return [];

    const sectors = filteredState.board.sectors;
    const groupMap = new Map<string, { sectorKey: string; position: HexCoord; ships: MovableShip[] }>();

    for (const [sectorKey, sector] of Object.entries(sectors)) {
      for (const ship of sector.ships) {
        if (!moveOptions.has(ship.id)) continue;

        let group = groupMap.get(sectorKey);
        if (!group) {
          group = { sectorKey, position: sector.position, ships: [] };
          groupMap.set(sectorKey, group);
        }
        group.ships.push({
          shipId: ship.id,
          shipType: ship.type,
          owner: ship.owner,
          position: sector.position,
          positionKey: sectorKey,
        });
      }
    }

    const groups: { sectorKey: string; position: HexCoord; ships: MovableShip[] }[] = [];
    for (const group of Array.from(groupMap.values())) {
      if (group.ships.length > 0) groups.push(group);
    }
    return groups;
  }, [filteredState, isActive, moveOptions]);

  // Valid destinations for the selected ship — read from server-computed moveOptions
  const validDestinations = useMemo(() => {
    if (!selectedShipId || !isActive) return [];
    const entry = moveOptions.get(selectedShipId);
    return entry?.destinations ?? [];
  }, [selectedShipId, isActive, moveOptions]);

  const selectShip = useCallback((shipId: string) => {
    setSelectedShipId(shipId);
    advanceStep({ type: 'MOVE_PICK_PATH', shipId });
  }, [advanceStep]);

  const executeMove = useCallback((action: unknown, multi: boolean) => {
    if (multi) {
      wasInContinuationRef.current = true;
      sendAction(action);
      setSelectedShipId(null);
      if (activationsUsed + 1 >= maxActivations) {
        // Last activation — stay at MOVE_PICK_PATH with no selection.
        // This prevents further interaction while auto-exit waits for server.
      } else {
        // More activations available — go back to ship selection
        advanceStep({ type: 'MOVE_PICK_SHIP' });
      }
    } else {
      // Single-activation: submit normally (resets to IDLE)
      submitAction(action);
      setSelectedShipId(null);
    }
  }, [activationsUsed, maxActivations, sendAction, submitAction, advanceStep]);

  const selectDestination = useCallback((position: HexCoord) => {
    if (!selectedShipId) return;

    const destKey = `${position.q},${position.r}`;
    const entry = moveOptions.get(selectedShipId);
    const path = entry?.paths.get(destKey);
    if (!path) return;

    const action = {
      type: 'MOVE',
      activations: [{ shipId: selectedShipId, path }],
    };

    const multi = maxActivations > 1;

    // Check ALL positions in path for allied sectors (aggression detection)
    if (filteredState) {
      const allies = new Set(filteredState.you.ambassadorsGiven.map(a => a.playerId));
      if (allies.size > 0) {
        for (const pos of path) {
          const sectorKey = `${pos.q},${pos.r}`;
          const sector = filteredState.board.sectors[sectorKey];
          if (sector?.influenceDisc && allies.has(sector.influenceDisc)) {
            setPendingAggressionMove({ action, allyId: sector.influenceDisc, multi });
            return;
          }
        }
      }
    }

    executeMove(action, multi);
  }, [selectedShipId, moveOptions, maxActivations, filteredState, executeMove]);

  const confirmAggression = useCallback(() => {
    if (!pendingAggressionMove) return;
    const { action, multi } = pendingAggressionMove;
    setPendingAggressionMove(null);
    executeMove(action, multi);
  }, [pendingAggressionMove, executeMove]);

  const cancelAggression = useCallback(() => {
    setPendingAggressionMove(null);
  }, []);

  const finishMove = useCallback(() => {
    sendAction({ type: 'MOVE_FINISH' });
    setSelectedShipId(null);
    cancelAction(); // Reset step to IDLE
  }, [sendAction, cancelAction]);

  const cancel = useCallback(() => {
    setSelectedShipId(null);
    wasInContinuationRef.current = false;
    if (isContinuation) {
      // Can't undo a committed move, just finish
      sendAction({ type: 'MOVE_FINISH' });
    }
    cancelAction();
  }, [isContinuation, sendAction, cancelAction]);

  return {
    maxActivations,
    activationsUsed,
    isContinuation,
    selectedShipId,
    movableShips,
    validDestinations,
    selectShip,
    selectDestination,
    finishMove,
    cancel,
    canFinishMove,
    pendingAggressionMove,
    confirmAggression,
    cancelAggression,
  };
}

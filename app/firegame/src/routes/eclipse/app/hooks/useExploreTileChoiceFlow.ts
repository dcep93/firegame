import { useState, useCallback, useMemo, useEffect } from 'react';
import { SECTORS_BY_ID } from '@eclipse/shared';
import type { SectorDefinition } from '@eclipse/shared';
import { useGameState } from './useGameState';

interface ExploreTileChoiceFlowResult {
  active: boolean;
  targetPosition: { q: number; r: number } | null;
  tiles: Array<{ index: 0 | 1; sectorId: string; def: SectorDefinition }>;
  selectedTileIndex: 0 | 1 | null;
  selectedDef: SectorDefinition | null;
  rotation: number;
  takeInfluence: boolean;
  validRotations: Set<number>;
  ghostTile: { sectorDef: SectorDefinition; position: { q: number; r: number }; rotation: number } | null;
  setSelectedTileIndex: (index: 0 | 1) => void;
  setRotation: (rot: number) => void;
  setTakeInfluence: (val: boolean) => void;
  confirmPlace: () => void;
  confirmDiscard: () => void;
}

export function useExploreTileChoiceFlow(
  sendAction: (action: unknown) => void,
): ExploreTileChoiceFlowResult {
  const { filteredState, playerId, legalActions } = useGameState();

  const subPhase = filteredState?.subPhase;
  const active =
    subPhase?.type === 'EXPLORE_TILE_CHOICE' &&
    subPhase.playerId === playerId;

  const isDraco = filteredState?.you.speciesId === 'descendants_of_draco';
  const exploreTileChoice = legalActions?.exploreTileChoice ?? null;

  const tiles = useMemo(() => {
    if (!exploreTileChoice) return [];
    return exploreTileChoice.drawnTiles
      .map((sectorId: string, i: number) => {
        const def = SECTORS_BY_ID[sectorId];
        if (!def) return null;
        return { index: i as 0 | 1, sectorId, def };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  }, [exploreTileChoice]);

  const targetPosition = exploreTileChoice?.targetPosition ?? null;

  const [selectedTileIndex, setSelectedTileIndex] = useState<0 | 1 | null>(null);
  const [rotation, setRotation] = useState(0);
  const [takeInfluence, setTakeInfluence] = useState(true);

  // Reset when sub-phase changes
  const fingerprint = active ? `${targetPosition?.q},${targetPosition?.r}` : '';
  useEffect(() => {
    setSelectedTileIndex(null);
    setRotation(0);
    setTakeInfluence(true);
  }, [fingerprint]);

  const selectedDef = useMemo(() => {
    if (selectedTileIndex === null) return null;
    const tile = tiles.find(t => t.index === selectedTileIndex);
    return tile?.def ?? null;
  }, [selectedTileIndex, tiles]);

  // Compute valid rotations for selected tile
  const validRotations = useMemo(() => {
    if (!selectedDef || !targetPosition || !filteredState) return new Set<number>();
    const valid = new Set<number>();

    for (let rot = 0; rot < 6; rot++) {
      if (isValidRotation(
        selectedDef,
        targetPosition,
        rot,
        filteredState.board.sectors,
        filteredState.you.id,
      )) {
        valid.add(rot);
      }
    }
    return valid;
  }, [selectedDef, targetPosition, filteredState]);

  // Auto-select best rotation when tile changes
  useEffect(() => {
    if (!selectedDef || !targetPosition || validRotations.size === 0) return;
    if (validRotations.has(rotation)) return;

    // Pick the rotation with most connections
    let best = validRotations.values().next().value!;
    let bestScore = -1;
    for (const rot of Array.from(validRotations)) {
      const score = countConnections(selectedDef, targetPosition, filteredState?.board.sectors ?? {});
      if (score > bestScore) {
        bestScore = score;
        best = rot;
      }
    }
    setRotation(best);
  }, [selectedDef, targetPosition, validRotations]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetSelectedTileIndex = useCallback((index: 0 | 1) => {
    setSelectedTileIndex(prev => prev === index ? null : index);
    setRotation(0);
  }, []);

  const confirmPlace = useCallback(() => {
    if (selectedTileIndex === null) return;
    sendAction({
      type: 'EXPLORE_CHOICE',
      chosenTileIndex: selectedTileIndex,
      decision: 'PLACE',
      rotation,
      takeInfluence: takeInfluence && selectedDef && (isDraco || (!selectedDef.hasAncient && !(selectedDef.ancientCount && selectedDef.ancientCount > 0))),
    });
  }, [selectedTileIndex, rotation, takeInfluence, selectedDef, isDraco, sendAction]);

  const confirmDiscard = useCallback(() => {
    if (selectedTileIndex === null) return;
    sendAction({
      type: 'EXPLORE_CHOICE',
      chosenTileIndex: selectedTileIndex,
      decision: 'DISCARD',
    });
  }, [selectedTileIndex, sendAction]);

  // Ghost tile for board preview — shown when a tile + rotation are selected
  const ghostTile = useMemo(() => {
    if (!selectedDef || !targetPosition) return null;
    return {
      sectorDef: selectedDef,
      position: targetPosition,
      rotation,
    };
  }, [selectedDef, targetPosition, rotation]);

  return {
    active,
    targetPosition,
    tiles,
    selectedTileIndex,
    selectedDef,
    rotation,
    takeInfluence,
    validRotations,
    ghostTile,
    setSelectedTileIndex: handleSetSelectedTileIndex,
    setRotation,
    setTakeInfluence,
    confirmPlace,
    confirmDiscard,
  };
}

const DIRS = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

function isValidRotation(
  sectorDef: SectorDefinition,
  targetPos: { q: number; r: number },
  rotation: number,
  sectors: Record<string, { sectorId: string; position: { q: number; r: number }; rotation: number; influenceDisc: string | null; ships: readonly { owner: string }[] }>,
  playerId: string,
): boolean {
  const rotatedEdges = sectorDef.wormholes.edges.map(e => (e + rotation) % 6);

  for (let edgeIdx = 0; edgeIdx < 6; edgeIdx++) {
    const dir = DIRS[edgeIdx]!;
    const neighborPos = { q: targetPos.q + dir.q, r: targetPos.r + dir.r };
    const neighborKey = `${neighborPos.q},${neighborPos.r}`;
    const neighbor = sectors[neighborKey];
    if (!neighbor) continue;

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

    if (newHasWormhole && neighborHasWormhole) return true;
  }

  return false;
}

function countConnections(
  sectorDef: SectorDefinition,
  targetPos: { q: number; r: number },
  sectors: Record<string, { sectorId: string; rotation: number }>,
): number {
  const rotatedEdges = sectorDef.wormholes.edges.map(e => (e + 0) % 6); // default rotation
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
    if (neighborRotatedEdges.includes(oppositeEdge)) count++;
  }

  return count;
}

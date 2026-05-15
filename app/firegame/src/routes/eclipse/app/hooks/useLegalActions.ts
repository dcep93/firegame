import { useMemo } from 'react';
import type { ExploreAction, ExploreActivation, ColonyShipAction, DiplomacyAction, DiplomacyResponseAction, InfluenceSectorChoiceAction, ResearchAction, UpgradeAction, BuildAction, MoveAction, MoveActivation, InfluenceActivation, ShipType, HexCoord } from '@eclipse/shared';
import { useGameState } from './useGameState';

/**
 * Derive which actions are available and which board elements should
 * be highlighted based on the current legal actions.
 */
export function useLegalActions() {
  const { legalActions } = useGameState();

  return useMemo(() => {
    if (!legalActions) {
      return {
        canExplore: false,
        canResearch: false,
        canUpgrade: false,
        canBuild: false,
        canMove: false,
        canInfluence: false,
        canPass: false,
        canTrade: false,
        canColonyShip: false,
        canDiplomacy: false,
        canRespondToDiplomacy: false,
        diplomacyResponseOptions: [] as readonly DiplomacyResponseAction[],
        canInfluenceSectorChoice: false,
        influenceSectorChoiceOptions: [] as readonly InfluenceSectorChoiceAction[],
        canWarpPortalChoice: false,
        warpPortalChoiceSectors: [] as readonly string[],
        isBankrupt: false,
        hasReactions: false,
        canReactUpgrade: false,
        canReactBuild: false,
        canReactMove: false,
        moveContinuation: null as { activationsUsed: number; maxActivations: number } | null,
        canFinishMove: false,
        explorePositions: [] as Array<{ q: number; r: number }>,
        researchTechIds: new Set<string>(),
        colonyShipActions: [] as readonly ColonyShipAction[],
        upgradeOptions: new Map<ShipType, Map<number, (string | null)[]>>(),
        upgradePartOptions: new Map<ShipType, Map<number, string[]>>(),
        buildOptions: new Map<string, HexCoord[]>(),
        moveOptions: new Map<string, { destinations: HexCoord[]; paths: Map<string, HexCoord[]> }>(),
        influenceOptions: { placeable: [] as HexCoord[], removable: [] as HexCoord[] },
      };
    }

    const moveCont = legalActions.moveContinuation ?? null;
    return {
      canExplore: legalActions.explore.length > 0,
      canResearch: legalActions.research.length > 0,
      canUpgrade: legalActions.upgrade.length > 0,
      canBuild: legalActions.build.length > 0,
      canMove: legalActions.move.length > 0,
      canInfluence: legalActions.influence.length > 0,
      canPass: legalActions.canPass,
      canTrade: legalActions.freeActions.trade.length > 0,
      canColonyShip: legalActions.freeActions.colonyShip.length > 0,
      canDiplomacy: legalActions.freeActions.diplomacy.length > 0,
      diplomacyTargets: (legalActions.freeActions.diplomacy ?? []) as readonly DiplomacyAction[],
      canWarpPortalChoice: (legalActions.warpPortalChoice?.length ?? 0) > 0,
      warpPortalChoiceSectors: (legalActions.warpPortalChoice ?? []) as readonly string[],
      isBankrupt: legalActions.bankruptcyResolution.length > 0,
      canRespondToDiplomacy: (legalActions.diplomacyResponse?.length ?? 0) > 0,
      diplomacyResponseOptions: (legalActions.diplomacyResponse ?? []) as readonly DiplomacyResponseAction[],
      canInfluenceSectorChoice: (legalActions.influenceSectorChoice?.length ?? 0) > 0,
      influenceSectorChoiceOptions: (legalActions.influenceSectorChoice ?? []) as readonly InfluenceSectorChoiceAction[],
      hasReactions: (
        legalActions.reactions.upgrade.length > 0 ||
        legalActions.reactions.build.length > 0 ||
        legalActions.reactions.move.length > 0
      ),
      canReactUpgrade: legalActions.reactions.upgrade.length > 0,
      canReactBuild: legalActions.reactions.build.length > 0,
      canReactMove: legalActions.reactions.move.length > 0,
      moveContinuation: moveCont as { activationsUsed: number; maxActivations: number } | null,
      canFinishMove: moveCont !== null,
      researchTechIds: new Set(
        legalActions.research.flatMap((a: ResearchAction) =>
          a.activations.map(act => act.techId)
        )
      ),
      explorePositions: legalActions.explore
        .flatMap((a: ExploreAction) => a.activations.map((act: ExploreActivation) => act.targetPosition)),
      colonyShipActions: (legalActions.freeActions.colonyShip ?? []) as readonly ColonyShipAction[],
      upgradeOptions: (() => {
        const map = new Map<ShipType, Map<number, (string | null)[]>>();
        for (const action of legalActions.upgrade as readonly UpgradeAction[]) {
          for (const act of action.activations) {
            let shipMap = map.get(act.shipType);
            if (!shipMap) {
              shipMap = new Map<number, (string | null)[]>();
              map.set(act.shipType, shipMap);
            }
            let parts = shipMap.get(act.slotIndex);
            if (!parts) {
              parts = [];
              shipMap.set(act.slotIndex, parts);
            }
            if (!parts.includes(act.partId)) {
              parts.push(act.partId);
            }
          }
        }
        return map;
      })(),
      upgradePartOptions: (() => {
        const map = new Map<ShipType, Map<number, string[]>>();
        const opts = legalActions.upgradePartOptions;
        if (opts && Object.keys(opts).length > 0) {
          for (const [shipType, slots] of Object.entries(opts)) {
            const slotMap = new Map<number, string[]>();
            for (const [slotIdx, parts] of Object.entries(slots)) {
              slotMap.set(Number(slotIdx), parts as string[]);
            }
            map.set(shipType as ShipType, slotMap);
          }
        } else if (legalActions.reactions.upgrade.length > 0) {
          // Derive from reaction upgrade actions
          for (const action of legalActions.reactions.upgrade as readonly UpgradeAction[]) {
            for (const act of action.activations) {
              let shipMap = map.get(act.shipType);
              if (!shipMap) {
                shipMap = new Map<number, string[]>();
                map.set(act.shipType, shipMap);
              }
              let parts = shipMap.get(act.slotIndex);
              if (!parts) {
                parts = [];
                shipMap.set(act.slotIndex, parts);
              }
              if (act.partId !== null && !parts.includes(act.partId)) {
                parts.push(act.partId);
              }
            }
          }
        }
        return map;
      })(),
      buildOptions: (() => {
        const map = new Map<string, HexCoord[]>();
        const buildSource = legalActions.build.length > 0
          ? legalActions.build
          : legalActions.reactions.build;
        for (const action of buildSource as readonly BuildAction[]) {
          for (const act of action.activations) {
            let positions = map.get(act.buildType);
            if (!positions) {
              positions = [];
              map.set(act.buildType, positions);
            }
            const already = positions.some(p => p.q === act.sectorPosition.q && p.r === act.sectorPosition.r);
            if (!already) {
              positions.push(act.sectorPosition);
            }
          }
        }
        return map;
      })(),
      moveOptions: (() => {
        const map = new Map<string, { destinations: HexCoord[]; paths: Map<string, HexCoord[]> }>();
        const moveSource = legalActions.move.length > 0
          ? legalActions.move
          : legalActions.reactions.move;
        for (const action of moveSource as readonly MoveAction[]) {
          for (const act of action.activations as readonly MoveActivation[]) {
            const dest = act.path[act.path.length - 1];
            if (!dest) continue;
            let entry = map.get(act.shipId);
            if (!entry) {
              entry = { destinations: [], paths: new Map() };
              map.set(act.shipId, entry);
            }
            const destKey = `${dest.q},${dest.r}`;
            const already = entry.destinations.some(d => d.q === dest.q && d.r === dest.r);
            if (!already) {
              entry.destinations.push(dest);
            }
            // Store the path for this destination (first path wins if multiple routes)
            if (!entry.paths.has(destKey)) {
              entry.paths.set(destKey, [...act.path]);
            }
          }
        }
        return map;
      })(),
      influenceOptions: (() => {
        const placeable: HexCoord[] = [];
        const removable: HexCoord[] = [];
        const placeKeys = new Set<string>();
        const removeKeys = new Set<string>();
        for (const action of legalActions.influence as readonly { activations: readonly InfluenceActivation[] }[]) {
          for (const act of action.activations) {
            if (act.from === 'INFLUENCE_TRACK' && act.to !== 'INFLUENCE_TRACK') {
              const key = `${act.to.q},${act.to.r}`;
              if (!placeKeys.has(key)) {
                placeKeys.add(key);
                placeable.push(act.to);
              }
            } else if (act.to === 'INFLUENCE_TRACK' && act.from !== 'INFLUENCE_TRACK') {
              const key = `${act.from.q},${act.from.r}`;
              if (!removeKeys.has(key)) {
                removeKeys.add(key);
                removable.push(act.from);
              }
            }
          }
        }
        return { placeable, removable };
      })(),
    };
  }, [legalActions]);
}

import { PhaseType, ResourceType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  PlayerId,
  ExploreAction,
  ResearchAction,
  UpgradeAction,
  BuildAction,
  MoveAction,
  InfluenceAction,
  TradeAction,
  ColonyShipAction,
  DiplomacyAction,
  DiplomacyResponseAction,
  DiscoveryDecisionAction,
  InfluenceSectorChoiceAction,
  BankruptcyResolutionAction,
} from '../types';
import {
  isPlayerTurn,
  getControlledSectors,
  playerHasTech,
} from '../state/state-queries';
import { positionToKey, hexNeighbors } from '../hex/hex-math';
import { getLegalExploreActions } from './legal-explore';
import { getLegalResearchActions } from './legal-research';
import { getLegalUpgradeActions, getUpgradePartOptions } from './legal-upgrade';
import { getLegalBuildActions } from './legal-build';
import { getLegalMoveActions } from './legal-move';
import { getLegalInfluenceActions } from './legal-influence';
import { getLegalDiscoveryDecisions } from './legal-discovery-decision';
import { isNpcOwner } from '../combat/combat-helpers';
import { hasAvailableAmbassadorSlot, getEligibleReputationSlotIndices } from '../combat/reputation';

export interface LegalActions {
  readonly explore: readonly ExploreAction[];
  readonly research: readonly ResearchAction[];
  readonly upgrade: readonly UpgradeAction[];
  readonly build: readonly BuildAction[];
  readonly move: readonly MoveAction[];
  readonly influence: readonly InfluenceAction[];
  readonly canPass: boolean;
  readonly canAdvanceCombat: boolean;
  readonly exploreTileChoice: {
    readonly targetPosition: { readonly q: number; readonly r: number };
    readonly drawnTiles: readonly [string, string];
  } | null;
  readonly discoveryDecision: readonly DiscoveryDecisionAction[];
  readonly influenceSectorChoice: readonly InfluenceSectorChoiceAction[];
  readonly bankruptcyResolution: readonly BankruptcyResolutionAction[];
  readonly bankruptcyTradeInfo: {
    readonly tradeRate: number;
    readonly availableResources: readonly { readonly resource: ResourceType; readonly available: number }[];
    readonly deficit: number;
  } | null;
  readonly warpPortalChoice: readonly string[];
  readonly artifactResourceChoice: {
    readonly totalResources: number;
    readonly increment: number;
  } | null;
  readonly bombardmentChoice: {
    readonly sectorKey: string;
    readonly totalDamage: number;
    readonly populations: readonly { readonly slotIndex: number; readonly sourceTrack: ResourceType; readonly isWild: boolean }[];
    readonly rolls: readonly { readonly dieColor: string; readonly faceValue: number; readonly isHit: boolean }[];
    readonly hasOrbitalPop: boolean;
    readonly orbitalTrack: ResourceType | null;
  } | null;
  readonly retreatDecision: {
    readonly sectorKey: string;
    readonly validTargets: readonly { readonly q: number; readonly r: number }[];
    readonly playerShips: readonly { readonly shipId: string; readonly shipType: string; readonly damage: number; readonly hullValue: number }[];
  } | null;
  readonly populationGraveyardChoice: {
    readonly sectorKey: string;
    readonly choices: readonly {
      readonly source: 'orbital' | 'wild';
      readonly validTracks: readonly string[];
    }[];
  } | null;
  readonly diplomacyResponse: readonly DiplomacyResponseAction[];
  readonly reactions: {
    readonly upgrade: readonly UpgradeAction[];
    readonly build: readonly BuildAction[];
    readonly move: readonly MoveAction[];
  };
  readonly freeActions: {
    readonly trade: readonly TradeAction[];
    readonly colonyShip: readonly ColonyShipAction[];
    readonly diplomacy: readonly DiplomacyAction[];
  };
  readonly moveContinuation: {
    readonly activationsUsed: number;
    readonly maxActivations: number;
  } | null;
  readonly damageAssignment: {
    readonly sectorKey: string;
    readonly hits: readonly { readonly dieColor: string; readonly damage: number; readonly isBurst: boolean }[];
    readonly targetShips: readonly { readonly shipId: string; readonly shipType: string; readonly damage: number; readonly hullValue: number }[];
    readonly isMissile: boolean;
  } | null;
  readonly reputationSelection: {
    readonly drawn: readonly number[];
    readonly currentTrack: readonly { readonly slotType: string; readonly tile: { readonly value: number; readonly fromAmbassador: boolean } | null }[];
    readonly eligibleSlotIndices: readonly number[];
  } | null;
  /** All tech-valid parts per (shipType, slotIndex), ignoring energy/movement.
   *  Used by client to build multi-activation combos. */
  readonly upgradePartOptions: Readonly<Record<string, Readonly<Record<number, readonly string[]>>>>;
}

const EMPTY: LegalActions = {
  explore: [],
  research: [],
  upgrade: [],
  build: [],
  move: [],
  influence: [],
  canPass: false,
  canAdvanceCombat: false,
  exploreTileChoice: null,
  discoveryDecision: [],
  influenceSectorChoice: [],
  bankruptcyResolution: [],
  bankruptcyTradeInfo: null,
  warpPortalChoice: [],
  artifactResourceChoice: null,
  bombardmentChoice: null,
  retreatDecision: null,
  populationGraveyardChoice: null,
  damageAssignment: null,
  diplomacyResponse: [],
  reputationSelection: null,
  reactions: { upgrade: [], build: [], move: [] },
  freeActions: { trade: [], colonyShip: [], diplomacy: [] },
  moveContinuation: null,
  upgradePartOptions: {},
};

/**
 * Master dispatcher: given a GameState and PlayerId, enumerate every valid action.
 */
export function getLegalActions(
  state: GameState,
  playerId: PlayerId,
): LegalActions {
  const player = state.players[playerId];
  if (!player) return EMPTY;
  if (player.eliminated) return EMPTY;

  // MOVE_CONTINUATION subPhase: only the moving player gets move + moveContinuation
  if (state.subPhase?.type === 'MOVE_CONTINUATION') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        move: getLegalMoveActions(state, playerId, { skipGating: true }),
        moveContinuation: {
          activationsUsed: state.subPhase.activationsUsed,
          maxActivations: state.subPhase.maxActivations,
        },
      };
    }
    return EMPTY;
  }

  // Explore tile choice subPhase (Draco): player picks between 2 drawn tiles
  if (state.subPhase?.type === 'EXPLORE_TILE_CHOICE') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        exploreTileChoice: {
          targetPosition: state.subPhase.targetPosition,
          drawnTiles: state.subPhase.drawnTiles,
        },
      };
    }
    return EMPTY;
  }

  // Influence sector choice subPhase: player picks which sectors to claim
  if (state.subPhase?.type === 'INFLUENCE_SECTOR_CHOICE') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        influenceSectorChoice: getLegalInfluenceSectorChoices(state, playerId),
      };
    }
    return EMPTY;
  }

  // Bankruptcy resolution subPhase: player picks sectors to abandon and/or trade resources
  if (state.subPhase?.type === 'BANKRUPTCY_RESOLUTION') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        bankruptcyResolution: getLegalBankruptcyResolutions(state, playerId),
        bankruptcyTradeInfo: getBankruptcyTradeInfo(state, playerId),
      };
    }
    return EMPTY;
  }

  // Warp portal choice subPhase: player picks sector for portal
  if (state.subPhase?.type === 'WARP_PORTAL_CHOICE') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        warpPortalChoice: [...state.subPhase.eligibleSectors],
      };
    }
    return EMPTY;
  }

  // Artifact resource choice subPhase: player distributes resources
  if (state.subPhase?.type === 'ARTIFACT_RESOURCE_CHOICE') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        artifactResourceChoice: {
          totalResources: state.subPhase.totalResources,
          increment: state.subPhase.increment,
        },
      };
    }
    return EMPTY;
  }

  // Diplomacy response subPhase: target accepts or declines
  if (state.subPhase?.type === 'DIPLOMACY_RESPONSE') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        diplomacyResponse: getLegalDiplomacyResponses(state, playerId),
      };
    }
    return EMPTY;
  }

  // Bombardment choice subPhase: attacker picks which cubes to destroy
  if (state.subPhase?.type === 'BOMBARDMENT_CHOICE') {
    if (state.subPhase.playerId === playerId) {
      const sector = state.board.sectors[state.subPhase.sectorKey];
      const sectorDef = sector ? SECTORS_BY_ID[sector.sectorId] : undefined;
      const populations = sector
        ? sector.populations.map(pop => ({
            slotIndex: pop.slotIndex,
            sourceTrack: pop.sourceTrack,
            isWild: sectorDef?.populationSquares[pop.slotIndex]?.type === 'wild',
          }))
        : [];
      return {
        ...EMPTY,
        bombardmentChoice: {
          sectorKey: state.subPhase.sectorKey,
          totalDamage: state.subPhase.totalDamage,
          populations,
          rolls: state.subPhase.rolls,
          hasOrbitalPop: state.subPhase.hasOrbitalPop,
          orbitalTrack: state.subPhase.orbitalTrack,
        },
      };
    }
    return EMPTY;
  }

  // Population graveyard choice subPhase: defender picks graveyard for wild/orbital cubes
  if (state.subPhase?.type === 'POPULATION_GRAVEYARD_CHOICE') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        populationGraveyardChoice: {
          sectorKey: state.subPhase.sectorKey,
          choices: state.subPhase.choices.map(c => ({
            source: c.source,
            validTracks: [...c.validTracks],
          })),
        },
      };
    }
    return EMPTY;
  }

  // Discovery decision subPhase: only discoveryDecision actions available
  if (state.subPhase?.type === 'DISCOVERY_DECISION') {
    if (state.subPhase.playerId === playerId) {
      return { ...EMPTY, discoveryDecision: getLegalDiscoveryDecisions(state, playerId) };
    }
    return EMPTY;
  }

  // Colony ship placement subPhase (post-combat): player places colony ships or passes
  if (state.subPhase?.type === 'COLONY_SHIP_PLACEMENT') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        freeActions: { trade: [], colonyShip: getFreeColonyShips(state, playerId), diplomacy: [] },
        canPass: true,
      };
    }
    return EMPTY;
  }

  // Reputation selection sub-phase: player chooses which drawn tile to keep
  if (state.subPhase?.type === 'REPUTATION_SELECTION') {
    if (state.subPhase.playerId === playerId) {
      const track = player.reputationTrack;
      return {
        ...EMPTY,
        reputationSelection: {
          drawn: state.subPhase.drawn,
          currentTrack: track.map(slot => ({
            slotType: slot.slotType,
            tile: slot.tile,
          })),
          eligibleSlotIndices: getEligibleReputationSlotIndices(track),
        },
      };
    }
    return EMPTY;
  }

  // Damage assignment sub-phase (manual damage assignment mode)
  if (state.subPhase?.type === 'DAMAGE_ASSIGNMENT') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        damageAssignment: {
          sectorKey: state.subPhase.sectorKey,
          hits: state.subPhase.hits.map(h => ({
            dieColor: h.dieColor,
            damage: h.damage,
            isBurst: h.isBurst,
          })),
          targetShips: state.subPhase.targetShips,
          isMissile: state.subPhase.isMissile,
        },
      };
    }
    return EMPTY;
  }

  // Retreat decision sub-phase (at round boundary)
  if (state.subPhase?.type === 'RETREAT_DECISION') {
    if (state.subPhase.playerId === playerId) {
      return {
        ...EMPTY,
        retreatDecision: {
          sectorKey: state.subPhase.sectorKey,
          validTargets: state.subPhase.validTargets.map(t => ({ q: t.q, r: t.r })),
          playerShips: state.subPhase.playerShips,
        },
      };
    }
    return EMPTY;
  }

  // Combat phase: canAdvanceCombat gating
  if (state.phase === PhaseType.Combat && state.combatState &&
      state.combatState.step !== 'ALL_COMPLETE') {
    const cs = state.combatState;

    // During firing steps, only the current actor's player can advance
    // When the current actor is an NPC (ancient/guardian/GCDS), the human opponent advances
    // When currentActorOwner is null (all units at this index destroyed), any battle participant advances
    // Other steps (AWAITING_START, BATTLE_RESULT, POST_BATTLE) — anyone can advance
    const isFiringStep = cs.step === 'MISSILE_FIRE' || cs.step === 'ENGAGEMENT_FIRE';
    let isMyTurn = !isFiringStep || cs.currentActorOwner === playerId;
    if (isFiringStep && cs.currentActorOwner === null) {
      const pair = cs.pairs[cs.currentPairIndex];
      if (pair) {
        isMyTurn = pair.attacker === playerId || pair.defender === playerId;
      }
    } else if (isFiringStep && cs.currentActorOwner && isNpcOwner(cs.currentActorOwner as any)) {
      const pair = cs.pairs[cs.currentPairIndex];
      if (pair) {
        isMyTurn = pair.attacker === playerId || pair.defender === playerId;
      }
    }

    return { ...EMPTY, canAdvanceCombat: isMyTurn, retreatDecision: null };
  }

  if (state.phase !== PhaseType.Action) return EMPTY;

  // Free actions (available regardless of pass/turn)
  const freeActions = {
    trade: getFreeTrades(state, playerId),
    colonyShip: getFreeColonyShips(state, playerId),
    diplomacy: getFreeDiplomacy(state, playerId),
  };

  // If player has NOT passed and it IS their turn: standard actions
  if (!player.hasPassed && isPlayerTurn(state, playerId)) {
    return {
      explore: getLegalExploreActions(state, playerId),
      research: getLegalResearchActions(state, playerId),
      upgrade: getLegalUpgradeActions(state, playerId),
      build: getLegalBuildActions(state, playerId),
      move: getLegalMoveActions(state, playerId),
      influence: getLegalInfluenceActions(state, playerId),
      canPass: true,
      canAdvanceCombat: false,
      exploreTileChoice: null,
      discoveryDecision: [],
      influenceSectorChoice: [],
      bankruptcyResolution: [],
      bankruptcyTradeInfo: null,
      warpPortalChoice: [],
      artifactResourceChoice: null,
      bombardmentChoice: null,
      retreatDecision: null,
      populationGraveyardChoice: null,
      damageAssignment: null,
      reputationSelection: null,
      diplomacyResponse: [],
      reactions: { upgrade: [], build: [], move: [] },
      freeActions,
      moveContinuation: null,
      upgradePartOptions: mapToRecord(getUpgradePartOptions(state, playerId)),
    };
  }

  // If player has passed: reactions + free actions (only on their turn)
  if (player.hasPassed) {
    const isMyTurn = isPlayerTurn(state, playerId);
    const reactions = isMyTurn
      ? getReactions(state, playerId)
      : { upgrade: [] as readonly UpgradeAction[], build: [] as readonly BuildAction[], move: [] as readonly MoveAction[] };

    // Compute upgradePartOptions for reaction upgrades
    let reactionUpgradePartOpts: Record<string, Record<number, readonly string[]>> = {};
    if (reactions.upgrade.length > 0) {
      const tempStateForParts: GameState = {
        ...state,
        currentPlayerIndex: state.turnOrder.indexOf(playerId),
      };
      const tempPlayerForParts = { ...player, hasPassed: false };
      const tempWithPlayer: GameState = {
        ...tempStateForParts,
        players: { ...tempStateForParts.players, [playerId]: tempPlayerForParts },
      };
      reactionUpgradePartOpts = mapToRecord(getUpgradePartOptions(tempWithPlayer, playerId));
    }

    return {
      explore: [],
      research: [],
      upgrade: [],
      build: [],
      move: [],
      influence: [],
      canPass: isMyTurn, // Passed players can pass again (skip reaction window)
      canAdvanceCombat: false,
      exploreTileChoice: null,
      discoveryDecision: [],
      influenceSectorChoice: [],
      bankruptcyResolution: [],
      bankruptcyTradeInfo: null,
      warpPortalChoice: [],
      artifactResourceChoice: null,
      bombardmentChoice: null,
      retreatDecision: null,
      populationGraveyardChoice: null,
      damageAssignment: null,
      reputationSelection: null,
      diplomacyResponse: [],
      reactions,
      freeActions,
      moveContinuation: null,
      upgradePartOptions: reactionUpgradePartOpts,
    };
  }

  // Not their turn and not passed: only free actions
  return {
    ...EMPTY,
    freeActions,
  };
}

// ── Influence Sector Choice ──

function getLegalInfluenceSectorChoices(
  state: GameState,
  _playerId: PlayerId,
): readonly InfluenceSectorChoiceAction[] {
  if (state.subPhase?.type !== 'INFLUENCE_SECTOR_CHOICE') return [];

  const eligible = state.subPhase.eligibleSectors;

  // Generate all subsets: the player can pick any combination including none
  // For simplicity, enumerate: claim all, claim none, and each individual
  const results: InfluenceSectorChoiceAction[] = [];

  // Option: claim none (decline all)
  results.push({ type: 'INFLUENCE_SECTOR_CHOICE', sectorKeys: [] });

  // Option: claim all
  if (eligible.length > 0) {
    results.push({ type: 'INFLUENCE_SECTOR_CHOICE', sectorKeys: eligible });
  }

  // Options: claim each individual sector
  if (eligible.length > 1) {
    for (const key of eligible) {
      results.push({ type: 'INFLUENCE_SECTOR_CHOICE', sectorKeys: [key] });
    }
  }

  return results;
}

// ── Bankruptcy Resolution ──

function getLegalBankruptcyResolutions(
  state: GameState,
  playerId: PlayerId,
): readonly BankruptcyResolutionAction[] {
  if (state.subPhase?.type !== 'BANKRUPTCY_RESOLUTION') return [];

  const controlled = getControlledSectors(state, playerId);
  const sectorKeys = controlled.map(s => `${s.position.q},${s.position.r}`);

  if (sectorKeys.length === 0) {
    // No sectors to abandon — only option is empty (will trigger elimination)
    return [{ type: 'BANKRUPTCY_RESOLUTION', abandonedSectors: [] }];
  }

  // Option: abandon all sectors
  const results: BankruptcyResolutionAction[] = [
    { type: 'BANKRUPTCY_RESOLUTION', abandonedSectors: sectorKeys },
  ];

  // Options: abandon each individual sector
  for (const key of sectorKeys) {
    results.push({ type: 'BANKRUPTCY_RESOLUTION', abandonedSectors: [key] });
  }

  return results;
}

function getBankruptcyTradeInfo(
  state: GameState,
  playerId: PlayerId,
): LegalActions['bankruptcyTradeInfo'] {
  if (state.subPhase?.type !== 'BANKRUPTCY_RESOLUTION') return null;

  const player = state.players[playerId]!;
  const species = SPECIES[player.speciesId]!;
  const deficit = Math.abs(player.resources.money);

  const availableResources: { resource: ResourceType; available: number }[] = [];
  for (const resource of [ResourceType.Materials, ResourceType.Science] as const) {
    const available = player.resources[resource];
    if (available > 0) {
      availableResources.push({ resource, available });
    }
  }

  return { tradeRate: species.tradeRate, availableResources, deficit };
}

// ── Reactions ──

function getReactions(
  state: GameState,
  playerId: PlayerId,
): { upgrade: readonly UpgradeAction[]; build: readonly BuildAction[]; move: readonly MoveAction[] } {
  const player = state.players[playerId]!;
  if (player.influenceDiscs.onTrack <= 0) {
    return { upgrade: [], build: [], move: [] };
  }

  // Create a temp state that bypasses phase/turn/passed checks
  // by making it look like the player's turn and not passed
  const tempState: GameState = {
    ...state,
    currentPlayerIndex: state.turnOrder.indexOf(playerId),
  };
  const tempPlayer = { ...player, hasPassed: false };
  const tempStateWithPlayer: GameState = {
    ...tempState,
    players: { ...tempState.players, [playerId]: tempPlayer },
  };

  return {
    upgrade: getLegalUpgradeActions(tempStateWithPlayer, playerId),
    build: getLegalBuildActions(tempStateWithPlayer, playerId),
    move: getLegalMoveActions(tempStateWithPlayer, playerId),
  };
}

// ── Free Actions ──

function getFreeTrades(
  state: GameState,
  playerId: PlayerId,
): readonly TradeAction[] {
  const player = state.players[playerId]!;
  const results: TradeAction[] = [];
  const allResources = [ResourceType.Materials, ResourceType.Science, ResourceType.Money] as const;

  // Can trade any resource for any other resource
  for (const from of allResources) {
    if (player.resources[from] < 1) continue;
    for (const to of allResources) {
      if (from === to) continue;
      results.push({ type: 'TRADE', fromResource: from, toResource: to, amount: 1 });
    }
  }

  return results;
}

export function getFreeColonyShips(
  state: GameState,
  playerId: PlayerId,
): readonly ColonyShipAction[] {
  const player = state.players[playerId]!;
  if (player.colonyShips.available <= 0) return [];

  const controlledSectors = getControlledSectors(state, playerId);
  const results: ColonyShipAction[] = [];

  for (const sector of controlledSectors) {
    const sectorDef = SECTORS_BY_ID[sector.sectorId];
    if (!sectorDef) continue;

    for (let slotIdx = 0; slotIdx < sectorDef.populationSquares.length; slotIdx++) {
      // Skip occupied slots
      if (sector.populations.some(p => p.slotIndex === slotIdx)) continue;

      const square = sectorDef.populationSquares[slotIdx]!;

      // Skip advanced slots without tech
      if (square.advanced) {
        const techId = advancedSlotTech(square.type);
        if (techId && !playerHasTech(player, techId)) {
          // Check metasynthesis for all types
          if (!playerHasTech(player, 'metasynthesis')) continue;
        }
      }

      // Determine valid source tracks
      const validTracks = getValidSourceTracks(square.type, player);
      for (const track of validTracks) {
        // Check cubes available on track
        if (!player.populationTracks[track].some(Boolean)) continue;

        results.push({
          type: 'COLONY_SHIP',
          usages: [{
            sourceTrack: track,
            targetSector: sector.position,
            targetSlotIndex: slotIdx,
          }],
        });
      }
    }

    // Orbital population square (slot index -1)
    if (sector.structures.hasOrbital && !sector.structures.orbitalPopulation) {
      const orbitalTracks = [ResourceType.Money, ResourceType.Science];
      for (const track of orbitalTracks) {
        if (!player.populationTracks[track].some(Boolean)) continue;
        results.push({
          type: 'COLONY_SHIP',
          usages: [{
            sourceTrack: track,
            targetSector: sector.position,
            targetSlotIndex: -1,
          }],
        });
      }
    }
  }

  return results;
}

function getValidSourceTracks(
  squareType: string,
  _player: { populationTracks: { materials: readonly boolean[]; science: readonly boolean[]; money: readonly boolean[] } },
): ResourceType[] {
  switch (squareType) {
    case 'materials':
      return [ResourceType.Materials];
    case 'science':
      return [ResourceType.Science];
    case 'money':
      return [ResourceType.Money];
    case 'wild':
      return [ResourceType.Materials, ResourceType.Science, ResourceType.Money];
    default:
      return [];
  }
}

function advancedSlotTech(squareType: string): string | null {
  switch (squareType) {
    case 'materials':
      return 'advanced_mining';
    case 'science':
      return 'advanced_labs';
    case 'money':
      return 'advanced_economy';
    case 'wild':
      return 'metamorphosis';
    default:
      return null;
  }
}

function getFreeDiplomacy(
  state: GameState,
  playerId: PlayerId,
): readonly DiplomacyAction[] {
  // Diplomacy requires 4+ players
  if (state.turnOrder.length < 4) return [];

  // Block when a DIPLOMACY_RESPONSE sub-phase is active
  if (state.subPhase?.type === 'DIPLOMACY_RESPONSE') return [];

  const player = state.players[playerId]!;
  if (player.hasTraitor) return [];
  if (!isPlayerTurn(state, playerId) && !player.hasPassed) return [];
  if (!hasAvailableAmbassadorSlot(player.reputationTrack)) return [];

  // Find which tracks have cubes
  const validTracks: ResourceType[] = [];
  for (const track of [ResourceType.Materials, ResourceType.Science, ResourceType.Money] as const) {
    if (player.populationTracks[track].some(Boolean)) {
      validTracks.push(track);
    }
  }
  if (validTracks.length === 0) return [];

  const results: DiplomacyAction[] = [];
  const playerSectors = getControlledSectors(state, playerId);

  for (const targetId of state.turnOrder) {
    if (targetId === playerId) continue;

    const target = state.players[targetId]!;
    if (target.eliminated) continue;
    if (target.hasTraitor) continue;
    if (player.ambassadorsGiven.some(a => a.playerId === targetId)) continue;
    if (!hasAvailableAmbassadorSlot(target.reputationTrack)) continue;

    // Check no ships in each other's sectors
    const targetSectors = getControlledSectors(state, targetId);
    let hasConflict = false;
    for (const s of playerSectors) {
      if (s.ships.some(sh => sh.owner === targetId)) {
        hasConflict = true;
        break;
      }
    }
    if (hasConflict) continue;
    for (const s of targetSectors) {
      if (s.ships.some(sh => sh.owner === playerId)) {
        hasConflict = true;
        break;
      }
    }
    if (hasConflict) continue;

    // Check wormhole connection between controlled sectors
    if (hasDiplomacyConnection(state, playerSectors, targetSectors)) {
      for (const track of validTracks) {
        results.push({ type: 'DIPLOMACY', targetPlayerId: targetId, sourceTrack: track });
      }
    }
  }

  return results;
}

function getLegalDiplomacyResponses(
  state: GameState,
  playerId: PlayerId,
): readonly DiplomacyResponseAction[] {
  if (state.subPhase?.type !== 'DIPLOMACY_RESPONSE') return [];

  const player = state.players[playerId]!;
  const results: DiplomacyResponseAction[] = [];

  // Always offer decline
  results.push({ type: 'DIPLOMACY_RESPONSE', accept: false });

  // Offer accept per valid track (if rep track has room)
  if (hasAvailableAmbassadorSlot(player.reputationTrack)) {
    const initiator = state.players[state.subPhase.initiatorId]!;
    if (hasAvailableAmbassadorSlot(initiator.reputationTrack)) {
      for (const track of [ResourceType.Materials, ResourceType.Science, ResourceType.Money] as const) {
        if (player.populationTracks[track].some(Boolean)) {
          results.push({ type: 'DIPLOMACY_RESPONSE', accept: true, sourceTrack: track });
        }
      }
    }
  }

  return results;
}

function hasDiplomacyConnection(
  state: GameState,
  playerSectors: ReturnType<typeof getControlledSectors>,
  targetSectors: ReturnType<typeof getControlledSectors>,
): boolean {
  const targetKeys = new Set(targetSectors.map(s => positionToKey(s.position)));

  for (const sector of playerSectors) {
    const sectorDef = SECTORS_BY_ID[sector.sectorId];
    if (!sectorDef) continue;

    const rotatedEdges = sectorDef.wormholes.edges.map(
      (edge) => (edge + sector.rotation) % 6,
    );

    const neighbors = hexNeighbors(sector.position);
    for (let edgeIdx = 0; edgeIdx < neighbors.length; edgeIdx++) {
      if (!rotatedEdges.includes(edgeIdx)) continue;

      const neighborPos = neighbors[edgeIdx]!;
      const neighborKey = positionToKey(neighborPos);
      if (!targetKeys.has(neighborKey)) continue;

      // Check neighbor has wormhole facing back
      const neighborSector = state.board.sectors[neighborKey];
      if (!neighborSector) continue;
      const neighborDef = SECTORS_BY_ID[neighborSector.sectorId];
      if (!neighborDef) continue;

      const neighborRotated = neighborDef.wormholes.edges.map(
        (edge) => (edge + neighborSector.rotation) % 6,
      );
      const oppositeEdge = (edgeIdx + 3) % 6;
      if (neighborRotated.includes(oppositeEdge)) {
        return true;
      }
    }
  }

  return false;
}

function mapToRecord(
  map: ReadonlyMap<string, ReadonlyMap<number, readonly string[]>>,
): Record<string, Record<number, readonly string[]>> {
  const result: Record<string, Record<number, readonly string[]>> = {};
  for (const [shipType, slotMap] of Array.from(map.entries())) {
    const slots: Record<number, readonly string[]> = {};
    for (const [slotIndex, parts] of Array.from(slotMap.entries())) {
      slots[slotIndex] = parts;
    }
    result[shipType] = slots;
  }
  return result;
}

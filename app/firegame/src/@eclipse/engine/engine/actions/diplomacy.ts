import { PhaseType, ReputationSlotType, ResourceType } from '@data/enums';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  DiplomacyAction,
  DiplomacyResponseAction,
  PlayerId,
} from '../types';
import {
  updatePlayer,
  removeCubeFromTrack,
  returnCubeToTrack,
} from '../state/state-helpers';
import {
  isPlayerTurn,
  getControlledSectors,
} from '../state/state-queries';
import { positionToKey, hexNeighbors } from '../hex/hex-math';
import { appendEvent, createEvent } from '../utils/events';
import { hasAvailableAmbassadorSlot } from '../combat/reputation';

// ── Step 1: Initiator proposes diplomacy ──

export function validateDiplomacy(
  state: GameState,
  playerId: PlayerId,
  action: DiplomacyAction,
): string | null {
  if (state.phase !== PhaseType.Action) {
    return 'Can only propose diplomacy during the Action phase.';
  }
  const player = state.players[playerId];
  if (!player) return 'Player not found.';
  if (player.hasPassed) return 'Player has already passed.';
  if (!isPlayerTurn(state, playerId)) return 'Not this player\'s turn.';

  // Block if a DIPLOMACY_RESPONSE sub-phase is already active
  if (state.subPhase?.type === 'DIPLOMACY_RESPONSE') {
    return 'A diplomacy proposal is already pending.';
  }

  // Diplomacy requires 4+ players
  if (state.turnOrder.length < 4) {
    return 'Diplomacy requires at least 4 players.';
  }

  const targetId = action.targetPlayerId;
  const target = state.players[targetId];
  if (!target) return 'Target player not found.';
  if (targetId === playerId) return 'Cannot form diplomacy with yourself.';

  // Check traitor
  if (player.hasTraitor) return 'Player holds the Traitor tile and cannot form diplomacy.';
  if (target.hasTraitor) return 'Target player holds the Traitor tile.';

  // Check existing ambassadors
  if (player.ambassadorsGiven.some(a => a.playerId === targetId)) {
    return 'Already have diplomatic relations with this player.';
  }

  // Check reputation track space (ambassador or shared slot available)
  if (!hasAvailableAmbassadorSlot(player.reputationTrack)) {
    return 'Player reputation track is full.';
  }
  if (!hasAvailableAmbassadorSlot(target.reputationTrack)) {
    return 'Target player reputation track is full.';
  }

  // Validate sourceTrack
  const track = action.sourceTrack;
  if (track !== ResourceType.Materials && track !== ResourceType.Science && track !== ResourceType.Money) {
    return 'Invalid source track.';
  }
  if (!player.populationTracks[track].some(Boolean)) {
    return 'No population cube available on chosen track.';
  }

  // Check wormhole connection between controlled sectors
  const hasConnection = checkDiplomacyConnection(state, playerId, targetId);
  if (!hasConnection) {
    return 'No wormhole connection between controlled sectors.';
  }

  // Check no ships in each other's sectors
  const playerSectors = getControlledSectors(state, playerId);
  const targetSectors = getControlledSectors(state, targetId);

  for (const sector of playerSectors) {
    if (sector.ships.some((s) => s.owner === targetId)) {
      return 'Target player has ships in your controlled sectors.';
    }
  }
  for (const sector of targetSectors) {
    if (sector.ships.some((s) => s.owner === playerId)) {
      return 'You have ships in target player\'s controlled sectors.';
    }
  }

  return null;
}

export function executeDiplomacy(
  state: GameState,
  playerId: PlayerId,
  action: DiplomacyAction,
): GameState {
  let result = state;
  const player = result.players[playerId]!;
  const track = action.sourceTrack;

  // Remove initiator's cube from chosen track (lowest present cube)
  const cubeIndex = player.populationTracks[track].indexOf(true);
  result = removeCubeFromTrack(result, playerId, track, cubeIndex);

  // Set DIPLOMACY_RESPONSE sub-phase for the target
  result = {
    ...result,
    subPhase: {
      type: 'DIPLOMACY_RESPONSE',
      playerId: action.targetPlayerId,
      initiatorId: playerId,
      initiatorSourceTrack: track,
    },
  };

  // Log DIPLOMACY_PROPOSED event
  const event = createEvent('DIPLOMACY_PROPOSED', {
    initiator: playerId,
    target: action.targetPlayerId,
  });
  result = { ...result, eventLog: appendEvent(result.eventLog, event) };

  return result;
}

// ── Step 2: Target responds to diplomacy ──

export function validateDiplomacyResponse(
  state: GameState,
  playerId: PlayerId,
  action: DiplomacyResponseAction,
): string | null {
  if (state.subPhase?.type !== 'DIPLOMACY_RESPONSE') {
    return 'No diplomacy proposal pending.';
  }
  if (state.subPhase.playerId !== playerId) {
    return 'Not the target of the diplomacy proposal.';
  }

  if (action.accept) {
    // Must specify sourceTrack when accepting
    if (!action.sourceTrack) {
      return 'Must specify source track when accepting.';
    }
    const track = action.sourceTrack;
    if (track !== ResourceType.Materials && track !== ResourceType.Science && track !== ResourceType.Money) {
      return 'Invalid source track.';
    }
    const player = state.players[playerId]!;
    if (!player.populationTracks[track].some(Boolean)) {
      return 'No population cube available on chosen track.';
    }

    // Check both players have room on reputation track (ambassador or shared slot)
    if (!hasAvailableAmbassadorSlot(player.reputationTrack)) {
      return 'Your reputation track is full.';
    }
    const initiator = state.players[state.subPhase.initiatorId]!;
    if (!hasAvailableAmbassadorSlot(initiator.reputationTrack)) {
      return 'Initiator reputation track is full.';
    }
  }

  return null;
}

export function executeDiplomacyResponse(
  state: GameState,
  playerId: PlayerId,
  action: DiplomacyResponseAction,
): GameState {
  const sub = state.subPhase as {
    type: 'DIPLOMACY_RESPONSE';
    playerId: PlayerId;
    initiatorId: PlayerId;
    initiatorSourceTrack: ResourceType;
  };
  let result = state;

  if (action.accept) {
    const targetTrack = action.sourceTrack!;
    const initiatorTrack = sub.initiatorSourceTrack;
    const initiatorId = sub.initiatorId;

    // Remove target's cube from chosen track
    const targetPlayer = result.players[playerId]!;
    const cubeIndex = targetPlayer.populationTracks[targetTrack].indexOf(true);
    result = removeCubeFromTrack(result, playerId, targetTrack, cubeIndex);

    // Exchange ambassadors with cubeTrack metadata
    const currentInitiator = result.players[initiatorId]!;
    const currentTarget = result.players[playerId]!;

    // Place ambassador tiles into first empty ambassador/shared slot
    const initiatorTrackCopy = [...currentInitiator.reputationTrack];
    for (let si = 0; si < initiatorTrackCopy.length; si++) {
      const slot = initiatorTrackCopy[si]!;
      if (slot.tile === null && (slot.slotType === ReputationSlotType.Ambassador || slot.slotType === ReputationSlotType.Shared)) {
        initiatorTrackCopy[si] = { ...slot, tile: { value: 1, fromAmbassador: true } };
        break;
      }
    }

    result = updatePlayer(result, initiatorId, {
      ambassadorsGiven: [...currentInitiator.ambassadorsGiven, { playerId, cubeTrack: initiatorTrack }],
      ambassadorsReceived: [...currentInitiator.ambassadorsReceived, { playerId, cubeTrack: targetTrack }],
      reputationTrack: initiatorTrackCopy,
    });

    const targetTrackCopy = [...currentTarget.reputationTrack];
    for (let si = 0; si < targetTrackCopy.length; si++) {
      const slot = targetTrackCopy[si]!;
      if (slot.tile === null && (slot.slotType === ReputationSlotType.Ambassador || slot.slotType === ReputationSlotType.Shared)) {
        targetTrackCopy[si] = { ...slot, tile: { value: 1, fromAmbassador: true } };
        break;
      }
    }

    result = updatePlayer(result, playerId, {
      ambassadorsGiven: [...currentTarget.ambassadorsGiven, { playerId: initiatorId, cubeTrack: targetTrack }],
      ambassadorsReceived: [...currentTarget.ambassadorsReceived, { playerId: initiatorId, cubeTrack: initiatorTrack }],
      reputationTrack: targetTrackCopy,
    });

    // Log DIPLOMACY_FORMED event
    const event = createEvent('DIPLOMACY_FORMED', {
      player1: initiatorId,
      player2: playerId,
    });
    result = { ...result, eventLog: appendEvent(result.eventLog, event) };
  } else {
    // Decline: return initiator's cube to their track
    result = returnCubeToTrack(result, sub.initiatorId, sub.initiatorSourceTrack);

    // Log DIPLOMACY_DECLINED event
    const event = createEvent('DIPLOMACY_DECLINED', {
      initiator: sub.initiatorId,
      target: playerId,
    });
    result = { ...result, eventLog: appendEvent(result.eventLog, event) };
  }

  // Clear sub-phase
  result = { ...result, subPhase: null };

  return result;
}

// ── Break diplomacy (aggression) ──

/**
 * Break diplomatic relations due to an Act of Aggression.
 * - Return population cubes to both players' tracks
 * - Remove both sides from each other's ambassador lists
 * - Remove ambassador reputation tiles from both sides
 * - Transfer Traitor tile to aggressor
 * - Log DIPLOMACY_BROKEN event
 */
export function breakDiplomacy(
  state: GameState,
  aggressorId: PlayerId,
  victimId: PlayerId,
): GameState {
  let result = state;

  const aggressor = result.players[aggressorId]!;
  const victim = result.players[victimId]!;

  // Find the ambassador entries to get cubeTrack info
  const aggressorGivenEntry = aggressor.ambassadorsGiven.find(a => a.playerId === victimId);
  const victimGivenEntry = victim.ambassadorsGiven.find(a => a.playerId === aggressorId);

  // Return population cubes to their original owners' tracks
  if (aggressorGivenEntry) {
    result = returnCubeToTrack(result, aggressorId, aggressorGivenEntry.cubeTrack);
  }
  if (victimGivenEntry) {
    result = returnCubeToTrack(result, victimId, victimGivenEntry.cubeTrack);
  }

  // Remove ambassador rep tiles and ambassador lists from both sides
  // (re-read players after cube returns)
  const updatedAggressor = result.players[aggressorId]!;
  const updatedVictim = result.players[victimId]!;

  result = updatePlayer(result, aggressorId, {
    ambassadorsGiven: updatedAggressor.ambassadorsGiven.filter(a => a.playerId !== victimId),
    ambassadorsReceived: updatedAggressor.ambassadorsReceived.filter(a => a.playerId !== victimId),
    reputationTrack: removeOneAmbassadorRep(updatedAggressor.reputationTrack),
  });

  result = updatePlayer(result, victimId, {
    ambassadorsGiven: updatedVictim.ambassadorsGiven.filter(a => a.playerId !== aggressorId),
    ambassadorsReceived: updatedVictim.ambassadorsReceived.filter(a => a.playerId !== aggressorId),
    reputationTrack: removeOneAmbassadorRep(updatedVictim.reputationTrack),
  });

  // Transfer Traitor tile to aggressor
  const previousTraitor = result.traitorHolder;
  if (previousTraitor && previousTraitor !== aggressorId) {
    result = updatePlayer(result, previousTraitor, { hasTraitor: false });
  }
  result = updatePlayer(result, aggressorId, { hasTraitor: true });
  result = { ...result, traitorHolder: aggressorId };

  // Log event
  const event = createEvent('DIPLOMACY_BROKEN', {
    aggressor: aggressorId,
    victim: victimId,
  });
  result = { ...result, eventLog: appendEvent(result.eventLog, event) };

  return result;
}

/** Remove the first ambassador reputation tile from a slot-based track. */
function removeOneAmbassadorRep(
  track: readonly { readonly slotType: ReputationSlotType; readonly tile: { readonly value: number; readonly fromAmbassador: boolean } | null }[],
): typeof track {
  const result = [...track];
  for (let i = 0; i < result.length; i++) {
    if (result[i]!.tile?.fromAmbassador) {
      result[i] = { ...result[i]!, tile: null };
      break;
    }
  }
  return result;
}

// ── Wormhole connection check ──

function checkDiplomacyConnection(
  state: GameState,
  playerId: PlayerId,
  targetId: PlayerId,
): boolean {
  const playerSectors = getControlledSectors(state, playerId);
  const targetSectorKeys = new Set<string>();
  for (const sector of getControlledSectors(state, targetId)) {
    targetSectorKeys.add(positionToKey(sector.position));
  }

  for (const sector of playerSectors) {
    const sectorDef = SECTORS_BY_ID[sector.sectorId];
    if (!sectorDef) continue;

    // Get rotated wormhole edges
    const rotatedEdges = sectorDef.wormholes.edges.map(
      (edge) => ((edge + sector.rotation) % 6),
    );

    const neighbors = hexNeighbors(sector.position);
    for (let edgeIdx = 0; edgeIdx < neighbors.length; edgeIdx++) {
      if (!rotatedEdges.includes(edgeIdx)) continue;

      const neighborPos = neighbors[edgeIdx]!;
      const neighborKey = positionToKey(neighborPos);
      if (!targetSectorKeys.has(neighborKey)) continue;

      // Check neighbor also has wormhole facing back
      const neighborSector = state.board.sectors[neighborKey];
      if (!neighborSector) continue;
      const neighborDef = SECTORS_BY_ID[neighborSector.sectorId];
      if (!neighborDef) continue;

      const neighborRotatedEdges = neighborDef.wormholes.edges.map(
        (edge) => ((edge + neighborSector.rotation) % 6),
      );
      const oppositeEdge = (edgeIdx + 3) % 6;
      if (neighborRotatedEdges.includes(oppositeEdge)) {
        return true;
      }
    }
  }

  return false;
}

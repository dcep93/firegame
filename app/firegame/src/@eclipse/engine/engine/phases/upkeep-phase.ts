import { SPECIES } from '@data/definitions/species';
import { PhaseType, ResourceType } from '@data/enums';
import type { GameState, PlayerId, ReturnTrackOverride } from '../types';
import {
  adjustResources,
  returnCubeToTrack,
  returnDiscFromSector,
  updatePlayer,
  updateSector,
} from '../state/state-helpers';
import {
  getControlledSectors,
  getPlayerShips,
  getProduction,
  getUpkeepCost,
} from '../state/state-queries';
import { appendEvent, createEvent } from '../utils/events';

export function processUpkeepPhase(state: GameState): GameState {
  let result = state;

  // Step 0: Reset colony ships (flip all back to faceup for this round)
  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;
    if (player.colonyShips.available < player.colonyShips.total) {
      result = updatePlayer(result, playerId, {
        colonyShips: {
          total: player.colonyShips.total,
          available: player.colonyShips.total,
        },
      });
    }
  }

  // Step 1: Apply income & upkeep for ALL active players
  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    const production = getProduction(player);
    const income = production.money;
    const upkeep = getUpkeepCost(player);
    const net = income + upkeep;

    result = adjustResources(result, playerId, { money: net });

    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('UPKEEP_PAID', { playerId, income, upkeep, net }),
      ),
    };
  }

  // Step 2: Check for bankruptcies needing interactive resolution
  const bankrupt = findFirstBankruptPlayer(result);
  if (bankrupt) {
    return {
      ...result,
      subPhase: { type: 'BANKRUPTCY_RESOLUTION', playerId: bankrupt },
    };
  }

  // Step 3: Finish upkeep (production, elimination, transition)
  return finishUpkeepPhase(result);
}

/**
 * Auto-trade materials and science for money to cover a deficit.
 */
export function autoTradeForDeficit(
  state: GameState,
  playerId: PlayerId,
): GameState {
  let result = state;
  const player = result.players[playerId]!;
  const species = SPECIES[player.speciesId]!;
  const tradeRate = species.tradeRate;

  let deficit = -result.players[playerId]!.resources.money;

  for (const track of [ResourceType.Materials, ResourceType.Science] as const) {
    if (deficit <= 0) break;
    const available = result.players[playerId]!.resources[track];
    if (available <= 0) continue;

    const unitsToTrade = Math.min(available, deficit * tradeRate);
    const moneyGained = Math.floor(unitsToTrade / tradeRate);

    if (moneyGained > 0) {
      const resourceSpent = moneyGained * tradeRate;
      result = adjustResources(result, playerId, {
        [track]: -resourceSpent,
        money: moneyGained,
      });
      deficit -= moneyGained;
    }
  }

  return result;
}

/**
 * Find the first non-eliminated player (in turn order) with negative money.
 */
export function findFirstBankruptPlayer(state: GameState): PlayerId | null {
  for (const playerId of state.turnOrder) {
    const player = state.players[playerId]!;
    if (player.eliminated) continue;
    if (player.resources.money < 0) return playerId;
  }
  return null;
}

/**
 * Abandon a sector during bankruptcy: remove influence disc, return populations
 * directly to tracks (not graveyard — they lose production), and refund upkeep savings.
 * Optional returnTrackOverrides allow choosing which track for gray/orbital cubes.
 */
export function abandonSector(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
  overrides?: readonly ReturnTrackOverride[],
): GameState {
  let result = state;
  const sector = result.board.sectors[sectorKey]!;

  // Record old upkeep cost
  const oldUpkeep = getUpkeepCost(result.players[playerId]!);

  // Return influence disc to track
  result = returnDiscFromSector(result, playerId);
  result = updateSector(result, sectorKey, { influenceDisc: null });

  // Return populations directly to tracks (NOT graveyard).
  // Per rules: abandoned cubes go back to population tracks immediately,
  // which means production is calculated with cubes on track (lower production).
  for (const pop of sector.populations) {
    const overrideTrack = overrides?.find(o => o.slotIndex === pop.slotIndex)?.track;
    result = returnCubeToTrack(result, playerId, overrideTrack ?? pop.sourceTrack);
  }
  result = updateSector(result, sectorKey, { populations: [] });

  // Orbital population also returns to track (with optional override)
  if (sector.structures.orbitalPopulation) {
    const orbitalOverride = overrides?.find(o => o.slotIndex === -1)?.track;
    result = returnCubeToTrack(
      result,
      playerId,
      orbitalOverride ?? sector.structures.orbitalPopulation.track,
    );
    result = updateSector(result, sectorKey, {
      structures: { ...sector.structures, orbitalPopulation: null },
    });
  }

  // Calculate upkeep savings and refund
  const newUpkeep = getUpkeepCost(result.players[playerId]!);
  const savings = newUpkeep - oldUpkeep; // positive: new upkeep is less negative
  if (savings > 0) {
    result = adjustResources(result, playerId, { money: savings });
  }

  // Log influence removed
  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('INFLUENCE_REMOVED', {
        playerId,
        sector: sector.position,
      }),
    ),
  };

  return result;
}

/**
 * Finish the upkeep phase: apply production, check elimination, transition to Cleanup.
 */
export function finishUpkeepPhase(state: GameState): GameState {
  let result = state;

  // Apply production
  result = applyProduction(result);

  // Check elimination
  result = checkElimination(result);

  // Transition to Cleanup
  const event = createEvent('PHASE_CHANGED', {
    from: PhaseType.Upkeep,
    to: PhaseType.Cleanup,
    round: result.round,
  });

  return {
    ...result,
    phase: PhaseType.Cleanup,
    subPhase: null,
    eventLog: appendEvent(result.eventLog, event),
  };
}

export function applyProduction(state: GameState): GameState {
  let result = state;

  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    const production = getProduction(player);
    result = adjustResources(result, playerId, {
      materials: production.materials,
      science: production.science,
    });

    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('PRODUCTION', {
          playerId,
          materials: production.materials,
          science: production.science,
        }),
      ),
    };
  }

  return result;
}

export function checkElimination(state: GameState): GameState {
  let result = state;

  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    const ships = getPlayerShips(result, playerId);
    const sectors = getControlledSectors(result, playerId);

    if (ships.length === 0 && sectors.length === 0) {
      result = updatePlayer(result, playerId, { eliminated: true });
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('PLAYER_ELIMINATED', { playerId }),
        ),
      };
    }
  }

  return result;
}

export function applyIncomeAndUpkeep(state: GameState): GameState {
  let result = state;

  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    const production = getProduction(player);
    const income = production.money;
    const upkeep = getUpkeepCost(player);
    const net = income + upkeep;

    result = adjustResources(result, playerId, { money: net });

    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('UPKEEP_PAID', { playerId, income, upkeep, net }),
      ),
    };
  }

  return result;
}

/**
 * Legacy function kept for backward compatibility with existing tests.
 * Use autoTradeForDeficit + abandonSector instead.
 */
export function resolveUpkeepBankruptcy(
  state: GameState,
  playerId: PlayerId,
): GameState {
  let result = autoTradeForDeficit(state, playerId);

  // If still bankrupt after trading, eliminate
  if (result.players[playerId]!.resources.money < 0) {
    result = updatePlayer(result, playerId, { eliminated: true });
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('PLAYER_ELIMINATED', { playerId }),
      ),
    };
  }

  // Clear bankruptcy sub-phase
  result = { ...result, subPhase: null };

  return result;
}

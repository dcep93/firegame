import { PopulationSquareType, ResourceType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  PlayerId,
  BankruptcyResolutionAction,
} from '../types';
import { getControlledSectors } from '../state/state-queries';
import { adjustResources, updatePlayer } from '../state/state-helpers';
import { appendEvent, createEvent } from '../utils/events';
import {
  abandonSector,
  findFirstBankruptPlayer,
  finishUpkeepPhase,
} from '../phases/upkeep-phase';
import { positionToKey } from '../hex/hex-math';

export function validateBankruptcyResolution(
  state: GameState,
  playerId: PlayerId,
  action: BankruptcyResolutionAction,
): string | null {
  if (state.subPhase?.type !== 'BANKRUPTCY_RESOLUTION') {
    return 'No BANKRUPTCY_RESOLUTION sub-phase active';
  }

  if (state.subPhase.playerId !== playerId) {
    return 'Not your bankruptcy resolution';
  }

  const player = state.players[playerId]!;
  if (player.resources.money >= 0) {
    return 'Player is not bankrupt';
  }

  // Validate all abandoned sectors are controlled by the player
  const controlled = getControlledSectors(state, playerId);
  const controlledKeys = new Set(controlled.map(s => positionToKey(s.position)));

  for (const key of action.abandonedSectors) {
    if (!controlledKeys.has(key)) {
      return `Sector ${key} is not controlled by player`;
    }
  }

  // No duplicates
  if (new Set(action.abandonedSectors).size !== action.abandonedSectors.length) {
    return 'Duplicate sector keys';
  }

  // Validate returnTrackOverrides if provided
  if (action.returnTrackOverrides) {
    for (const [sectorKey, overrides] of Object.entries(action.returnTrackOverrides)) {
      if (!action.abandonedSectors.includes(sectorKey)) {
        return `Return track overrides for sector ${sectorKey} not in abandoned sectors`;
      }
      const sector = state.board.sectors[sectorKey]!;
      const sectorDef = SECTORS_BY_ID[sector.sectorId];
      if (!sectorDef) continue;

      for (const override of overrides) {
        if (override.slotIndex === -1) {
          if (!sector.structures.orbitalPopulation) {
            return `No orbital population in sector ${sectorKey}`;
          }
          if (override.track !== 'science' && override.track !== 'money') {
            return 'Orbital population can only return to science or money track';
          }
        } else {
          const pop = sector.populations.find(p => p.slotIndex === override.slotIndex);
          if (!pop) return `No population at slot ${override.slotIndex} in sector ${sectorKey}`;
          const square = sectorDef.populationSquares[override.slotIndex];
          if (square && square.type !== PopulationSquareType.Wild && override.track !== pop.sourceTrack) {
            return `Cannot override track for non-wild population square in sector ${sectorKey}`;
          }
        }
      }
    }
  }

  // Validate trades if provided
  if (action.trades && action.trades.length > 0) {
    const seenResources = new Set<ResourceType>();
    for (const trade of action.trades) {
      if (trade.fromResource === ResourceType.Money) {
        return 'Cannot trade money for money';
      }
      if (trade.fromResource !== ResourceType.Materials && trade.fromResource !== ResourceType.Science) {
        return `Invalid trade resource: ${trade.fromResource}`;
      }
      if (trade.amount <= 0) {
        return 'Trade amount must be positive';
      }
      if (seenResources.has(trade.fromResource)) {
        return 'Duplicate resource in trades';
      }
      seenResources.add(trade.fromResource);
      if (player.resources[trade.fromResource] < trade.amount) {
        return `Insufficient ${trade.fromResource} for trade (have ${player.resources[trade.fromResource]}, need ${trade.amount})`;
      }
    }
  }

  // Simulate trades + abandonments to verify they resolve the bankruptcy
  let simState = state;

  // Apply trades first
  if (action.trades) {
    const species = SPECIES[player.speciesId]!;
    for (const trade of action.trades) {
      const moneyGained = Math.floor(trade.amount / species.tradeRate);
      simState = adjustResources(simState, playerId, {
        [trade.fromResource]: -trade.amount,
        money: moneyGained,
      });
    }
  }

  // Then simulate abandonments
  for (const sectorKey of action.abandonedSectors) {
    simState = abandonSector(simState, playerId, sectorKey);
  }

  const finalMoney = simState.players[playerId]!.resources.money;
  if (finalMoney < 0) {
    // Check if there are more sectors they could abandon or resources to trade
    const remainingControlled = getControlledSectors(simState, playerId);
    if (remainingControlled.length > 0) {
      return 'Not enough sectors abandoned to resolve bankruptcy';
    }
    // No more sectors — will be eliminated, which is valid
  }

  return null;
}

export function executeBankruptcyResolution(
  state: GameState,
  playerId: PlayerId,
  action: BankruptcyResolutionAction,
): GameState {
  let result = state;

  // Apply trades first (convert resources to money)
  if (action.trades && action.trades.length > 0) {
    const player = result.players[playerId]!;
    const species = SPECIES[player.speciesId]!;

    for (const trade of action.trades) {
      const moneyGained = Math.floor(trade.amount / species.tradeRate);
      result = adjustResources(result, playerId, {
        [trade.fromResource]: -trade.amount,
        money: moneyGained,
      });

      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('BANKRUPTCY_TRADE', {
            playerId,
            fromResource: trade.fromResource,
            amount: trade.amount,
            moneyGained,
          }),
        ),
      };
    }
  }

  // Abandon chosen sectors (with optional return track overrides)
  for (const sectorKey of action.abandonedSectors) {
    const overrides = action.returnTrackOverrides?.[sectorKey];
    result = abandonSector(result, playerId, sectorKey, overrides);
  }

  // If still bankrupt after abandoning all chosen sectors, eliminate
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

  // Clear this player's sub-phase
  result = { ...result, subPhase: null };

  // Check for more bankrupt players
  const nextBankrupt = findFirstBankruptPlayer(result);
  if (nextBankrupt) {
    return {
      ...result,
      subPhase: { type: 'BANKRUPTCY_RESOLUTION', playerId: nextBankrupt },
    };
  }

  // All bankruptcies resolved — finish upkeep phase
  return finishUpkeepPhase(result);
}

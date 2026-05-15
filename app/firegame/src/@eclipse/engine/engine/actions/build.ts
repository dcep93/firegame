import { PhaseType, ShipType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import type {
  GameState,
  BuildAction,
  BuildActivation,
  PlayerId,
  ShipOnBoard,
} from '../types';
import {
  updatePlayer,
  adjustResources,
  addShipToSector,
  updateSector,
} from '../state/state-helpers';
import {
  playerHasTech,
  isPlayerTurn,
} from '../state/state-queries';
import { positionToKey } from '../hex/hex-math';
import { appendEvent, createEvent } from '../utils/events';
import { moveDiscToAction } from '../state/state-helpers';

export function validateBuild(
  state: GameState,
  playerId: PlayerId,
  action: BuildAction,
): string | null {
  if (state.phase !== PhaseType.Action) {
    return 'Can only build during the Action phase.';
  }
  const player = state.players[playerId];
  if (!player) return 'Player not found.';
  if (player.hasPassed) return 'Player has already passed.';
  if (!isPlayerTurn(state, playerId)) return 'Not this player\'s turn.';
  if (player.influenceDiscs.onTrack <= 0) return 'No influence discs available.';

  if (action.activations.length === 0) {
    return 'Must have at least one activation.';
  }

  const species = SPECIES[player.speciesId]!;
  const maxActivations = species.activationLimits.build +
    (playerHasTech(player, 'nanorobots') ? 1 : 0);
  if (action.activations.length > maxActivations) {
    return `Too many activations. Max ${maxActivations}.`;
  }

  for (let i = 0; i < action.activations.length; i++) {
    const activation = action.activations[i]!;
    const err = validateBuildActivation(state, playerId, activation);
    if (err) return `Activation ${i + 1}: ${err}`;
  }

  return null;
}

function validateBuildActivation(
  state: GameState,
  playerId: PlayerId,
  activation: BuildActivation,
): string | null {
  const player = state.players[playerId]!;
  const species = SPECIES[player.speciesId]!;
  const sectorKey = positionToKey(activation.sectorPosition);
  const sector = state.board.sectors[sectorKey];

  if (!sector) return 'Sector does not exist.';
  if (sector.influenceDisc !== playerId) return 'Player does not control this sector.';

  const buildType = activation.buildType;

  if (buildType === 'ORBITAL') {
    if (!playerHasTech(player, 'orbital_tech')) return 'Orbital tech not researched.';
    if (sector.structures.hasOrbital) return 'Sector already has an orbital.';
    const cost = species.buildingCosts.orbital;
    if (player.resources.materials < cost) return `Not enough materials. Need ${cost}.`;
  } else if (buildType === 'MONOLITH') {
    if (!playerHasTech(player, 'monolith_tech')) return 'Monolith tech not researched.';
    if (sector.structures.hasMonolith) return 'Sector already has a monolith.';
    const cost = species.buildingCosts.monolith;
    if (player.resources.materials < cost) return `Not enough materials. Need ${cost}.`;
  } else {
    // Ship type
    const shipType = buildType as ShipType;
    if (shipType === ShipType.Starbase && !playerHasTech(player, 'starbase_tech')) {
      return 'Starbase tech not researched.';
    }
    if (player.shipSupply[shipType] <= 0) {
      return `No ${shipType} available in ship supply.`;
    }
    const cost = species.buildingCosts[shipType];
    if (player.resources.materials < cost) return `Not enough materials. Need ${cost}.`;
  }

  return null;
}

export function executeBuild(
  state: GameState,
  playerId: PlayerId,
  action: BuildAction,
): GameState {
  let result = moveDiscToAction(state, playerId);

  // Increment action counter
  const player = result.players[playerId]!;
  result = updatePlayer(result, playerId, {
    actionsThisRound: {
      ...player.actionsThisRound,
      build: player.actionsThisRound.build + 1,
    },
  });

  let shipIdCounter = result.turnNumber * 1000 + Date.now() % 1000;

  for (const activation of action.activations) {
    const currentPlayer = result.players[playerId]!;
    const species = SPECIES[currentPlayer.speciesId]!;
    const sectorKey = positionToKey(activation.sectorPosition);

    if (activation.buildType === 'ORBITAL') {
      const cost = species.buildingCosts.orbital;
      result = adjustResources(result, playerId, { materials: -cost });
      result = updateSector(result, sectorKey, {
        structures: {
          ...result.board.sectors[sectorKey]!.structures,
          hasOrbital: true,
        },
      });
    } else if (activation.buildType === 'MONOLITH') {
      const cost = species.buildingCosts.monolith;
      result = adjustResources(result, playerId, { materials: -cost });
      result = updateSector(result, sectorKey, {
        structures: {
          ...result.board.sectors[sectorKey]!.structures,
          hasMonolith: true,
        },
      });
    } else {
      const shipType = activation.buildType as ShipType;
      const cost = species.buildingCosts[shipType];
      result = adjustResources(result, playerId, { materials: -cost });

      // Decrement ship supply
      const updatedPlayer = result.players[playerId]!;
      result = updatePlayer(result, playerId, {
        shipSupply: {
          ...updatedPlayer.shipSupply,
          [shipType]: updatedPlayer.shipSupply[shipType] - 1,
        },
      });

      // Place ship on sector
      shipIdCounter++;
      const ship: ShipOnBoard = {
        id: `ship_${playerId}_${shipIdCounter}`,
        type: shipType,
        owner: playerId,
        damage: 0,
        isRetreating: false,
        retreatTarget: null,
        entryOrder: shipIdCounter,
      };
      result = addShipToSector(result, ship, sectorKey);

      // Log event
      const event = createEvent('SHIP_BUILT', {
        playerId,
        shipType,
        sector: activation.sectorPosition,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, event) };
    }
  }

  return result;
}

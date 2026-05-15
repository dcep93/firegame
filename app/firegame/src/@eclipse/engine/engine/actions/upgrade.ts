import { PhaseType, ShipType } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import { SHIP_PARTS_BY_ID } from '@data/definitions/ship-parts';
import { DEFAULT_BLUEPRINTS } from '@data/definitions/default-blueprints';
import type {
  GameState,
  UpgradeAction,
  PlayerId,
} from '../types';
import {
  updatePlayer,
  updateBlueprint,
  moveDiscToAction,
} from '../state/state-helpers';
import { computeBlueprintStats } from '../state/blueprint-helpers';
import { isPlayerTurn, playerHasTech } from '../state/state-queries';
import { appendEvent, createEvent } from '../utils/events';

export function validateUpgrade(
  state: GameState,
  playerId: PlayerId,
  action: UpgradeAction,
): string | null {
  if (state.phase !== PhaseType.Action) {
    return 'Can only upgrade during the Action phase.';
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
  const maxActivations = species.activationLimits.upgrade +
    (playerHasTech(player, 'pico_modulator') ? 2 : 0);
  // Only placements (non-null partId) count toward activation limit; removals are free
  const placementCount = action.activations.filter(a => a.partId !== null).length;
  if (placementCount > maxActivations) {
    return `Too many activations. Max ${maxActivations}.`;
  }

  // Simulate blueprint changes to validate energy balance
  const blueprintCopies: Record<string, (string | null)[]> = {};
  // Track saved parts consumed by earlier activations in this action
  const remainingSavedParts = [...player.savedShipParts];

  for (let i = 0; i < action.activations.length; i++) {
    const activation = action.activations[i]!;
    const bp = player.blueprints[activation.shipType];
    if (!bp) return `Activation ${i + 1}: Invalid ship type.`;

    // Get or initialize working copy of grid
    const gridKey = activation.shipType;
    if (!blueprintCopies[gridKey]) {
      blueprintCopies[gridKey] = [...bp.grid[0]!];
    }
    const gridRow = blueprintCopies[gridKey]!;

    if (activation.slotIndex < 0 || activation.slotIndex >= gridRow.length) {
      return `Activation ${i + 1}: Invalid slot index ${activation.slotIndex}.`;
    }

    // Check if removing a fixed part
    const currentPart = gridRow[activation.slotIndex] ?? null;
    if (currentPart !== null && bp.fixedParts.includes(currentPart)) {
      return `Activation ${i + 1}: Cannot remove fixed part '${currentPart}'.`;
    }

    if (activation.partId !== null) {
      // Placing a part
      const part = SHIP_PARTS_BY_ID[activation.partId];
      if (!part) return `Activation ${i + 1}: Unknown part '${activation.partId}'.`;

      const savedIdx = remainingSavedParts.indexOf(part.id);
      const isSaved = savedIdx >= 0;

      // Discovery-only parts require being saved from a discovery tile
      if (part.isDiscoveryOnly && !isSaved) {
        return `Activation ${i + 1}: Part '${part.id}' is discovery-only and not in saved parts.`;
      }

      // Check tech requirement (saved discovery parts bypass tech reqs)
      if (part.unlockedByTech && !playerHasTech(player, part.unlockedByTech) && !isSaved) {
        return `Activation ${i + 1}: Required tech '${part.unlockedByTech}' not researched.`;
      }

      // Consume the saved part so it can't be used again in this action
      if (isSaved) {
        remainingSavedParts.splice(savedIdx, 1);
      }

      // Cannot put drives on starbases
      if (activation.shipType === ShipType.Starbase && part.category === 'drive') {
        return `Activation ${i + 1}: Cannot place drives on starbases.`;
      }

      gridRow[activation.slotIndex] = activation.partId;
    } else {
      // Remove only
      gridRow[activation.slotIndex] = null;
    }
  }

  // Check energy balance and movement on the FINAL state of each modified blueprint.
  // Intermediate states can be invalid — only the end result matters.
  for (const [shipType, gridRow] of Object.entries(blueprintCopies)) {
    const bp = player.blueprints[shipType as ShipType];
    const overrides = species.blueprintOverrides[shipType as ShipType];
    const baseDef = DEFAULT_BLUEPRINTS[shipType as ShipType];
    const stats = computeBlueprintStats(
      [gridRow],
      bp.fixedParts,
      baseDef,
      overrides,
      SHIP_PARTS_BY_ID,
    );

    if (stats.energyBalance < 0) {
      return `${shipType}: Final energy balance would be ${stats.energyBalance} (must be >= 0).`;
    }

    if (shipType !== ShipType.Starbase && stats.movement <= 0) {
      return `${shipType}: Ship must retain at least 1 movement.`;
    }
  }

  return null;
}

export function executeUpgrade(
  state: GameState,
  playerId: PlayerId,
  action: UpgradeAction,
): GameState {
  let result = moveDiscToAction(state, playerId);

  // Increment action counter
  const player = result.players[playerId]!;
  result = updatePlayer(result, playerId, {
    actionsThisRound: {
      ...player.actionsThisRound,
      upgrade: player.actionsThisRound.upgrade + 1,
    },
  });

  // Track modified blueprints
  const modifiedGrids: Map<ShipType, (string | null)[]> = new Map();

  for (const activation of action.activations) {
    const currentPlayer = result.players[playerId]!;
    const bp = currentPlayer.blueprints[activation.shipType];

    // Get working grid copy
    if (!modifiedGrids.has(activation.shipType)) {
      modifiedGrids.set(activation.shipType, [...bp.grid[0]!]);
    }
    const gridRow = modifiedGrids.get(activation.shipType)!;

    const removed = gridRow[activation.slotIndex];
    gridRow[activation.slotIndex] = activation.partId;

    // Consume saved ship part if used
    if (activation.partId !== null) {
      const currentP = result.players[playerId]!;
      const savedIdx = currentP.savedShipParts.indexOf(activation.partId);
      if (savedIdx >= 0) {
        const newSaved = [...currentP.savedShipParts];
        newSaved.splice(savedIdx, 1);
        result = updatePlayer(result, playerId, { savedShipParts: newSaved });
      }
    }

    // Recompute stats
    const species = SPECIES[currentPlayer.speciesId]!;
    const overrides = species.blueprintOverrides[activation.shipType];
    const baseDef = DEFAULT_BLUEPRINTS[activation.shipType];
    const computed = computeBlueprintStats(
      [gridRow],
      bp.fixedParts,
      baseDef,
      overrides,
      SHIP_PARTS_BY_ID,
    );

    result = updateBlueprint(result, playerId, activation.shipType, {
      ...bp,
      grid: [[...gridRow]],
      computed,
    });

    // Log event
    const event = createEvent('BLUEPRINT_UPGRADED', {
      playerId,
      shipType: activation.shipType,
      added: activation.partId,
      removed: removed ? [removed] : [],
    });
    result = { ...result, eventLog: appendEvent(result.eventLog, event) };
  }

  return result;
}

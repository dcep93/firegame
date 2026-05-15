import type { DieColor, ResourceType } from '@data/enums';
import { DICE_DAMAGE } from '@data/constants';
import type { GameState, PlayerId } from '../types';
import {
  sendBoardCubeToGraveyard,
  moveDiscToSector,
  returnDiscFromSector,
  updatePlayer,
  updateSector,
} from '../state/state-helpers';
import { playerHasTech } from '../state/state-queries';
import { appendEvent, createEvent } from '../utils/events';
import {
  getActiveShipsInSector,
  getShipCombatStats,
  isNpcOwner,
} from './combat-helpers';
import { rollWeaponDice } from './dice-rolling';
import { isHit } from './hit-determination';

export function calculatePopulationDamage(
  state: GameState,
  sectorKey: string,
  attackerId: PlayerId,
): { totalDamage: number; hasNeutronBombs: boolean; state: GameState } {
  const player = state.players[attackerId]!;
  const hasNeutronBombs = playerHasTech(player, 'neutron_bombs');

  if (hasNeutronBombs) {
    return { totalDamage: Infinity, hasNeutronBombs: true, state };
  }

  // Roll non-missile weapons of all attacker ships in sector
  const attackerShips = getActiveShipsInSector(state, sectorKey, attackerId);
  let totalDamage = 0;
  let current = state;

  for (const ship of attackerShips) {
    const stats = getShipCombatStats(ship, current);
    if (stats.weapons.length === 0) continue;

    const { rolls, state: newState } = rollWeaponDice(current, stats.weapons);
    current = newState;

    // Population has 0 shield
    for (const roll of rolls) {
      if (isHit(roll, stats.computerValue, 0)) {
        totalDamage += DICE_DAMAGE[roll.dieColor];
      }
    }
  }

  return { totalDamage, hasNeutronBombs: false, state: current };
}

/**
 * Roll weapon dice to calculate population damage, bypassing neutron bombs shortcircuit.
 * Used when neutron bombs are blocked by Neutron Absorber and we need actual weapon rolls.
 */
function calculatePopulationDamageByWeapons(
  state: GameState,
  sectorKey: string,
  attackerId: PlayerId,
): { totalDamage: number; rollDetails: readonly { dieColor: DieColor; faceValue: number; isHit: boolean }[]; state: GameState } {
  const attackerShips = getActiveShipsInSector(state, sectorKey, attackerId);
  let totalDamage = 0;
  let current = state;
  const rollDetails: { dieColor: DieColor; faceValue: number; isHit: boolean }[] = [];

  for (const ship of attackerShips) {
    const stats = getShipCombatStats(ship, current);
    if (stats.weapons.length === 0) continue;

    const { rolls, state: newState } = rollWeaponDice(current, stats.weapons);
    current = newState;

    for (const roll of rolls) {
      const hit = isHit(roll, stats.computerValue, 0);
      rollDetails.push({ dieColor: roll.dieColor, faceValue: roll.faceValue, isHit: hit });
      if (hit) {
        totalDamage += DICE_DAMAGE[roll.dieColor];
      }
    }
  }

  return { totalDamage, rollDetails, state: current };
}

/**
 * Destroy an orbital population cube in combat.
 * Moves cube to graveyard (using the orbital's track), clears orbital, logs event.
 */
export function destroyOrbitalPopulation(
  state: GameState,
  sectorKey: string,
  sectorOwner: PlayerId,
  attackerId: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const orbitalPop = sector.structures.orbitalPopulation;
  if (!orbitalPop) return state;

  let result = sendBoardCubeToGraveyard(state, sectorOwner, orbitalPop.track);
  result = updateSector(result, sectorKey, {
    structures: { ...sector.structures, orbitalPopulation: null },
  });
  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('POPULATION_DESTROYED', {
        sector: sector.position,
        track: orbitalPop.track,
        destroyedBy: attackerId,
      }),
    ),
  };
  return result;
}

export function attackPopulation(
  state: GameState,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  if (sector.populations.length === 0 && !sector.structures.orbitalPopulation) return state;

  // Find the attacker (player with ships who doesn't own the sector)
  const sectorOwner = sector.influenceDisc;
  if (!sectorOwner) return state;

  const attackerOwners = new Set<string>();
  for (const ship of sector.ships) {
    if (!isNpcOwner(ship.owner) && ship.owner !== sectorOwner) {
      attackerOwners.add(ship.owner);
    }
  }

  if (attackerOwners.size === 0) return state;
  const attackerId = Array.from(attackerOwners)[0]! as PlayerId;

  const defenderPlayer = state.players[sectorOwner]!;

  // Planta population auto-destroyed
  const isPlanta = defenderPlayer.speciesId === 'planta';

  // Check Neutron Absorber
  const hasNeutronAbsorber = playerHasTech(defenderPlayer, 'neutron_absorber');

  let result = state;

  if (isPlanta) {
    // Auto-destroy all population
    for (const pop of sector.populations) {
      result = sendBoardCubeToGraveyard(result, sectorOwner, pop.sourceTrack);
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('POPULATION_DESTROYED', {
            sector: sector.position,
            track: pop.sourceTrack,
            destroyedBy: attackerId,
          }),
        ),
      };
    }
    result = updateSector(result, sectorKey, { populations: [] });
    result = destroyOrbitalPopulation(result, sectorKey, sectorOwner, attackerId);
    return result;
  }

  // Check for neutron bombs
  const hasNeutronBombs = playerHasTech(state.players[attackerId]!, 'neutron_bombs');

  if (hasNeutronBombs && !hasNeutronAbsorber) {
    // Neutron bombs (no absorber): auto-destroy all population (including orbital) — no rolls
    const currentSector = result.board.sectors[sectorKey]!;
    for (const pop of currentSector.populations) {
      result = sendBoardCubeToGraveyard(result, sectorOwner, pop.sourceTrack);
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('POPULATION_DESTROYED', {
            sector: sector.position,
            track: pop.sourceTrack,
            destroyedBy: attackerId,
          }),
        ),
      };
    }
    result = updateSector(result, sectorKey, { populations: [] });
    result = destroyOrbitalPopulation(result, sectorKey, sectorOwner, attackerId);
    return result;
  }

  // Roll weapon dice and create interactive BOMBARDMENT_CHOICE sub-phase.
  // This also handles neutron bombs + absorber: we roll actual weapons instead of using Infinity.
  const {
    totalDamage,
    rollDetails,
    state: afterRolls,
  } = calculatePopulationDamageByWeapons(result, sectorKey, attackerId);
  result = afterRolls;

  const orbitalPop = result.board.sectors[sectorKey]!.structures.orbitalPopulation;
  return {
    ...result,
    subPhase: {
      type: 'BOMBARDMENT_CHOICE',
      playerId: attackerId,
      sectorKey,
      totalDamage,
      rolls: rollDetails,
      hasOrbitalPop: !!orbitalPop,
      orbitalTrack: orbitalPop?.track ?? null,
    },
  };
}

export function performPerBattleBombardment(
  state: GameState,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const markDone = (s: GameState): GameState => {
    let result: GameState = {
      ...s,
      combatState: { ...s.combatState!, bombardmentDone: true },
    };
    // Per rules: if all population cubes are destroyed and an enemy has ships,
    // remove the defender's influence disc immediately.
    const updatedSector = result.board.sectors[sectorKey]!;
    if (
      updatedSector.influenceDisc &&
      updatedSector.populations.length === 0 &&
      !updatedSector.structures.orbitalPopulation &&
      updatedSector.ships.some(
        sh => !isNpcOwner(sh.owner) && sh.owner !== updatedSector.influenceDisc,
      )
    ) {
      result = returnDiscFromSector(result, updatedSector.influenceDisc);
      result = updateSector(result, sectorKey, { influenceDisc: null });
    }
    return result;
  };

  // No population (including orbital) → skip
  if (sector.populations.length === 0 && !sector.structures.orbitalPopulation) return markDone(state);

  // Find attacker (non-owner player with ships in sector)
  const sectorOwner = sector.influenceDisc;
  if (!sectorOwner) return markDone(state);

  const attackerOwners = new Set<string>();
  for (const ship of sector.ships) {
    if (!isNpcOwner(ship.owner) && ship.owner !== sectorOwner) {
      attackerOwners.add(ship.owner);
    }
  }
  if (attackerOwners.size === 0) return markDone(state);
  const attackerId = Array.from(attackerOwners)[0]! as PlayerId;

  const defenderPlayer = state.players[sectorOwner]!;

  // Planta: auto-destroy all population (including orbital)
  if (defenderPlayer.speciesId === 'planta') {
    let result = state;
    for (const pop of sector.populations) {
      result = sendBoardCubeToGraveyard(result, sectorOwner, pop.sourceTrack);
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('POPULATION_DESTROYED', {
            sector: sector.position,
            track: pop.sourceTrack,
            destroyedBy: attackerId,
          }),
        ),
      };
    }
    result = updateSector(result, sectorKey, { populations: [] });
    result = destroyOrbitalPopulation(result, sectorKey, sectorOwner, attackerId);
    return markDone(result);
  }

  // Check Neutron Absorber
  const hasNeutronAbsorber = playerHasTech(defenderPlayer, 'neutron_absorber');

  // Check for neutron bombs
  const attackerPlayer = state.players[attackerId]!;
  const hasNeutronBombs = playerHasTech(attackerPlayer, 'neutron_bombs');

  // Neutron bombs (no absorber): auto-destroy all (including orbital) — no rolls needed
  if (hasNeutronBombs && !hasNeutronAbsorber) {
    let result = state;
    for (const pop of sector.populations) {
      result = sendBoardCubeToGraveyard(result, sectorOwner, pop.sourceTrack);
      result = {
        ...result,
        eventLog: appendEvent(
          result.eventLog,
          createEvent('POPULATION_DESTROYED', {
            sector: sector.position,
            track: pop.sourceTrack,
            destroyedBy: attackerId,
          }),
        ),
      };
    }
    result = updateSector(result, sectorKey, { populations: [] });
    result = destroyOrbitalPopulation(result, sectorKey, sectorOwner, attackerId);
    return markDone(result);
  }

  // Roll weapon dice (handles neutron bombs + absorber case too,
  // since calculatePopulationDamage will roll weapons when bombs are blocked)
  const {
    totalDamage,
    rollDetails,
    state: afterRolls,
  } = calculatePopulationDamageByWeapons(state, sectorKey, attackerId);

  // Always show bombardment rolls to the attacker so they see what happened.
  // The client handles 3 modes: all misses (damage=0), overkill (damage>=pops),
  // and partial (interactive choice).
  const orbitalPop = state.board.sectors[sectorKey]!.structures.orbitalPopulation;
  return {
    ...afterRolls,
    combatState: { ...afterRolls.combatState!, bombardmentDone: true },
    subPhase: {
      type: 'BOMBARDMENT_CHOICE',
      playerId: attackerId,
      sectorKey,
      totalDamage,
      rolls: rollDetails,
      hasOrbitalPop: !!orbitalPop,
      orbitalTrack: orbitalPop?.track ?? null,
    },
  };
}

export function applyPopulationDestruction(
  state: GameState,
  sectorKey: string,
  attackerId: PlayerId,
  cubeChoices: readonly { track: ResourceType; slotIndex: number }[],
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const sectorOwner = sector.influenceDisc;
  if (!sectorOwner) return state;

  let result = state;

  for (const choice of cubeChoices) {
    result = sendBoardCubeToGraveyard(result, sectorOwner, choice.track);
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('POPULATION_DESTROYED', {
          sector: sector.position,
          track: choice.track,
          destroyedBy: attackerId,
        }),
      ),
    };
  }

  // Remove populations from sector
  const currentSector = result.board.sectors[sectorKey]!;
  const remaining = currentSector.populations.slice(cubeChoices.length);
  result = updateSector(result, sectorKey, { populations: remaining });

  return result;
}

export function canInfluenceSector(
  state: GameState,
  sectorKey: string,
  playerId: PlayerId,
): boolean {
  const sector = state.board.sectors[sectorKey];
  if (!sector) return false;

  // Player must have ships in sector
  const playerShips = sector.ships.filter(
    (s) => s.owner === playerId && !s.isRetreating,
  );
  if (playerShips.length === 0) return false;

  // No enemy population cubes (sector must be either unowned or owned by player)
  if (sector.influenceDisc !== null && sector.influenceDisc !== playerId) {
    // If the current owner still has population (including orbital), can't influence
    if (sector.populations.length > 0) return false;
    if (sector.structures.orbitalPopulation) return false;
  }

  // No enemy (non-NPC) ships
  const hasEnemyShips = sector.ships.some(
    (s) => !isNpcOwner(s.owner) && s.owner !== playerId,
  );
  if (hasEnemyShips) return false;

  return true;
}

export function influenceSector(
  state: GameState,
  sectorKey: string,
  playerId: PlayerId,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  let result = state;

  // Remove existing influence disc if any
  if (sector.influenceDisc !== null && sector.influenceDisc !== playerId) {
    result = returnDiscFromSector(result, sector.influenceDisc);
  }

  // Place player's influence disc
  if (sector.influenceDisc !== playerId) {
    result = moveDiscToSector(result, playerId);
    result = updateSector(result, sectorKey, { influenceDisc: playerId });
  }

  // Log event
  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('INFLUENCE_PLACED', {
        playerId,
        sector: sector.position,
      }),
    ),
  };

  return result;
}

export function claimDiscovery(
  state: GameState,
  sectorKey: string,
  playerId: PlayerId,
  decision: 'USE_REWARD' | 'KEEP_VP',
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  if (!sector.discoveryTile) return state;

  const tileId = sector.discoveryTile;
  let result = state;

  // Remove tile from sector
  result = updateSector(result, sectorKey, { discoveryTile: null });

  if (decision === 'KEEP_VP') {
    const player = result.players[playerId]!;
    result = updatePlayer(result, playerId, {
      discoveryTilesKeptForVP: [...player.discoveryTilesKeptForVP, tileId],
    });
  }

  // Log event
  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('DISCOVERY_CLAIMED', {
        playerId,
        tileId,
        decision,
      }),
    ),
  };

  return result;
}

export function repairAllDamage(state: GameState): GameState {
  const updatedSectors = { ...state.board.sectors };

  for (const [key, sector] of Object.entries(updatedSectors)) {
    const haseDamaged = sector.ships.some((s) => s.damage > 0);
    if (haseDamaged) {
      updatedSectors[key] = {
        ...sector,
        ships: sector.ships.map((s) =>
          s.damage > 0 ? { ...s, damage: 0 } : s,
        ),
      };
    }
  }

  return {
    ...state,
    board: {
      ...state.board,
      sectors: updatedSectors,
    },
  };
}

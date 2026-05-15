import { TECH_CLEANUP_DRAW, TOTAL_ROUNDS, NON_RARE_TILE_COUNT, RARE_TILE_COUNT } from '@data/constants';
import { TECHS_BY_ID } from '@data/definitions/index';
import { ActionType, PhaseType, TechCategory } from '@data/enums';
import type {
  GameState,
} from '../types';
import {
  returnActionDiscs,
  updatePlayer,
  returnCubeToTrack,
} from '../state/state-helpers';
import { getPlayerTechs } from '../state/state-queries';
import { appendEvent, createEvent } from '../utils/events';
import { shuffle } from '../utils/rng';
import { calculateScores } from '../scoring/scoring';
import type { ResourceType } from '@data/enums';

export function processCleanupPhase(state: GameState): GameState {
  let result = state;

  // Step 1: Draw new tech tiles
  result = drawNewTechTiles(result);

  // Step 2: Return influence discs for all non-eliminated players
  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    // Return action discs to track
    result = returnActionDiscs(result, playerId);

    // Return reaction discs to track
    const updatedPlayer = result.players[playerId]!;
    result = updatePlayer(result, playerId, {
      influenceDiscs: {
        ...updatedPlayer.influenceDiscs,
        onTrack:
          updatedPlayer.influenceDiscs.onTrack +
          updatedPlayer.influenceDiscs.onReactions,
        onReactions: 0,
      },
      actionsThisRound: {
        [ActionType.Explore]: 0,
        [ActionType.Research]: 0,
        [ActionType.Upgrade]: 0,
        [ActionType.Build]: 0,
        [ActionType.Move]: 0,
        [ActionType.Influence]: 0,
      },
      reactionsThisRound: {},
    });
  }

  // Step 3: Return graveyard cubes
  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    for (const track of ['materials', 'science', 'money'] as const) {
      const graveyardCount = player.graveyard[track];
      for (let i = 0; i < graveyardCount; i++) {
        result = returnCubeToTrack(result, playerId, track as ResourceType);
      }
    }

    // Reset graveyard
    result = updatePlayer(result, playerId, {
      graveyard: { materials: 0, science: 0, money: 0 },
    });
  }

  // Step 4: Flip colony ships faceup
  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    result = updatePlayer(result, playerId, {
      colonyShips: {
        ...player.colonyShips,
        available: player.colonyShips.total,
      },
    });
  }

  // Step 5: Reset pass status
  for (const playerId of result.turnOrder) {
    const player = result.players[playerId]!;
    if (player.eliminated) continue;

    result = updatePlayer(result, playerId, { hasPassed: false });
  }
  result = {
    ...result,
    passOrder: [],
    actionPhaseComplete: false,
  };

  // Step 6: Advance round
  const newRound = result.round + 1;

  if (newRound > TOTAL_ROUNDS) {
    const scores = calculateScores(result);
    const event = createEvent('GAME_ENDED', { scores });
    return {
      ...result,
      round: newRound,
      phase: PhaseType.GameOver,
      eventLog: appendEvent(result.eventLog, event),
    };
  }

  // Reorder turn: start player goes first, then clockwise
  const newTurnOrder = reorderTurnOrder(result.turnOrder, result.startPlayer);

  const event = createEvent('PHASE_CHANGED', {
    from: PhaseType.Cleanup,
    to: PhaseType.Action,
    round: newRound,
  });

  return {
    ...result,
    round: newRound,
    phase: PhaseType.Action,
    turnOrder: newTurnOrder,
    currentPlayerIndex: 0,
    eventLog: appendEvent(result.eventLog, event),
  };
}

function drawNewTechTiles(state: GameState): GameState {
  // Count how many copies of each tech are on the tray
  const trayCounts = new Map<string, number>();
  for (const category of ['military', 'grid', 'nano', 'rare'] as const) {
    for (const slot of state.techTray[category]) {
      trayCounts.set(slot.techId, slot.count);
    }
  }

  // Count how many players own each tech (via research or starting techs)
  const ownedCounts = new Map<string, number>();
  for (const player of Object.values(state.players)) {
    for (const techId of getPlayerTechs(player)) {
      ownedCounts.set(techId, (ownedCounts.get(techId) ?? 0) + 1);
    }
  }

  // Build the bag: for each tech, remaining copies = total - onTray - ownedByPlayers
  const bag: string[] = [];
  for (const tech of Object.values(TECHS_BY_ID)) {
    const totalCopies = tech.isRare ? RARE_TILE_COUNT : NON_RARE_TILE_COUNT;
    const onTray = trayCounts.get(tech.id) ?? 0;
    const owned = ownedCounts.get(tech.id) ?? 0;
    const inBag = Math.max(0, totalCopies - onTray - owned);
    for (let i = 0; i < inBag; i++) {
      bag.push(tech.id);
    }
  }

  const [shuffled, newRng] = shuffle(state.rngState, bag);
  let result: GameState = { ...state, rngState: newRng };

  // Draw until we get the target number of NON-RARE tiles.
  // Rare tiles drawn along the way go to the rare row but don't count.
  // Duplicates stack (increment count on existing slot).
  const targetNonRare = TECH_CLEANUP_DRAW[state.config.playerCount] ?? 5;

  // Build mutable maps from existing tray for easy stacking
  const trayMaps = {
    military: new Map(result.techTray.military.map(s => [s.techId, { ...s }])),
    grid: new Map(result.techTray.grid.map(s => [s.techId, { ...s }])),
    nano: new Map(result.techTray.nano.map(s => [s.techId, { ...s }])),
    rare: new Map(result.techTray.rare.map(s => [s.techId, { ...s }])),
  };
  let nonRareDrawn = 0;

  for (const techId of shuffled) {
    if (nonRareDrawn >= targetNonRare) break;
    const tech = TECHS_BY_ID[techId]!;

    if (tech.isRare) {
      const existing = trayMaps.rare.get(techId);
      trayMaps.rare.set(techId, { techId, count: (existing?.count ?? 0) + 1 });
    } else {
      nonRareDrawn++;
      const catKey = tech.category === TechCategory.Military ? 'military'
        : tech.category === TechCategory.Grid ? 'grid'
        : 'nano';
      const existing = trayMaps[catKey].get(techId);
      trayMaps[catKey].set(techId, { techId, count: (existing?.count ?? 0) + 1 });
    }
  }

  result = {
    ...result,
    techTray: {
      military: Array.from(trayMaps.military.values()),
      grid: Array.from(trayMaps.grid.values()),
      nano: Array.from(trayMaps.nano.values()),
      rare: Array.from(trayMaps.rare.values()),
    },
  };

  return result;
}

function reorderTurnOrder(
  turnOrder: readonly string[],
  startPlayer: string,
): readonly string[] {
  const idx = turnOrder.indexOf(startPlayer);
  if (idx <= 0) return turnOrder;
  return [...turnOrder.slice(idx), ...turnOrder.slice(0, idx)];
}

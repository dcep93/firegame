import { PhaseType, TechCategory } from '@data/enums';
import { TECH_TRACK_CAPACITY } from '@data/constants';
import { SPECIES } from '@data/definitions/species';
import { TECHS_BY_ID } from '@data/definitions/techs';
import type { TechEffect } from '@data/types/tech';
import type {
  GameState,
  ResearchAction,
  PlayerId,
} from '../types';
import {
  updatePlayer,
  adjustResources,
  removeTechFromTray,
  addTechToPlayer,
  moveDiscToAction,
  updateSector,
} from '../state/state-helpers';
import {
  isPlayerTurn,
  playerHasTech,
  getTechDiscount,
} from '../state/state-queries';
import { appendEvent, createEvent } from '../utils/events';
import { nextInt } from '../utils/rng';

export function validateResearch(
  state: GameState,
  playerId: PlayerId,
  action: ResearchAction,
): string | null {
  if (state.phase !== PhaseType.Action) {
    return 'Can only research during the Action phase.';
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
  if (action.activations.length > species.activationLimits.research) {
    return `Too many activations. Max ${species.activationLimits.research}.`;
  }

  // Validate each activation
  // Need to track running cost and tech state changes
  let totalScienceCost = 0;
  const techsToResearch = new Set<string>();

  for (let i = 0; i < action.activations.length; i++) {
    const activation = action.activations[i]!;
    const tech = TECHS_BY_ID[activation.techId];
    if (!tech) return `Activation ${i + 1}: Unknown tech '${activation.techId}'.`;

    // Check uniqueness across activations
    if (techsToResearch.has(activation.techId)) {
      return `Activation ${i + 1}: Duplicate tech '${activation.techId}'.`;
    }
    techsToResearch.add(activation.techId);

    // Check player doesn't already have it
    if (playerHasTech(player, activation.techId)) {
      return `Activation ${i + 1}: Player already has '${activation.techId}'.`;
    }

    // Check tech available in tray
    const trayCategory = tech.category as keyof typeof state.techTray;
    const traySlot = state.techTray[trayCategory].find(
      (s) => s.techId === activation.techId,
    );
    if (!traySlot || traySlot.count <= 0) {
      return `Activation ${i + 1}: Tech '${activation.techId}' not available in tray.`;
    }

    // Rare techs require trackChoice; non-rare must not have one
    const isRare = tech.category === TechCategory.Rare;
    if (isRare && !activation.trackChoice) {
      return `Activation ${i + 1}: Rare tech '${activation.techId}' requires a trackChoice.`;
    }
    if (!isRare && activation.trackChoice) {
      return `Activation ${i + 1}: Non-rare tech '${activation.techId}' must not have trackChoice.`;
    }
    if (activation.trackChoice && !['military', 'grid', 'nano'].includes(activation.trackChoice)) {
      return `Activation ${i + 1}: Invalid trackChoice '${activation.trackChoice}'.`;
    }

    // Check track capacity (max TECH_TRACK_CAPACITY per player track)
    const targetTrack: 'military' | 'grid' | 'nano' = isRare
      ? activation.trackChoice!
      : tech.category as 'military' | 'grid' | 'nano';
    const currentTrackLen = player.techTracks[targetTrack].length;
    // Count earlier activations in this action that also target this track
    let pendingOnTrack = 0;
    for (let j = 0; j < i; j++) {
      const prev = action.activations[j]!;
      const prevTech = TECHS_BY_ID[prev.techId]!;
      const prevIsRare = prevTech.category === TechCategory.Rare;
      const prevTrack = prevIsRare ? prev.trackChoice! : prevTech.category;
      if (prevTrack === targetTrack) pendingOnTrack++;
    }
    if (currentTrackLen + pendingOnTrack >= TECH_TRACK_CAPACITY) {
      return `Activation ${i + 1}: ${targetTrack} track is full (${TECH_TRACK_CAPACITY} max).`;
    }

    // Compute cost
    const trackCategory = isRare
      ? (activation.trackChoice as TechCategory)
      : tech.category;
    const discount = getTechDiscount(player, trackCategory) + i; // earlier activations give discount
    const effectiveCost = Math.max(tech.maxCost - discount, tech.minCost);
    totalScienceCost += effectiveCost;
  }

  if (player.resources.science < totalScienceCost) {
    return `Not enough science. Need ${totalScienceCost}, have ${player.resources.science}.`;
  }

  return null;
}


export function executeResearch(
  state: GameState,
  playerId: PlayerId,
  action: ResearchAction,
): GameState {
  let result = moveDiscToAction(state, playerId);

  // Increment action counter
  const player = result.players[playerId]!;
  result = updatePlayer(result, playerId, {
    actionsThisRound: {
      ...player.actionsThisRound,
      research: player.actionsThisRound.research + 1,
    },
  });

  for (let i = 0; i < action.activations.length; i++) {
    const activation = action.activations[i]!;
    const tech = TECHS_BY_ID[activation.techId]!;
    const currentPlayer = result.players[playerId]!;
    const isRare = tech.category === TechCategory.Rare;

    // Compute cost
    const trackCategory = isRare
      ? (activation.trackChoice as TechCategory)
      : tech.category;
    const discount = getTechDiscount(currentPlayer, trackCategory);
    const effectiveCost = Math.max(tech.maxCost - discount, tech.minCost);

    // Deduct science
    result = adjustResources(result, playerId, { science: -effectiveCost });

    // Remove from tray
    result = removeTechFromTray(result, activation.techId);

    // Add to player (rare techs go on the chosen track)
    result = addTechToPlayer(result, playerId, activation.techId, activation.trackChoice);

    // Log event
    const event = createEvent('TECH_RESEARCHED', {
      playerId,
      techId: activation.techId,
      cost: effectiveCost,
    });
    result = { ...result, eventLog: appendEvent(result.eventLog, event) };

    // Process instant tech effects
    if (tech.effect) {
      result = processInstantEffect(result, playerId, activation.techId, tech.effect);
    }
  }

  return result;
}

function processInstantEffect(
  state: GameState,
  playerId: PlayerId,
  techId: string,
  effect: TechEffect,
): GameState {
  let result = state;

  switch (effect.type) {
    case 'instant_influence_discs': {
      const count = (effect.params as { count: number }).count;
      const player = result.players[playerId]!;
      result = updatePlayer(result, playerId, {
        influenceDiscs: {
          ...player.influenceDiscs,
          total: player.influenceDiscs.total + count,
          onTrack: player.influenceDiscs.onTrack + count,
        },
      });
      const evt = createEvent('INSTANT_EFFECT', {
        playerId,
        techId,
        effectType: effect.type,
        description: `Gained ${count} influence disc${count > 1 ? 's' : ''}`,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, evt) };
      break;
    }
    case 'instant_artifact_resources': {
      const { totalResources, increment } = effect.params as { totalResources: number; increment: number };
      result = {
        ...result,
        subPhase: {
          type: 'ARTIFACT_RESOURCE_CHOICE',
          playerId,
          totalResources,
          increment,
        },
      };
      const evt = createEvent('INSTANT_EFFECT', {
        playerId,
        techId,
        effectType: effect.type,
        description: `Choose how to distribute ${totalResources} resources`,
      });
      result = { ...result, eventLog: appendEvent(result.eventLog, evt) };
      break;
    }

    case 'instant_warp_portal': {
      // Collect controlled sectors without a warp portal
      const eligible: string[] = [];
      for (const [key, sector] of Object.entries(result.board.sectors)) {
        if (sector.influenceDisc === playerId && !sector.hasWarpPortal) {
          eligible.push(key);
        }
      }
      if (eligible.length === 1) {
        // Auto-place when only one option
        result = updateSector(result, eligible[0]!, { hasWarpPortal: true });
        const evt = createEvent('INSTANT_EFFECT', {
          playerId,
          techId,
          effectType: effect.type,
          description: `Placed Warp Portal on controlled sector`,
        });
        result = { ...result, eventLog: appendEvent(result.eventLog, evt) };
      } else if (eligible.length >= 2) {
        // Let the player choose
        result = {
          ...result,
          subPhase: {
            type: 'WARP_PORTAL_CHOICE',
            playerId,
            eligibleSectors: eligible,
          },
        };
        const evt = createEvent('INSTANT_EFFECT', {
          playerId,
          techId,
          effectType: effect.type,
          description: `Choose a sector for Warp Portal placement`,
        });
        result = { ...result, eventLog: appendEvent(result.eventLog, evt) };
      }
      break;
    }

    case 'instant_discovery_draw': {
      const count = (effect.params as { count: number }).count;
      for (let i = 0; i < count; i++) {
        if (result.discoveryDeck.length === 0) break;
        const deck = [...result.discoveryDeck];
        const [discIndex, newRng] = nextInt(result.rngState, 0, deck.length - 1);
        const tileId = deck[discIndex]!;
        deck.splice(discIndex, 1);
        result = { ...result, discoveryDeck: deck, rngState: newRng };

        // Set up DISCOVERY_DECISION sub-phase (fromTech: no sector context)
        result = {
          ...result,
          subPhase: {
            type: 'DISCOVERY_DECISION',
            playerId,
            tileId,
            sectorKey: '',
            fromTech: true,
          },
        };
        const evt = createEvent('INSTANT_EFFECT', {
          playerId,
          techId,
          effectType: effect.type,
          description: `Drew discovery tile from deck`,
        });
        result = { ...result, eventLog: appendEvent(result.eventLog, evt) };
      }
      break;
    }

    default:
      break;
  }

  return result;
}

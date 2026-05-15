import { PhaseType, TechCategory } from '@data/enums';
import { TECH_TRACK_CAPACITY } from '@data/constants';
import { TECHS_BY_ID } from '@data/definitions/techs';
import type {
  GameState,
  ResearchAction,
  PlayerId,
} from '../types';
import {
  isPlayerTurn,
  playerHasTech,
  getTechDiscount,
} from '../state/state-queries';

const TRACK_KEYS = ['military', 'grid', 'nano'] as const;

/**
 * Enumerate all single-activation research actions available to a player.
 * Returns one ResearchAction per affordable, unowned tech in the tray.
 * For rare techs, emits one action per valid track choice (military/grid/nano).
 * Skips tracks that are already at capacity (TECH_TRACK_CAPACITY).
 */
export function getLegalResearchActions(
  state: GameState,
  playerId: PlayerId,
): readonly ResearchAction[] {
  // Gate checks
  if (state.phase !== PhaseType.Action) return [];
  const player = state.players[playerId];
  if (!player) return [];
  if (player.hasPassed) return [];
  if (!isPlayerTurn(state, playerId)) return [];
  if (player.influenceDiscs.onTrack <= 0) return [];

  const results: ResearchAction[] = [];
  const categories = ['military', 'grid', 'nano', 'rare'] as const;

  for (const category of categories) {
    const slots = state.techTray[category];
    for (const slot of slots) {
      if (slot.count <= 0) continue;

      const tech = TECHS_BY_ID[slot.techId];
      if (!tech) continue;

      // Skip if player already has it
      if (playerHasTech(player, slot.techId)) continue;

      if (tech.category === TechCategory.Rare) {
        // Rare tech: emit one action per track where affordable AND not full
        for (const track of TRACK_KEYS) {
          if (player.techTracks[track].length >= TECH_TRACK_CAPACITY) continue;

          const discount = getTechDiscount(player, track as TechCategory);
          const cost = Math.max(tech.maxCost - discount, tech.minCost);
          if (cost > player.resources.science) continue;

          results.push({
            type: 'RESEARCH',
            activations: [{ techId: slot.techId, trackChoice: track }],
          });
        }
      } else {
        // Non-rare: skip if that category's track is full
        const trackKey = tech.category as 'military' | 'grid' | 'nano';
        if (player.techTracks[trackKey].length >= TECH_TRACK_CAPACITY) continue;

        const discount = getTechDiscount(player, tech.category);
        const cost = Math.max(tech.maxCost - discount, tech.minCost);
        if (cost > player.resources.science) continue;

        results.push({
          type: 'RESEARCH',
          activations: [{ techId: slot.techId }],
        });
      }
    }
  }

  return results;
}

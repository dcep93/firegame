import type { GameEvent } from '@eclipse/shared';

/**
 * Player lookup info passed to the formatter.
 */
export interface PlayerLookup {
  /** Map of playerId → { nickname, color } */
  players: Map<string, { nickname: string; color: string }>;
  /** The current user's playerId */
  myId: string;
}

interface FormattedEvent {
  /** Icon/emoji-free short symbol for the event category */
  icon: string;
  /** CSS color for the icon */
  iconColor: string;
  /** Main description text */
  text: string;
  /** Optional player color for the left accent bar */
  playerColor: string | null;
  /** Category label for visual grouping */
  category: 'combat' | 'build' | 'economy' | 'diplomacy' | 'phase' | 'misc';
}

function playerName(lookup: PlayerLookup, pid: string): string {
  if (pid === lookup.myId) return 'You';
  const p = lookup.players.get(pid);
  return p?.nickname ?? pid;
}

function playerColor(lookup: PlayerLookup, pid: string): string | null {
  const p = lookup.players.get(pid);
  return p ? `var(--player-${p.color})` : null;
}

function ownerName(lookup: PlayerLookup, owner: string): string {
  // NPC types: 'ancient', 'guardian', 'gcds'
  if (owner === 'ancient') return 'Ancient';
  if (owner === 'guardian') return 'Guardian';
  if (owner === 'gcds') return 'GCDS';
  return playerName(lookup, owner);
}

function ownerColor(lookup: PlayerLookup, owner: string): string | null {
  if (owner === 'ancient' || owner === 'guardian' || owner === 'gcds') return null;
  return playerColor(lookup, owner);
}

function coordStr(coord: { q: number; r: number }): string {
  return `(${coord.q},${coord.r})`;
}

function shipLabel(shipType: string): string {
  return shipType.charAt(0).toUpperCase() + shipType.slice(1);
}

function resourceLabel(track: string): string {
  if (track === 'money') return 'Money';
  if (track === 'science') return 'Science';
  if (track === 'materials') return 'Materials';
  return track;
}

function phaseLabel(phase: string): string {
  if (phase === 'action') return 'Action';
  if (phase === 'combat') return 'Combat';
  if (phase === 'upkeep') return 'Upkeep';
  if (phase === 'cleanup') return 'Cleanup';
  if (phase === 'setup') return 'Setup';
  if (phase === 'game_over') return 'Game Over';
  return phase;
}

function techLabel(techId: string): string {
  // Convert IDs like "plasma_missile" → "Plasma Missile"
  return techId
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatEvent(event: GameEvent, lookup: PlayerLookup): FormattedEvent {
  switch (event.type) {
    case 'PHASE_CHANGED':
      return {
        icon: 'R' + event.round,
        iconColor: 'var(--accent-blue)',
        text: `${phaseLabel(event.to)} phase`,
        playerColor: null,
        category: 'phase',
      };

    case 'TECH_RESEARCHED': {
      const pid = event.playerId;
      return {
        icon: 'R',
        iconColor: 'var(--accent-purple, #ab47bc)',
        text: `${playerName(lookup, pid)} researched ${techLabel(event.techId)} (-${event.cost} sci)`,
        playerColor: playerColor(lookup, pid),
        category: 'economy',
      };
    }

    case 'SHIP_BUILT': {
      const pid = event.playerId;
      return {
        icon: 'B',
        iconColor: 'var(--accent-green)',
        text: `${playerName(lookup, pid)} built ${shipLabel(event.shipType)} at ${coordStr(event.sector)}`,
        playerColor: playerColor(lookup, pid),
        category: 'build',
      };
    }

    case 'SHIP_MOVED': {
      const pid = event.playerId;
      return {
        icon: 'M',
        iconColor: 'var(--accent-blue)',
        text: `${playerName(lookup, pid)} moved ship ${coordStr(event.from)} → ${coordStr(event.to)}`,
        playerColor: playerColor(lookup, pid),
        category: 'misc',
      };
    }

    case 'SECTOR_EXPLORED': {
      const pid = event.playerId;
      return {
        icon: 'E',
        iconColor: 'var(--accent-yellow)',
        text: `${playerName(lookup, pid)} explored ${coordStr(event.position)}${event.placed ? '' : ' (discarded)'}`,
        playerColor: playerColor(lookup, pid),
        category: 'misc',
      };
    }

    case 'BATTLE_STARTED':
      return {
        icon: '!',
        iconColor: 'var(--accent-red)',
        text: `Battle at ${coordStr(event.sector)} — ${event.participants.map(p => ownerName(lookup, p)).join(' vs ')}`,
        playerColor: null,
        category: 'combat',
      };

    case 'DICE_ROLLED': {
      const hits = event.dice.filter(d => d.isHit).length;
      const total = event.dice.length;
      return {
        icon: 'D',
        iconColor: 'var(--accent-orange, #ff9800)',
        text: `${ownerName(lookup, event.roller)} rolled ${shipLabel(event.shipType)}: ${hits}/${total} hits`,
        playerColor: ownerColor(lookup, event.roller),
        category: 'combat',
      };
    }

    case 'SHIP_DESTROYED':
      return {
        icon: 'X',
        iconColor: 'var(--accent-red)',
        text: `${ownerName(lookup, event.owner)}'s ship destroyed by ${playerName(lookup, event.destroyedBy)}`,
        playerColor: ownerColor(lookup, event.owner),
        category: 'combat',
      };

    case 'DAMAGE_DEALT':
      return {
        icon: '-',
        iconColor: 'var(--accent-red)',
        text: `${event.damage} damage dealt (${event.source})`,
        playerColor: null,
        category: 'combat',
      };

    case 'RETREAT': {
      const pid = event.playerId;
      return {
        icon: '<',
        iconColor: 'var(--accent-yellow)',
        text: `${playerName(lookup, pid)} retreated ${shipLabel(event.shipType)} to ${coordStr(event.to)}`,
        playerColor: playerColor(lookup, pid),
        category: 'combat',
      };
    }

    case 'REPUTATION_DRAWN': {
      const pid = event.playerId;
      const keptText = event.kept !== null ? `, kept ${event.kept}` : '';
      return {
        icon: 'T',
        iconColor: 'var(--accent-yellow)',
        text: `${playerName(lookup, pid)} drew ${event.drawn.length} rep tile${event.drawn.length !== 1 ? 's' : ''}${keptText}`,
        playerColor: playerColor(lookup, pid),
        category: 'combat',
      };
    }

    case 'POPULATION_DESTROYED':
      return {
        icon: 'X',
        iconColor: 'var(--accent-red)',
        text: `${resourceLabel(event.track)} pop destroyed at ${coordStr(event.sector)} by ${playerName(lookup, event.destroyedBy)}`,
        playerColor: playerColor(lookup, event.destroyedBy),
        category: 'combat',
      };

    case 'INFLUENCE_PLACED': {
      const pid = event.playerId;
      return {
        icon: '+',
        iconColor: 'var(--accent-green)',
        text: `${playerName(lookup, pid)} took influence at ${coordStr(event.sector)}`,
        playerColor: playerColor(lookup, pid),
        category: 'misc',
      };
    }

    case 'INFLUENCE_REMOVED': {
      const pid = event.playerId;
      return {
        icon: '-',
        iconColor: 'var(--accent-red)',
        text: `${playerName(lookup, pid)} lost influence at ${coordStr(event.sector)}`,
        playerColor: playerColor(lookup, pid),
        category: 'misc',
      };
    }

    case 'DISCOVERY_CLAIMED': {
      const pid = event.playerId;
      const what = event.decision === 'USE_REWARD' ? 'used reward' : 'kept for VP';
      return {
        icon: '?',
        iconColor: 'var(--accent-yellow)',
        text: `${playerName(lookup, pid)} claimed discovery (${what})`,
        playerColor: playerColor(lookup, pid),
        category: 'misc',
      };
    }

    case 'DIPLOMACY_PROPOSED': {
      return {
        icon: 'D',
        iconColor: 'var(--accent-blue)',
        text: `${playerName(lookup, event.initiator)} proposed diplomacy to ${playerName(lookup, event.target)}`,
        playerColor: playerColor(lookup, event.initiator),
        category: 'diplomacy',
      };
    }

    case 'DIPLOMACY_FORMED':
      return {
        icon: 'D',
        iconColor: 'var(--accent-green)',
        text: `${playerName(lookup, event.player1)} & ${playerName(lookup, event.player2)} formed alliance`,
        playerColor: null,
        category: 'diplomacy',
      };

    case 'DIPLOMACY_DECLINED':
      return {
        icon: 'D',
        iconColor: 'var(--text-muted)',
        text: `${playerName(lookup, event.target)} declined diplomacy from ${playerName(lookup, event.initiator)}`,
        playerColor: playerColor(lookup, event.target),
        category: 'diplomacy',
      };

    case 'DIPLOMACY_BROKEN':
      return {
        icon: '!',
        iconColor: 'var(--accent-red)',
        text: `${playerName(lookup, event.aggressor)} broke alliance with ${playerName(lookup, event.victim)}`,
        playerColor: playerColor(lookup, event.aggressor),
        category: 'diplomacy',
      };

    case 'PLAYER_PASSED': {
      const pid = event.playerId;
      return {
        icon: 'P',
        iconColor: 'var(--text-muted)',
        text: `${playerName(lookup, pid)} passed${event.isFirst ? ' (first — starts next round)' : ''}`,
        playerColor: playerColor(lookup, pid),
        category: 'phase',
      };
    }

    case 'PLAYER_ELIMINATED': {
      const pid = event.playerId;
      return {
        icon: 'X',
        iconColor: 'var(--accent-red)',
        text: `${playerName(lookup, pid)} eliminated`,
        playerColor: playerColor(lookup, pid),
        category: 'phase',
      };
    }

    case 'UPKEEP_PAID': {
      const pid = event.playerId;
      const sign = event.net >= 0 ? '+' : '';
      return {
        icon: '$',
        iconColor: 'var(--accent-yellow)',
        text: `${playerName(lookup, pid)} upkeep: ${sign}${event.net} (income ${event.income}, cost ${event.upkeep})`,
        playerColor: playerColor(lookup, pid),
        category: 'economy',
      };
    }

    case 'PRODUCTION': {
      const pid = event.playerId;
      return {
        icon: 'P',
        iconColor: 'var(--accent-green)',
        text: `${playerName(lookup, pid)} produced +${event.materials} mat, +${event.science} sci`,
        playerColor: playerColor(lookup, pid),
        category: 'economy',
      };
    }

    case 'COLONY_SHIP_USED': {
      const pid = event.playerId;
      return {
        icon: 'C',
        iconColor: 'var(--accent-blue)',
        text: `${playerName(lookup, pid)} colonized ${resourceLabel(event.track)} at ${coordStr(event.sector)}`,
        playerColor: playerColor(lookup, pid),
        category: 'build',
      };
    }

    case 'BLUEPRINT_UPGRADED': {
      const pid = event.playerId;
      const parts: string[] = [];
      if (event.added) parts.push(`+${techLabel(event.added)}`);
      if (event.removed.length > 0) parts.push(`-${event.removed.map(techLabel).join(', -')}`);
      return {
        icon: 'U',
        iconColor: 'var(--accent-purple, #ab47bc)',
        text: `${playerName(lookup, pid)} upgraded ${shipLabel(event.shipType)}: ${parts.join(' ')}`,
        playerColor: playerColor(lookup, pid),
        category: 'build',
      };
    }

    case 'INSTANT_EFFECT': {
      const pid = event.playerId;
      return {
        icon: 'I',
        iconColor: 'var(--accent-yellow)',
        text: `${playerName(lookup, pid)}: ${event.description}`,
        playerColor: playerColor(lookup, pid),
        category: 'economy',
      };
    }

    case 'BANKRUPTCY_TRADE': {
      const pid = event.playerId;
      return {
        icon: '$',
        iconColor: 'var(--accent-red)',
        text: `${playerName(lookup, pid)} traded ${event.amount} ${resourceLabel(event.fromResource)} for ${event.moneyGained} money`,
        playerColor: playerColor(lookup, pid),
        category: 'economy',
      };
    }

    case 'GAME_ENDED':
      return {
        icon: 'G',
        iconColor: 'var(--accent-yellow)',
        text: 'Game ended!',
        playerColor: null,
        category: 'phase',
      };

    case 'GAME_CREATED':
      return {
        icon: 'G',
        iconColor: 'var(--accent-green)',
        text: 'Game started',
        playerColor: null,
        category: 'phase',
      };

    case 'ACTION_TAKEN':
      // Generic fallback — ACTION_TAKEN is the raw event, not normally displayed
      return {
        icon: 'A',
        iconColor: 'var(--text-muted)',
        text: `${playerName(lookup, event.playerId)} took action`,
        playerColor: playerColor(lookup, event.playerId),
        category: 'misc',
      };

    default:
      return {
        icon: '·',
        iconColor: 'var(--text-muted)',
        text: (event as { type: string }).type,
        playerColor: null,
        category: 'misc',
      };
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  combat: 'var(--accent-red)',
  build: 'var(--accent-green)',
  economy: 'var(--accent-yellow)',
  diplomacy: 'var(--accent-blue)',
  phase: 'var(--accent-purple, #ab47bc)',
  misc: 'var(--text-muted)',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? 'var(--text-muted)';
}

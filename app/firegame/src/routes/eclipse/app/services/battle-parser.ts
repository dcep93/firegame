import type { GameEvent, HexCoord, DiceResult } from '@eclipse/shared';

// ── Types ──

export interface BattleReplay {
  sector: HexCoord;
  participants: string[];
  phases: BattlePhaseReplay[];
}

export interface BattlePhaseReplay {
  label: string;
  steps: BattleStep[];
}

export type BattleStep =
  | { type: 'dice_rolled'; roller: string; shipType: string; dice: readonly DiceResult[]; purpose: string }
  | { type: 'ship_destroyed'; shipId: string; owner: string; destroyedBy: string }
  | { type: 'reputation_drawn'; playerId: string; drawn: readonly number[]; kept: number | null }
  | { type: 'population_destroyed'; sector: HexCoord; track: string; destroyedBy: string }
  | { type: 'influence_placed'; playerId: string; sector: HexCoord }
  | { type: 'discovery_claimed'; playerId: string; tileId: string };

// ── Public API ──

/** Quick check: does this events array contain any battles? */
export function hasBattleEvents(events: readonly GameEvent[]): boolean {
  return events.some(e => e.type === 'BATTLE_STARTED');
}

/** Parse flat event array into structured battle replays. */
export function parseBattleEvents(events: readonly GameEvent[]): BattleReplay[] {
  const battleStartIndices: number[] = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i]!.type === 'BATTLE_STARTED') {
      battleStartIndices.push(i);
    }
  }

  if (battleStartIndices.length === 0) return [];

  const battles: BattleReplay[] = [];

  for (let b = 0; b < battleStartIndices.length; b++) {
    const startIdx = battleStartIndices[b]!;
    const endIdx = b + 1 < battleStartIndices.length
      ? battleStartIndices[b + 1]!
      : events.length;

    const battleEvents = events.slice(startIdx, endIdx);
    const startEvent = battleEvents[0]! as Extract<GameEvent, { type: 'BATTLE_STARTED' }>;

    const phases: BattlePhaseReplay[] = [];
    const missileSteps: BattleStep[] = [];
    const engagementRounds = new Map<string, BattleStep[]>();
    const aftermathSteps: BattleStep[] = [];

    for (let i = 1; i < battleEvents.length; i++) {
      const event = battleEvents[i]!;
      const step = eventToStep(event);
      if (!step) continue;

      if (step.type === 'dice_rolled') {
        if (step.purpose === 'missiles') {
          missileSteps.push(step);
        } else {
          // engagement_round_N
          const roundKey = step.purpose;
          if (!engagementRounds.has(roundKey)) {
            engagementRounds.set(roundKey, []);
          }
          engagementRounds.get(roundKey)!.push(step);
        }
      } else if (step.type === 'ship_destroyed' || step.type === 'reputation_drawn') {
        // These occur during/after engagement — put in the latest engagement round or aftermath
        const lastRoundKey = getLastKey(engagementRounds);
        if (lastRoundKey) {
          engagementRounds.get(lastRoundKey)!.push(step);
        } else if (missileSteps.length > 0) {
          missileSteps.push(step);
        } else {
          aftermathSteps.push(step);
        }
      } else {
        // Post-battle events
        aftermathSteps.push(step);
      }
    }

    // Assemble phases
    if (missileSteps.length > 0) {
      phases.push({ label: 'Missile Phase', steps: missileSteps });
    }

    // Sort engagement rounds by number
    const sortedRounds = Array.from(engagementRounds.entries()).sort((a, b) => {
      const numA = parseInt(a[0].replace('engagement_round_', ''), 10);
      const numB = parseInt(b[0].replace('engagement_round_', ''), 10);
      return numA - numB;
    });

    for (const [key, steps] of sortedRounds) {
      const roundNum = key.replace('engagement_round_', '');
      phases.push({ label: `Engagement Round ${roundNum}`, steps });
    }

    if (aftermathSteps.length > 0) {
      phases.push({ label: 'Aftermath', steps: aftermathSteps });
    }

    // If we only got a BATTLE_STARTED with no dice/steps, add a summary phase
    if (phases.length === 0) {
      phases.push({ label: 'Battle Summary', steps: [] });
    }

    battles.push({
      sector: startEvent.sector,
      participants: [...startEvent.participants],
      phases,
    });
  }

  return battles;
}

// ── Helpers ──

export function eventToStep(event: GameEvent): BattleStep | null {
  switch (event.type) {
    case 'DICE_ROLLED':
      return {
        type: 'dice_rolled',
        roller: event.roller,
        shipType: event.shipType,
        dice: event.dice,
        purpose: event.purpose,
      };
    case 'SHIP_DESTROYED':
      return {
        type: 'ship_destroyed',
        shipId: event.shipId,
        owner: event.owner,
        destroyedBy: event.destroyedBy,
      };
    case 'REPUTATION_DRAWN':
      return {
        type: 'reputation_drawn',
        playerId: event.playerId,
        drawn: event.drawn,
        kept: event.kept,
      };
    case 'POPULATION_DESTROYED':
      return {
        type: 'population_destroyed',
        sector: event.sector,
        track: event.track,
        destroyedBy: event.destroyedBy,
      };
    case 'INFLUENCE_PLACED':
      return {
        type: 'influence_placed',
        playerId: event.playerId,
        sector: event.sector,
      };
    case 'DISCOVERY_CLAIMED':
      return {
        type: 'discovery_claimed',
        playerId: event.playerId,
        tileId: event.tileId,
      };
    default:
      return null;
  }
}

function getLastKey<K, V>(map: Map<K, V>): K | undefined {
  let last: K | undefined;
  for (const key of Array.from(map.keys())) {
    last = key;
  }
  return last;
}

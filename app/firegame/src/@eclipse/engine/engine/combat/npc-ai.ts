import { DICE_DAMAGE } from '@data/constants';
import { DieColor } from '@data/enums';
import type { NpcType } from '@data/enums';
import type { GameState, PlayerId, ShipOnBoard } from '../types';
import { playerHasTech } from '../state/state-queries';
import { getShipCombatStats, getShipSizeOrder, isNpcOwner } from './combat-helpers';
import type { DamageAssignment } from './damage';
import type { RollResult } from './hit-determination';

/**
 * Expand Antimatter Cannon hits (Red dice, 4 damage each) into
 * 4 × Yellow (1 damage) shots so they can be split across targets.
 * Non-red hits pass through unchanged.
 */
export function expandAntimatterHits(hits: readonly RollResult[]): readonly RollResult[] {
  const expanded: RollResult[] = [];
  for (const hit of hits) {
    if (hit.dieColor === DieColor.Red) {
      // Replace 1 red (4 dmg) with 4 yellow (1 dmg each)
      for (let i = 0; i < 4; i++) {
        expanded.push({
          dieColor: DieColor.Yellow,
          faceIndex: hit.faceIndex,
          faceValue: hit.faceValue,
          isBurst: hit.isBurst,
          isMiss: false,
        });
      }
    } else {
      expanded.push(hit);
    }
  }
  return expanded;
}

export function npcAssignDamage(
  hits: readonly RollResult[],
  targetShips: readonly ShipOnBoard[],
  state: GameState,
  attackerOwner?: PlayerId | NpcType,
  isMissileHits = false,
): readonly DamageAssignment[] {
  if (hits.length === 0 || targetShips.length === 0) return [];

  // Determine if attacker has Antimatter Splitter tech
  const hasSplitter = attackerOwner != null &&
    !isNpcOwner(attackerOwner) &&
    playerHasTech(state.players[attackerOwner as PlayerId]!, 'antimatter_splitter');

  if (hasSplitter && !isMissileHits) {
    // Expand red (antimatter cannon) hits into 4×1-damage yellow shots,
    // then split all hits across targets for maximum kills
    const expandedHits = expandAntimatterHits(hits);
    return splitDamage(expandedHits, targetShips, state);
  }

  return concentrateDamage(hits, targetShips, state);
}

/**
 * Default behavior: all hits must target a single ship.
 * Picks the best single target — kill if possible (least overkill),
 * otherwise most-damaged ship (biggest if tied).
 */
function concentrateDamage(
  hits: readonly RollResult[],
  targetShips: readonly ShipOnBoard[],
  state: GameState,
): readonly DamageAssignment[] {
  const hitDamages = hits.map(h => DICE_DAMAGE[h.dieColor]);
  const totalDmg = hitDamages.reduce((s, d) => s + d, 0);

  // Sort: least remaining hull first, biggest ship on tie
  const sorted = [...targetShips].sort((a, b) => {
    const aStats = getShipCombatStats(a, state);
    const bStats = getShipCombatStats(b, state);
    const aRem = aStats.hullValue - a.damage;
    const bRem = bStats.hullValue - b.damage;
    if (aRem !== bRem) return aRem - bRem;
    return getShipSizeOrder(b.type) - getShipSizeOrder(a.type);
  });

  // Pick the best single target
  // 1. Ship that can be killed with least overkill
  let bestKill: ShipOnBoard | null = null;
  let bestOverkill = Infinity;
  for (const target of sorted) {
    const stats = getShipCombatStats(target, state);
    const remaining = stats.hullValue - target.damage;
    if (totalDmg > remaining) {
      const overkill = totalDmg - remaining;
      if (overkill < bestOverkill) {
        bestOverkill = overkill;
        bestKill = target;
      }
    }
  }

  // 2. If no kill possible, pick most-damaged (sorted[0])
  const target = bestKill ?? sorted[0]!;

  return [{
    targetShipId: target.id,
    hits: [...hits],
    totalDamage: totalDmg,
  }];
}

/**
 * Antimatter Splitter: may split damage across multiple ships.
 * Strategy: kill as many ships as possible, then concentrate remainder.
 */
function splitDamage(
  hits: readonly RollResult[],
  targetShips: readonly ShipOnBoard[],
  state: GameState,
): readonly DamageAssignment[] {
  // Sort targets: least remaining hull first (easiest to kill),
  // tie-break by ship size descending (biggest ship when same hull)
  const sortedTargets = [...targetShips].sort((a, b) => {
    const aStats = getShipCombatStats(a, state);
    const bStats = getShipCombatStats(b, state);
    const aRemaining = aStats.hullValue - a.damage;
    const bRemaining = bStats.hullValue - b.damage;
    if (aRemaining !== bRemaining) return aRemaining - bRemaining;
    return getShipSizeOrder(b.type) - getShipSizeOrder(a.type);
  });

  // Build damage lookup for each hit by original index
  const hitDamages = hits.map(h => DICE_DAMAGE[h.dieColor]);

  const assignmentMap = new Map<string, number[]>(); // target id → original hit indices
  const usedHits = new Set<number>();

  // Pass 1: Kill ships using minimum damage needed, easiest target first.
  for (const target of sortedTargets) {
    const stats = getShipCombatStats(target, state);
    const remainingHull = stats.hullValue - target.damage;

    const killSet = findMinKillSet(remainingHull, hitDamages, usedHits);
    if (killSet) {
      for (const idx of Array.from(killSet)) usedHits.add(idx);
      assignmentMap.set(target.id, killSet);
    }
  }

  // Pass 2: Concentrate remaining hits on most-damaged survivor
  const remainingIndices: number[] = [];
  for (let i = 0; i < hits.length; i++) {
    if (!usedHits.has(i)) remainingIndices.push(i);
  }

  if (remainingIndices.length > 0) {
    for (const target of sortedTargets) {
      if (remainingIndices.length === 0) break;
      if (assignmentMap.has(target.id)) continue;

      assignmentMap.set(target.id, [...remainingIndices]);
      remainingIndices.length = 0;
    }

    if (remainingIndices.length > 0 && sortedTargets.length > 0) {
      const first = sortedTargets[0]!;
      const existing = assignmentMap.get(first.id) ?? [];
      assignmentMap.set(first.id, [...existing, ...remainingIndices]);
    }
  }

  // Convert to DamageAssignment array
  const assignments: DamageAssignment[] = [];
  for (const [targetShipId, indices] of Array.from(assignmentMap.entries())) {
    const assignedHits = indices.map(i => hits[i]!);
    let totalDamage = 0;
    for (const h of assignedHits) {
      totalDamage += DICE_DAMAGE[h.dieColor];
    }
    assignments.push({ targetShipId, hits: assignedHits, totalDamage });
  }

  return assignments;
}

/**
 * Find the minimum subset of available hits that can destroy a ship
 * (total damage > remainingHull). Uses smallest sufficient hits to
 * avoid wasting high-damage dice on easy kills.
 */
function findMinKillSet(
  remainingHull: number,
  hitDamages: number[],
  usedHits: Set<number>,
): number[] | null {
  const available: number[] = [];
  for (let i = 0; i < hitDamages.length; i++) {
    if (!usedHits.has(i)) available.push(i);
  }
  if (available.length === 0) return null;

  // Try single hits first — find the smallest single hit that kills
  let bestSingle: number | null = null;
  let bestSingleDmg = Infinity;
  for (const idx of available) {
    const dmg = hitDamages[idx]!;
    if (dmg > remainingHull && dmg < bestSingleDmg) {
      bestSingle = idx;
      bestSingleDmg = dmg;
    }
  }
  if (bestSingle !== null) return [bestSingle];

  // No single hit can kill — accumulate from smallest hits first to minimize waste
  const sorted = [...available].sort((a, b) => hitDamages[a]! - hitDamages[b]!);
  let accumulated = 0;
  const selected: number[] = [];
  for (const idx of sorted) {
    selected.push(idx);
    accumulated += hitDamages[idx]!;
    if (accumulated > remainingHull) return selected;
  }

  return null; // Can't kill with available hits
}

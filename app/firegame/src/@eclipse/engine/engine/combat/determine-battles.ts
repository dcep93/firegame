import type { NpcType } from '@data/enums';
import type { GameState, PlayerId, SectorKey } from '../types';
import {
  getFactionsInSector,
  isNpcOwner,
  isDescendantsOfDraco,
} from './combat-helpers';

export interface BattleInfo {
  readonly sectorKey: SectorKey;
  readonly sectorNumber: number;
  readonly participants: readonly (PlayerId | NpcType)[];
  readonly isMultiFaction: boolean;
}

export function determineBattles(state: GameState): readonly BattleInfo[] {
  const battles: BattleInfo[] = [];

  for (const [sectorKey, sector] of Object.entries(state.board.sectors)) {
    const factions = getFactionsInSector(state, sectorKey);
    if (factions.length < 2) continue;

    // Descendants of Draco coexist with Ancients
    const playerFactions = factions.filter((f) => !isNpcOwner(f));
    const npcFactions = factions.filter((f) => isNpcOwner(f));

    // If only one player + only Ancients and that player is Draco → skip
    if (
      playerFactions.length === 1 &&
      npcFactions.length > 0 &&
      npcFactions.every((n) => n === 'ancient') &&
      isDescendantsOfDraco(state, playerFactions[0]!)
    ) {
      continue;
    }

    const sectorNum = parseInt(sector.sectorId, 10) || 0;

    battles.push({
      sectorKey,
      sectorNumber: sectorNum,
      participants: factions,
      isMultiFaction: factions.length > 2,
    });
  }

  return sortBattlesBySectorNumber(battles);
}

export function sortBattlesBySectorNumber(
  battles: readonly BattleInfo[],
): readonly BattleInfo[] {
  return [...battles].sort((a, b) => a.sectorNumber - b.sectorNumber);
}

/**
 * Build a unified tournament bracket for a sector with multiple factions.
 *
 * Bracket order: players sorted by entry order (descending = latest first),
 * with the sector controller as the last player, then NPCs as the final
 * defenders (original occupants). Adjacent pairs are generated from the bracket.
 *
 * Example: Players B(entry 1), C(entry 2) enter a sector controlled by A
 * with GCDS present → bracket [C, B, A, GCDS] → pairs [C vs B, B vs A, A vs GCDS].
 * The bracket-winner substitution in advancePairOrBattle ensures the actual
 * winner of each fight advances to face the next opponent.
 */
export function determineBattlePairs(
  state: GameState,
  sectorKey: SectorKey,
  participants: readonly (PlayerId | NpcType)[],
): readonly { attacker: PlayerId | NpcType; defender: PlayerId | NpcType }[] {
  const sector = state.board.sectors[sectorKey];
  if (!sector) return [];

  const controller = sector.influenceDisc;
  const npcs = participants.filter((p) => isNpcOwner(p));
  const players = participants.filter((p) => !isNpcOwner(p));

  // Build unified bracket
  const bracket: (PlayerId | NpcType)[] = [];

  if (players.length >= 2) {
    // Sort players by entry order descending (latest entrant first = attacker)
    const playerEntryOrder = players.map((p) => {
      const ships = sector.ships.filter((s) => s.owner === p);
      const maxEntry = Math.max(...ships.map((s) => s.entryOrder));
      return { player: p, maxEntry };
    });
    playerEntryOrder.sort((a, b) => b.maxEntry - a.maxEntry);

    // Controller is always the final player defender
    const controllerIdx = playerEntryOrder.findIndex(
      (pe) => pe.player === controller,
    );
    if (controllerIdx > -1) {
      const [ctrl] = playerEntryOrder.splice(controllerIdx, 1);
      playerEntryOrder.push(ctrl!);
    }

    bracket.push(...playerEntryOrder.map((pe) => pe.player));
  } else if (players.length === 1) {
    bracket.push(players[0]!);
  }

  // NPCs are original occupants — final defenders in the bracket
  bracket.push(...npcs);

  // Generate adjacent pairs from the bracket
  const pairs: { attacker: PlayerId | NpcType; defender: PlayerId | NpcType }[] = [];
  for (let i = 0; i < bracket.length - 1; i++) {
    pairs.push({
      attacker: bracket[i]!,
      defender: bracket[i + 1]!,
    });
  }

  return pairs;
}

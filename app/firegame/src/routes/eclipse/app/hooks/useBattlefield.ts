import { useMemo, useRef } from 'react';
import type {
  FilteredGameState,
  ShipOnBoard,
  ComputedBlueprintStats,
  WeaponSummary,
  NpcBlueprintVariant,
} from '@eclipse/shared';
import { NpcType, NPC_DEFINITIONS, DICE_DAMAGE, DieColor } from '@eclipse/shared';

// ── Types ──

export interface BattlefieldShipStats {
  initiative: number;
  hullValue: number;
  shieldValue: number;
  computerValue: number;
  weapons: readonly WeaponSummary[];
  missiles: readonly WeaponSummary[];
}

export interface BattlefieldShip {
  id: string;
  type: string;
  damage: number;
  maxHull: number;
  isDestroyed: boolean;
  isRetreating: boolean;
  isRetreated: boolean;
}

export interface BattlefieldShipGroup {
  shipType: string;
  displayName: string;
  stats: BattlefieldShipStats;
  ships: BattlefieldShip[];
}

export interface BattlefieldFaction {
  ownerId: string;
  displayName: string;
  color: string;
  shipGroups: BattlefieldShipGroup[];
  totalAlive: number;
  totalShips: number;
}

export interface BattlefieldState {
  left: BattlefieldFaction;
  right: BattlefieldFaction;
}

// ── Helpers ──

const NPC_IDS = new Set<string>([NpcType.Ancient, NpcType.Guardian, NpcType.GCDS]);

function formatShipType(shipType: string): string {
  return shipType.charAt(0).toUpperCase() + shipType.slice(1).toLowerCase();
}

function npcVariantToStats(variant: NpcBlueprintVariant): BattlefieldShipStats {
  const weapons: WeaponSummary[] = [];
  const missiles: WeaponSummary[] = [];
  for (const w of variant.weapons) {
    const summary: WeaponSummary = {
      dieColor: w.dieColor,
      dieCount: w.dieCount,
      damage: DICE_DAMAGE[w.dieColor as DieColor],
    };
    if (w.isMissile) {
      missiles.push(summary);
    } else {
      weapons.push(summary);
    }
  }
  return {
    initiative: variant.initiative,
    hullValue: variant.hullPoints,
    shieldValue: variant.shieldBonus,
    computerValue: variant.computerBonus,
    weapons,
    missiles,
  };
}

function getPlayerBlueprintStats(
  filteredState: FilteredGameState,
  ownerId: string,
  shipType: string,
): BattlefieldShipStats | null {
  let computed: ComputedBlueprintStats | undefined;
  if (ownerId === filteredState.you.id) {
    computed = filteredState.you.blueprints[shipType as keyof typeof filteredState.you.blueprints]?.computed;
  } else {
    const opp = filteredState.opponents[ownerId];
    if (opp) {
      computed = opp.blueprints[shipType as keyof typeof opp.blueprints]?.computed;
    }
  }
  if (!computed) return null;
  return {
    initiative: computed.initiative,
    hullValue: computed.hullValue,
    shieldValue: computed.shieldValue,
    computerValue: computed.computerValue,
    weapons: computed.weapons,
    missiles: computed.missiles,
  };
}

function getNpcStats(
  npcType: string,
  config: FilteredGameState['config'],
): BattlefieldShipStats | null {
  const def = NPC_DEFINITIONS[npcType as NpcType];
  if (!def) return null;

  let variantIndex: number;
  if (npcType === NpcType.Ancient) {
    variantIndex = (config.ancientBlueprintVariant ?? 1) - 1;
  } else if (npcType === NpcType.Guardian) {
    variantIndex = (config.guardianBlueprintVariant ?? 1) - 1;
  } else {
    variantIndex = (config.gcdsBlueprintVariant ?? 1) - 1;
  }

  const variant = def.blueprintVariants[variantIndex];
  if (!variant) return null;
  return npcVariantToStats(variant);
}

function getNpcDisplayName(npcType: string): string {
  const def = NPC_DEFINITIONS[npcType as NpcType];
  return def?.name ?? formatShipType(npcType);
}

// ── Hook ──

export function useBattlefield(
  filteredState: FilteredGameState | null,
  playerColors: Record<string, string>,
  playerNames: Record<string, string>,
): BattlefieldState | null {
  // Track initial ship set at battle start to detect destroyed/retreated ships
  const initialShipsRef = useRef<Map<string, ShipOnBoard> | null>(null);
  const lastSeenShipsRef = useRef<Map<string, ShipOnBoard> | null>(null);
  const lastBattleKeyRef = useRef<string | null>(null);

  return useMemo(() => {
    if (!filteredState?.combatState) {
      // Reset tracking when combat ends
      initialShipsRef.current = null;
      lastSeenShipsRef.current = null;
      lastBattleKeyRef.current = null;
      return null;
    }

    const combat = filteredState.combatState;
    const battle = combat.battles[combat.currentBattleIndex];
    if (!battle) return null;

    const sector = filteredState.board.sectors[battle.sectorKey];
    if (!sector) return null;

    // Determine left (attacker) and right (defender)
    let leftOwner: string;
    let rightOwner: string;

    const currentPair = combat.pairs.length > 0 && combat.currentPairIndex < combat.pairs.length
      ? combat.pairs[combat.currentPairIndex]
      : undefined;
    if (currentPair) {
      leftOwner = String(currentPair.attacker);
      rightOwner = String(currentPair.defender);
    } else {
      // AWAITING_START — use participants
      leftOwner = String(battle.participants[0]);
      rightOwner = String(battle.participants[1] ?? battle.participants[0]);
    }

    // Snapshot initial ships when battle or pair changes
    const battleKey = `${battle.sectorKey}-${combat.currentBattleIndex}-${combat.currentPairIndex}`;
    if (battleKey !== lastBattleKeyRef.current) {
      lastBattleKeyRef.current = battleKey;
      const map = new Map<string, ShipOnBoard>();
      for (const ship of sector.ships) {
        map.set(ship.id, ship);
      }
      initialShipsRef.current = map;
      lastSeenShipsRef.current = new Map(map);
    }

    const currentShipIds = new Set(sector.ships.map(s => s.id));
    const initialShips = initialShipsRef.current;
    const lastSeenShips = lastSeenShipsRef.current;

    // Update last-seen state for all current ships
    if (lastSeenShips) {
      for (const ship of sector.ships) {
        lastSeenShips.set(ship.id, ship);
      }
    }

    // Group ships by owner, then by ship type
    const sectorShips = sector.ships;
    const config = filteredState.config;

    function buildFaction(ownerId: string): BattlefieldFaction {
      // Current alive ships for this owner
      const aliveShips = sectorShips.filter(s => String(s.owner) === ownerId);

      // Ships from initial snapshot that are now missing (destroyed or retreated)
      const destroyedShips: ShipOnBoard[] = [];
      const retreatedShips: ShipOnBoard[] = [];
      if (initialShips) {
        for (const [id, ship] of Array.from(initialShips.entries())) {
          if (String(ship.owner) === ownerId && !currentShipIds.has(id)) {
            // Check last-seen state to determine if ship retreated or was destroyed
            const lastSeen = lastSeenShips?.get(id);
            if (lastSeen?.isRetreating) {
              retreatedShips.push(ship);
            } else {
              destroyedShips.push(ship);
            }
          }
        }
      }

      const allShips = [...aliveShips, ...destroyedShips, ...retreatedShips];

      // Group by ship type
      const groupMap = new Map<string, { alive: ShipOnBoard[]; destroyed: ShipOnBoard[]; retreated: ShipOnBoard[] }>();
      for (const ship of aliveShips) {
        const key = ship.type;
        if (!groupMap.has(key)) groupMap.set(key, { alive: [], destroyed: [], retreated: [] });
        groupMap.get(key)!.alive.push(ship);
      }
      for (const ship of destroyedShips) {
        const key = ship.type;
        if (!groupMap.has(key)) groupMap.set(key, { alive: [], destroyed: [], retreated: [] });
        groupMap.get(key)!.destroyed.push(ship);
      }
      for (const ship of retreatedShips) {
        const key = ship.type;
        if (!groupMap.has(key)) groupMap.set(key, { alive: [], destroyed: [], retreated: [] });
        groupMap.get(key)!.retreated.push(ship);
      }

      const isNpc = NPC_IDS.has(ownerId);
      const shipGroups: BattlefieldShipGroup[] = [];

      for (const [shipType, group] of Array.from(groupMap.entries())) {
        // Get stats
        let stats: BattlefieldShipStats | null;
        if (isNpc) {
          stats = getNpcStats(ownerId, config);
        } else {
          stats = getPlayerBlueprintStats(filteredState!, ownerId, shipType);
        }

        if (!stats) {
          stats = {
            initiative: 0,
            hullValue: 0,
            shieldValue: 0,
            computerValue: 0,
            weapons: [],
            missiles: [],
          };
        }

        const ships: BattlefieldShip[] = [];
        for (const s of group.alive) {
          ships.push({
            id: s.id,
            type: s.type,
            damage: s.damage,
            maxHull: stats.hullValue,
            isDestroyed: false,
            isRetreating: s.isRetreating ?? false,
            isRetreated: false,
          });
        }
        for (const s of group.destroyed) {
          ships.push({
            id: s.id,
            type: s.type,
            damage: stats.hullValue + 1,
            maxHull: stats.hullValue,
            isDestroyed: true,
            isRetreating: false,
            isRetreated: false,
          });
        }
        for (const s of group.retreated) {
          ships.push({
            id: s.id,
            type: s.type,
            damage: s.damage,
            maxHull: stats.hullValue,
            isDestroyed: false,
            isRetreating: false,
            isRetreated: true,
          });
        }

        const displayName = isNpc
          ? getNpcDisplayName(ownerId)
          : formatShipType(shipType);

        shipGroups.push({ shipType, displayName, stats, ships });
      }

      // Sort groups by initiative (highest first)
      shipGroups.sort((a, b) => b.stats.initiative - a.stats.initiative);

      return {
        ownerId,
        displayName: playerNames[ownerId] ?? formatShipType(ownerId),
        color: playerColors[ownerId] ?? 'var(--text-primary)',
        shipGroups,
        totalAlive: aliveShips.filter(s => !s.isRetreating).length,
        totalShips: allShips.length - retreatedShips.length,
      };
    }

    return {
      left: buildFaction(leftOwner),
      right: buildFaction(rightOwner),
    };
  }, [filteredState, playerColors, playerNames]);
}

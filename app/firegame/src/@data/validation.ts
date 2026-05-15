import { DieColor, NpcType, PopulationSquareType, ShipType, WormholeEdge } from './enums';
import {
  INFLUENCE_UPKEEP_TRACK,
  MATERIALS_PRODUCTION_TRACK,
  SCIENCE_PRODUCTION_TRACK,
  MONEY_PRODUCTION_TRACK,
  TECH_SETUP_DRAW,
  TECH_CLEANUP_DRAW,
} from './constants';
import {
  SHIP_PARTS_BY_ID,
  SHIP_PARTS,
  ALL_TECHS,
  MILITARY_TECHS,
  GRID_TECHS,
  NANO_TECHS,
  RARE_TECHS,
  TECHS_BY_ID,
  DICE,
  ALL_DICE,
  DISCOVERY_TILES,
  REPUTATION_TILES,
  NPC_DEFINITIONS,
  ALL_NPC_DEFINITIONS,
  DEFAULT_BLUEPRINTS,
  ALL_SPECIES,
  ALL_SECTORS,
  STARTING_SECTORS,
} from './definitions/index';

export interface CheckResult {
  readonly name: string;
  readonly passed: boolean;
  readonly error?: string;
}

export interface ValidationResult {
  readonly passed: number;
  readonly failed: number;
  readonly results: readonly CheckResult[];
}

function check(name: string, fn: () => string | null): CheckResult {
  const error = fn();
  return error === null
    ? { name, passed: true }
    : { name, passed: false, error };
}

export function runAllChecks(): readonly CheckResult[] {
  return [
    // ── Tech ↔ Ship Part cross-references ──
    check('All tech → ship part references valid', () => {
      for (const tech of ALL_TECHS) {
        if (tech.unlocksShipPart && !SHIP_PARTS_BY_ID[tech.unlocksShipPart]) {
          return `Tech "${tech.id}" references unknown ship part "${tech.unlocksShipPart}"`;
        }
      }
      return null;
    }),

    check('All ship part → tech back-references valid', () => {
      for (const part of SHIP_PARTS) {
        if (part.unlockedByTech && !TECHS_BY_ID[part.unlockedByTech]) {
          return `Ship part "${part.id}" references unknown tech "${part.unlockedByTech}"`;
        }
      }
      return null;
    }),

    // ── Species → Tech references ──
    check('All species → tech references valid', () => {
      for (const species of ALL_SPECIES) {
        for (const techId of species.startingTechs) {
          if (!TECHS_BY_ID[techId]) {
            return `Species "${species.id}" references unknown tech "${techId}"`;
          }
        }
      }
      return null;
    }),

    // ── Species → Sector references ──
    check('All species → sector references valid', () => {
      const startingIds = new Set(STARTING_SECTORS.map((s) => s.id));
      for (const species of ALL_SPECIES) {
        if (!startingIds.has(species.homeSectorId)) {
          return `Species "${species.id}" references non-starting sector "${species.homeSectorId}"`;
        }
      }
      return null;
    }),

    // ── Sector counts ──
    check('Sector count is 54', () => {
      return ALL_SECTORS.length === 54
        ? null
        : `Expected 54 sectors, got ${ALL_SECTORS.length}`;
    }),

    // ── Discovery tile counts ──
    check('Discovery tile count is 35', () => {
      const total = DISCOVERY_TILES.reduce((sum, t) => sum + t.count, 0);
      return total === 35
        ? null
        : `Expected 35 discovery tiles, got ${total}`;
    }),

    // ── Reputation tile counts ──
    check('Reputation tile count is 30', () => {
      const total = REPUTATION_TILES.reduce((sum, t) => sum + t.count, 0);
      return total === 30
        ? null
        : `Expected 30 reputation tiles, got ${total}`;
    }),

    // ── Ship part uniqueness ──
    check('All ship part IDs unique', () => {
      const ids = SHIP_PARTS.map((p) => p.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      return dupes.length === 0
        ? null
        : `Duplicate ship part IDs: ${dupes.join(', ')}`;
    }),

    // ── Tech uniqueness ──
    check('All tech IDs unique', () => {
      const ids = ALL_TECHS.map((t) => t.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      return dupes.length === 0
        ? null
        : `Duplicate tech IDs: ${dupes.join(', ')}`;
    }),

    // ── Sector uniqueness ──
    check('All sector IDs unique', () => {
      const ids = ALL_SECTORS.map((s) => s.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      return dupes.length === 0
        ? null
        : `Duplicate sector IDs: ${dupes.join(', ')}`;
    }),

    // ── Species uniqueness ──
    check('All species IDs unique', () => {
      const ids = ALL_SPECIES.map((s) => s.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      return dupes.length === 0
        ? null
        : `Duplicate species IDs: ${dupes.join(', ')}`;
    }),

    check('All species home sector IDs unique', () => {
      const homes = ALL_SPECIES.map((s) => s.homeSectorId);
      const dupes = homes.filter((id, i) => homes.indexOf(id) !== i);
      return dupes.length === 0
        ? null
        : `Duplicate home sector IDs: ${dupes.join(', ')}`;
    }),

    // ── Tech category counts ──
    check('Tech category counts: Military=8, Grid=8, Nano=8, Rare=15', () => {
      const errors: string[] = [];
      if (MILITARY_TECHS.length !== 8) errors.push(`Military: ${MILITARY_TECHS.length}`);
      if (GRID_TECHS.length !== 8) errors.push(`Grid: ${GRID_TECHS.length}`);
      if (NANO_TECHS.length !== 8) errors.push(`Nano: ${NANO_TECHS.length}`);
      if (RARE_TECHS.length !== 15) errors.push(`Rare: ${RARE_TECHS.length}`);
      return errors.length === 0
        ? null
        : `Wrong counts: ${errors.join(', ')}`;
    }),

    // ── Default blueprints ──
    check('All 4 ship types have default blueprints', () => {
      for (const st of Object.values(ShipType)) {
        if (!DEFAULT_BLUEPRINTS[st]) {
          return `Missing default blueprint for ${st}`;
        }
      }
      return null;
    }),

    check('Default blueprint parts reference valid ship part IDs', () => {
      for (const [shipType, bp] of Object.entries(DEFAULT_BLUEPRINTS)) {
        for (const slot of bp.slots) {
          if (slot.defaultPart !== null && !SHIP_PARTS_BY_ID[slot.defaultPart]) {
            return `Blueprint "${shipType}" references unknown part "${slot.defaultPart}"`;
          }
        }
      }
      return null;
    }),

    // ── Wormhole validity ──
    check('All wormhole edges are valid (0–5)', () => {
      const validEdges = new Set(Object.values(WormholeEdge));
      for (const sector of ALL_SECTORS) {
        for (const edge of sector.wormholes.edges) {
          if (!validEdges.has(edge)) {
            return `Sector "${sector.id}" has invalid wormhole edge: ${edge}`;
          }
        }
      }
      return null;
    }),

    check('Every sector has at least 1 wormhole edge', () => {
      for (const sector of ALL_SECTORS) {
        if (sector.wormholes.edges.length === 0) {
          return `Sector "${sector.id}" has no wormhole edges`;
        }
      }
      return null;
    }),

    // ── Population square validity ──
    check('All population square types valid', () => {
      const validTypes = new Set(Object.values(PopulationSquareType));
      for (const sector of ALL_SECTORS) {
        for (const sq of sector.populationSquares) {
          if (!validTypes.has(sq.type)) {
            return `Sector "${sector.id}" has invalid population square type: ${sq.type}`;
          }
        }
      }
      return null;
    }),

    // ── Die face counts ──
    check('Each die has exactly 6 faces', () => {
      for (const color of Object.values(DieColor)) {
        const die = DICE[color];
        if (die.faces.length !== 6) {
          return `Die "${color}" has ${die.faces.length} faces, expected 6`;
        }
      }
      return null;
    }),

    check('Each die has 1 miss, 4 normal, 1 burst', () => {
      for (const die of ALL_DICE) {
        const misses = die.faces.filter((f) => f.isMiss).length;
        const bursts = die.faces.filter((f) => f.isBurst).length;
        const normal = die.faces.filter((f) => !f.isMiss && !f.isBurst).length;
        if (misses !== 1 || bursts !== 1 || normal !== 4) {
          return `Die "${die.color}" face distribution: ${misses} miss, ${normal} normal, ${bursts} burst (expected 1/4/1)`;
        }
      }
      return null;
    }),

    // ── NPC definitions ──
    check('All 3 NPC types defined', () => {
      for (const npcType of Object.values(NpcType)) {
        if (!NPC_DEFINITIONS[npcType]) {
          return `Missing NPC definition for ${npcType}`;
        }
      }
      return null;
    }),

    check('Each NPC has at least 1 blueprint variant', () => {
      for (const npc of ALL_NPC_DEFINITIONS) {
        if (npc.blueprintVariants.length === 0) {
          return `NPC "${npc.type}" has no blueprint variants`;
        }
      }
      return null;
    }),

    // ── Constants sanity ──
    check('Upkeep track has 14 entries', () => {
      return INFLUENCE_UPKEEP_TRACK.length === 14
        ? null
        : `Expected 14 entries, got ${INFLUENCE_UPKEEP_TRACK.length}`;
    }),

    check('Production tracks each have 12 entries', () => {
      const errors: string[] = [];
      if (MATERIALS_PRODUCTION_TRACK.length !== 12) errors.push(`Materials: ${MATERIALS_PRODUCTION_TRACK.length}`);
      if (SCIENCE_PRODUCTION_TRACK.length !== 12) errors.push(`Science: ${SCIENCE_PRODUCTION_TRACK.length}`);
      if (MONEY_PRODUCTION_TRACK.length !== 12) errors.push(`Money: ${MONEY_PRODUCTION_TRACK.length}`);
      return errors.length === 0
        ? null
        : `Wrong lengths: ${errors.join(', ')}`;
    }),

    check('Tech draw counts cover player counts 2–6', () => {
      for (let p = 2; p <= 6; p++) {
        if (TECH_SETUP_DRAW[p] === undefined) {
          return `TECH_SETUP_DRAW missing player count ${p}`;
        }
        if (TECH_CLEANUP_DRAW[p] === undefined) {
          return `TECH_CLEANUP_DRAW missing player count ${p}`;
        }
      }
      return null;
    }),
  ];
}

export function runValidation(): ValidationResult {
  const results = runAllChecks();
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  return { passed, failed, results };
}

// ── CLI runner ──
// When executed directly via `npx tsx src/data/validation.ts`
// Declared here to avoid requiring @types/node for the entire project.
declare const process: { argv: string[]; exit(code: number): never };
declare const console: { log(msg: string): void };

const isMain = typeof process !== 'undefined'
  && process.argv[1]
  && (process.argv[1].endsWith('validation.ts') || process.argv[1].endsWith('validation'));

if (isMain) {
  const { passed, failed, results } = runValidation();

  for (const r of results) {
    if (r.passed) {
      console.log(`  \u2713 ${r.name}`);
    } else {
      console.log(`  \u2717 ${r.name}`);
      if (r.error) console.log(`    ${r.error}`);
    }
  }

  console.log('');
  console.log(`${passed}/${passed + failed} checks passed`);

  if (failed > 0) {
    process.exit(1);
  }
}

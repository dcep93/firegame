import type { SectorDefinition } from '../../types/sector';
import { GALACTIC_CENTER_SECTOR } from './galactic-center';
import { INNER_SECTORS } from './inner';
import { MIDDLE_SECTORS } from './middle';
import { OUTER_SECTORS } from './outer';
import { STARTING_SECTORS, GUARDIAN_SECTORS } from './starting-guardian';

export {
  GALACTIC_CENTER_SECTOR,
  INNER_SECTORS,
  MIDDLE_SECTORS,
  OUTER_SECTORS,
  STARTING_SECTORS,
  GUARDIAN_SECTORS,
};

export const ALL_SECTORS: readonly SectorDefinition[] = Object.freeze([
  GALACTIC_CENTER_SECTOR,
  ...INNER_SECTORS,
  ...MIDDLE_SECTORS,
  ...OUTER_SECTORS,
  ...STARTING_SECTORS,
  ...GUARDIAN_SECTORS,
]);

export const SECTORS_BY_ID: Readonly<Record<string, SectorDefinition>> = Object.freeze(
  Object.fromEntries(ALL_SECTORS.map((s) => [s.id, s])),
);

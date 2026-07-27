# Score Table Label and Tile Icons Design

## Problem

The score table repeats its purpose in a “Live contributions & board VP”
section label that is not needed. Its greenery and city columns contain the
correct values, but their header icons are invisible because
`table-forest-tile` and `table-city-tile` are styled only when nested inside
the game’s end-score table.

## Design

Remove the section label node and its dedicated CSS. Preserve the section’s top
separator and spacing so it remains visually distinct from the queue controls.

Render the greenery and city headers with the game’s globally available native
tile classes:

- greenery: `tile greenery-tile`;
- city: `tile city-tile`.

The existing `title` and `aria-label` values remain “Greenery VP” and “City
VP”. Score calculations, values, the sigma total heading, and all other table
columns remain unchanged.

## Verification

- Assert that the old section label is no longer rendered.
- Assert that the two headers use the globally styled native tile classes.
- Assert that the obsolete end-score-table-only classes are absent from the
  live-score renderer.
- Run focused and full extension tests, JavaScript syntax checks, and whitespace
  validation.

# Greenery VP Icon Design

## Problem

The Greenery VP header currently uses `tile greenery-tile`. That class points
to the oxygen-raising greenery image, which renders as a plain white hex in
this table instead of showing recognizable forest artwork.

## Design

Change only the Greenery VP header icon to the game’s globally available
`tile greenery-no-O2-tile` classes. The no-oxygen variant uses the native
forest artwork appropriate for scoring greenery rather than placing greenery
and raising oxygen.

Keep the “Greenery VP” tooltip and accessible label, city icon, score values,
and table layout unchanged.

## Verification

- Assert that the Greenery VP header uses `tile greenery-no-O2-tile`.
- Assert that the renderer no longer uses `tile greenery-tile`.
- Run focused and full extension tests, JavaScript syntax checks, and whitespace
  validation.

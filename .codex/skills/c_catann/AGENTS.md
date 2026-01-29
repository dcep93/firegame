# Catann Choreography Skill Guide (authoritative, self-updating)

This document is the **single source of truth** for fixing Catann choreography
failures. Update it in-place whenever new knowledge is discovered so it stays
accurate and complete. Do **not** add a changelog.

## Purpose

- Capture reliable choreography fixes for Catann test failures.
- Constrain edits to the approved Catann game logic surfaces.

## Guardrails

- Only edit files under `firegame/app/firegame/src/routes/catann/app/gameLogic`.
- Canvas interactions are allowed **only** via choreography click actions.
- If a required change is outside those areas, stop and report the needed change.
- Choreography-specific details belong as comments in the relevant test or code file, not in this guide.

## Testing workflow

- Always run the s_catann workflow to reproduce and validate fixes.
- Keep iterating until the Catann Playwright test passes.
- If a time constraint is provided, treat it as a hard stop and focus on advancing the choreography.

## Timebox procedure

- Track elapsed time from the first test run or code change (whichever comes first).
- Make minimal, high-leverage edits to move the choreography forward.
- When time is exceeded, stop immediately and package progress:
  - Ensure files are saved and changes are in a commit-ready state.
  - Record what was attempted, what advanced, and the next action to resume.

## Catann test context

- Test harness: `firegame/app/firegame/src/routes/catann/test/playwright_test.spec.ts`
- Expected message recordings: `firegame/app/firegame/src/routes/catann/test/starting_settlement.json`

## Known choreography expectations

- The test compares recorded socket message bytes after filtering heartbeats.
- The choreography should drive the UI through **click interactions only**.
- If the replay logs transient `SelectedCards` payloads containing only a `"-1"` key, filter them in the test harness `isRealMessage` so they do not shift replay ordering.
- In responses, lead with the final JSON message successfully handled in the last Catann run (the final logged message before the first error).
